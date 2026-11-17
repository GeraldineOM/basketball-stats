// Lee un valor de localStorage y lo convierte de texto (JSON) a su tipo original.
// Si no existe o está dañado, devuelve el valor por defecto.
export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Guarda cualquier valor en localStorage convirtiéndolo a texto (JSON).
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si el navegador bloquea localStorage, la app sigue funcionando sin guardar.
  }
}
