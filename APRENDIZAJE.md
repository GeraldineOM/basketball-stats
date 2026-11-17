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

