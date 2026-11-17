import { positions } from '../data/players';

// Ordena una COPIA del arreglo (sort modifica el original, por eso usamos [...players]).
export function sortPlayers(players, sortConfig) {
  const { key, direction } = sortConfig;
  if (!key || direction === 'none') return players;

  const sorted = [...players].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    if (typeof valueA === 'string') return valueA.localeCompare(valueB, 'es');
    return valueA - valueB;
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}

// Promedio de un campo numérico. Con 0 jugadores devuelve 0 (evita dividir por cero).
export function calculateAverage(players, field) {
  if (players.length === 0) return 0;
  const total = players.reduce((sum, player) => sum + player[field], 0);
  return total / players.length;
}

// Jugador con el valor más alto en un campo (puntos, eficiencia...). null si no hay jugadores.
export function findTopBy(players, field) {
  if (players.length === 0) return null;
  return players.reduce((max, player) => (player[field] > max[field] ? player : max));
}

// Cuenta cuántos jugadores hay en cada posición.
export function countByPosition(players) {
  return positions.map((position) => ({
    position,
    count: players.filter((player) => player.position === position).length
  }));
}

// Números de página visibles: hasta 5 alrededor de la página actual.
export function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let page = start; page <= end; page++) pages.push(page);
  return pages;
}

// Muestra el dorsal siempre con dos cifras: 3 -> "03".
export function formatNumber(number) {
  return String(number).padStart(2, '0');
}
