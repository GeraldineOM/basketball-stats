import PlayerRow from './PlayerRow';
import './PlayerTable.css';

const COLUMNS = [
  { key: 'number', label: '#' },
  { key: 'name', label: 'Jugador' },
  { key: 'team', label: 'Equipo' },
  { key: 'position', label: 'Posición' },
  { key: 'points', label: 'PTS', numeric: true },
  { key: 'rebounds', label: 'REB', numeric: true },
  { key: 'assists', label: 'AST', numeric: true },
  { key: 'efficiency', label: 'Eficiencia', numeric: true }
];

// Indicador de orden: ↑ ascendente, ↓ descendente, ↕ sin ordenar.
function getArrow(sortConfig, key) {
  if (sortConfig.key !== key || sortConfig.direction === 'none') return '↕';
  return sortConfig.direction === 'asc' ? '↑' : '↓';
}

// Clase de color según el número visual de la fila (1, 2, 3...).
function getColorClass(rowColors, rowNumber) {
  if (rowColors === 'pares' && rowNumber % 2 === 0) return 'player-row--even';
  if (rowColors === 'impares' && rowNumber % 2 !== 0) return 'player-row--odd';
  return '';
}

function PlayerTable({ players, onRowClick, onSort, sortConfig, darkMode, rowColors, favorites, onToggleFavorite }) {
  return (
    <div className={`player-table ${darkMode ? '' : 'player-table--light'}`}>
      <table className="player-table__table">
        <thead className="player-table__head">
          <tr>
            <th className="player-table__th player-table__th--fav" scope="col">Fav</th>
            {COLUMNS.map((column) => {
              const isActive = sortConfig.key === column.key && sortConfig.direction !== 'none';
              return (
                <th
                  key={column.key}
                  className={`player-table__th ${column.numeric ? 'player-table__th--numeric' : ''}`}
                  scope="col"
                  aria-sort={isActive ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    className={`player-table__sort ${isActive ? 'player-table__sort--active' : ''}`}
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    <span className="player-table__arrow" aria-hidden="true">{getArrow(sortConfig, column.key)}</span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="player-table__body">
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={index}
              onClick={onRowClick}
              isFavorite={favorites.includes(player.id)}
              onToggleFavorite={onToggleFavorite}
              darkMode={darkMode}
              colorClass={getColorClass(rowColors, index + 1)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerTable;
