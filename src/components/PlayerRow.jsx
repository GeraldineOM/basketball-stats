import { formatNumber } from '../utils/players';
import './PlayerRow.css';

// Fila de un jugador. Un clic en la fila abre el modal; la estrella marca favorito.
function PlayerRow({ player, index, onClick, isFavorite, onToggleFavorite, darkMode, colorClass }) {
  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // evita que el clic "suba" a la fila y abra el modal
    onToggleFavorite(player.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') onClick(player);
  };

  return (
    <tr
      className={`player-row ${colorClass} ${darkMode ? '' : 'player-row--light'}`}
      onClick={() => onClick(player)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Fila ${index + 1}: ver detalles de ${player.name}`}
    >
      <td className="player-row__cell player-row__cell--fav">
        <button
          type="button"
          className={`player-row__star ${isFavorite ? 'player-row__star--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Quitar a ${player.name} de favoritos` : `Agregar a ${player.name} a favoritos`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
      <td className="player-row__cell player-row__cell--number">{formatNumber(player.number)}</td>
      <td className="player-row__cell player-row__cell--name">{player.name}</td>
      <td className="player-row__cell">{player.team}</td>
      <td className="player-row__cell">{player.position}</td>
      <td className="player-row__cell player-row__cell--numeric">{player.points}</td>
      <td className="player-row__cell player-row__cell--numeric">{player.rebounds}</td>
      <td className="player-row__cell player-row__cell--numeric">{player.assists}</td>
      <td className="player-row__cell player-row__cell--numeric">{player.efficiency}</td>
    </tr>
  );
}

export default PlayerRow;
