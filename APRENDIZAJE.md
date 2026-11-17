# 📚 Aprendizaje: hooks de React en Central de Rendimiento

Respuestas con ejemplos tomados del código del proyecto.

> 🤖 **IA utilizada:** este documento se elaboró con apoyo de **Claude (Anthropic), modelo Claude Opus 5.5**, y fue revisado por los integrantes del equipo.

---

## a) ¿Qué es useState y cuándo usarlo?

### Explicación

`useState` le da memoria a un componente. Devuelve dos cosas: el **valor actual** y una **función para cambiarlo**.

```jsx
const [valor, setValor] = useState(valorInicial);
```

Cuando se llama a `setValor`, React guarda el nuevo valor y **vuelve a dibujar** (re-render) el componente con él. Se usa para cualquier dato que cambie con la interacción del usuario y que deba verse en pantalla.

Reglas importantes:

- **No modificar el estado directamente.** `favorites.push(id)` no avisa a React; hay que crear un valor nuevo.
- Si el nuevo valor depende del anterior, se usa la **forma con función**: `setX(prev => ...)`, que siempre recibe el valor más reciente.
- Los hooks se llaman siempre en el nivel superior del componente, nunca dentro de `if` o ciclos.

### Ejemplo 1: término de búsqueda (`App.jsx`)

```jsx
const [searchTerm, setSearchTerm] = useState('');

<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  onClear={() => setSearchTerm('')}
  resultsCount={filteredPlayers.length}
/>
```

El input es **controlado**: su valor viene del estado y cada tecla lo actualiza con `setSearchTerm`.

### Ejemplo 2: ordenamiento con un objeto en el estado (`App.jsx`)

```jsx
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

const handleSort = (key) => {
  setSortConfig((prev) => {
    if (prev.key !== key) return { key, direction: 'asc' };
    if (prev.direction === 'asc') return { key, direction: 'desc' };
    return { key: null, direction: 'none' };
  });
};
```

Se devuelve **un objeto nuevo** en cada caso, y la forma `prev => ...` permite decidir el siguiente paso del ciclo (sin ordenar → ascendente → descendente → sin ordenar) a partir del estado anterior.

### Ejemplo 3: favoritos con un arreglo inmutable (`App.jsx`)

```jsx
const [favorites, setFavorites] = useState([]);

const toggleFavorite = (id) => {
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
  );
};
```

Para quitar se usa `filter` y para agregar el operador spread (`[...prev, id]`). Ambos crean un **arreglo nuevo**, así React detecta el cambio.

**Otros estados del proyecto:** `rowColors` (`'none' | 'pares' | 'impares'`), `currentPage`, `itemsPerPage`, `showOnlyFavorites`, `selectedPlayer`, `isModalOpen` y `darkMode`.

---

## b) ¿Qué es useEffect y sus casos de uso?

### Explicación del ciclo de vida

`useEffect` ejecuta código **después** de que React dibuja el componente. Sirve para los **efectos secundarios**: trabajos que no son "dibujar", como timers, localStorage, listeners del teclado o sincronizar un estado con otro.

Un componente pasa por tres momentos:

1. **Montaje:** aparece por primera vez. Se ejecutan todos los efectos.
2. **Actualización:** se vuelve a dibujar porque cambió un estado o una prop. Se ejecutan los efectos cuyas dependencias cambiaron, y antes de cada uno, su cleanup anterior.
3. **Desmontaje:** desaparece de la pantalla. Se ejecutan los cleanup.

### Diferencia entre `[]`, `[dep]` y sin arreglo

| Forma | Se ejecuta | Ejemplo del proyecto |
|---|---|---|
| `useEffect(fn, [])` | Una sola vez, al montar | Cargar favoritos e historial desde localStorage |
| `useEffect(fn, [dep])` | Al montar y cada vez que cambia `dep` | Debounce con `[searchTerm]`, guardar tema con `[darkMode]` |
| `useEffect(fn)` | Después de **cada** render | No se usa: puede generar ciclos infinitos si cambia un estado |

**Ejemplo con `[]`: carga inicial (`App.jsx`)**

```jsx
useEffect(() => {
  setFavorites(readStorage('favorites', []));
  setSearchHistory(readStorage('searchHistory', []));
  setIsStorageLoaded(true);
}, []);
```

**Ejemplo con `[dep]`: volver a la página 1 cuando cambia un filtro (`App.jsx`)**

```jsx
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, showOnlyFavorites, itemsPerPage]);
```

Si el usuario está en la página 3 y busca un nombre con 2 resultados, sin este efecto vería una página vacía.

### Ejemplo de cleanup function: cerrar el modal con Escape (`Modal.jsx`)

```jsx
useEffect(() => {
  if (!isOpen) return undefined;
  const handleKey = (event) => {
    if (event.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, [isOpen, onClose]);
```

El listener solo existe mientras el modal está abierto. Al cerrarse, el cleanup lo quita; sin él, cada apertura agregaría un listener nuevo que nunca se elimina (fuga de memoria).

---

## c) ¿Qué es useMemo y cuándo usarlo?

### Explicación

`useMemo` **memoriza el resultado de un cálculo** y solo lo vuelve a calcular cuando cambian sus dependencias. En los demás renders devuelve el valor guardado.

```jsx
const resultado = useMemo(() => calculoCostoso(datos), [datos]);
```

Se usa cuando un cálculo recorre muchos datos y el componente se vuelve a dibujar por razones que no lo afectan.

### Diferencia con useCallback

| | `useMemo` | `useCallback` |
|---|---|---|
| Guarda | El **resultado** de una función (un valor) | La **función** misma |
| Ejemplo | `useMemo(() => calcularStats(lista), [lista])` | `useCallback((id) => toggle(id), [])` |
| Equivalencia | — | `useCallback(fn, deps)` = `useMemo(() => fn, deps)` |

`useCallback` sirve para no crear una función nueva en cada render, útil cuando se pasa a componentes optimizados con `React.memo`. En este proyecto no hizo falta.

### Ejemplo de optimización del proyecto (`App.jsx`)

```jsx
const filteredPlayers = useMemo(() => {
  const term = debouncedSearch.toLowerCase();
  return players
    .filter((player) => player.name.toLowerCase().includes(term))
    .filter((player) => !showOnlyFavorites || favorites.includes(player.id));
}, [debouncedSearch, showOnlyFavorites, favorites]);

const stats = useMemo(() => ({
  total: filteredPlayers.length,
  avgPoints: calculateAverage(filteredPlayers, 'points'),
  avgRebounds: calculateAverage(filteredPlayers, 'rebounds'),
  avgAge: calculateAverage(filteredPlayers, 'age'),
  topScorer: findTopBy(filteredPlayers, 'points'),
  topEfficiency: findTopBy(filteredPlayers, 'efficiency'),
  byPosition: countByPosition(filteredPlayers)
}), [filteredPlayers]);
```

Al cambiar de página, abrir el modal, resaltar filas o escribir sin haber terminado (antes del debounce), `App` se vuelve a dibujar, pero `filteredPlayers` no cambia. Gracias a `useMemo`, el filtro y las estadísticas **no se recalculan** en esos casos; solo cuando cambia la búsqueda, el filtro de favoritos o la lista de favoritos.

---

## d) ¿Cómo funciona el cleanup en useEffect?

### Explicación

La función que **retorna** un `useEffect` es su cleanup. React la ejecuta:

1. **Antes de volver a ejecutar el efecto**, cuando cambia una dependencia.
2. **Cuando el componente se desmonta.**

Sirve para deshacer lo que hizo el efecto: cancelar timers, quitar listeners o cerrar suscripciones.

### Ejemplo con el debounce del proyecto (`App.jsx`)

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm.trim());
  }, 300);

  return () => clearTimeout(timer); // CLEANUP
}, [searchTerm]);
```

Paso a paso cuando el usuario escribe "jam" rápido:

| Momento | `searchTerm` | Qué pasa |
|---|---|---|
| 0 ms | `j` | Se programa el timer 1 (vence a los 300 ms) |
| 80 ms | `ja` | El cleanup **cancela el timer 1**; se programa el timer 2 |
| 160 ms | `jam` | El cleanup **cancela el timer 2**; se programa el timer 3 |
| 460 ms | `jam` | El timer 3 vence: `debouncedSearch = 'jam'` y se filtra la tabla |

Sin el cleanup, los tres timers se ejecutarían y la tabla se filtraría tres veces ('j', 'ja', 'jam'). Con él, se filtra **una sola vez**, cuando el usuario deja de escribir.

Por eso hay **dos estados**: `searchTerm` actualiza el input al instante y `debouncedSearch` es el que se usa para filtrar y guardar en el historial.

---

## e) ¿Cómo funciona localStorage con React?

### Explicación

`localStorage` es un almacenamiento del navegador que **persiste** aunque se cierre o recargue la página. Tiene tres reglas que condicionan cómo se usa con React:

1. **Solo guarda texto.** Por eso se usa `JSON.stringify` para guardar y `JSON.parse` para leer. Sin JSON, el booleano `false` se guardaría como el texto `"false"`, que en JavaScript cuenta como verdadero.
2. **Es un efecto secundario.** Escribir en él se hace dentro de `useEffect`, después de dibujar.
3. **Puede fallar** (navegación privada, almacenamiento bloqueado). Por eso el proyecto lo envuelve en `try/catch`.

**Funciones auxiliares (`utils/storage.js`):**

```jsx
export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si el navegador bloquea localStorage, la app sigue funcionando sin guardar.
  }
}
```

### Ejemplo de persistencia 1: modo oscuro con inicialización perezosa (`App.jsx`)

```jsx
const [darkMode, setDarkMode] = useState(() => readStorage('darkMode', true));

useEffect(() => {
  writeStorage('darkMode', darkMode);
  document.body.classList.toggle('light-mode', !darkMode);
}, [darkMode]);
```

Pasar una **función** a `useState` hace que localStorage se lea **una sola vez, antes del primer render**. Así la página aparece directamente en el tema guardado, sin un parpadeo. Si no hay nada guardado, el valor por defecto es `true`: la aplicación arranca en modo oscuro, como en el diseño de referencia. El efecto agrega o quita la clase `light-mode` del `<body>`, y esa clase cambia las variables de color de `index.css`.

### Ejemplo de persistencia 2: favoritos con carga inicial `[]` (`App.jsx`)

```jsx
useEffect(() => {
  setFavorites(readStorage('favorites', []));
  setSearchHistory(readStorage('searchHistory', []));
  setIsStorageLoaded(true);
}, []);

useEffect(() => {
  if (isStorageLoaded) writeStorage('favorites', favorites);
}, [favorites, isStorageLoaded]);
```

¿Por qué `isStorageLoaded`? Al montar se ejecutan **todos** los efectos. Sin esa bandera, el efecto de guardado escribiría el arreglo vacío inicial (`[]`) y borraría los favoritos antes de que la carga los recupere. La bandera asegura que **solo se guarde después de haber leído**.

**Resultado en el navegador** (F12 › Application › Local Storage):

```text
darkMode       true
favorites      [1,3,9]
searchHistory  ["jeff","scott","noah","bryan","kevin"]
```
