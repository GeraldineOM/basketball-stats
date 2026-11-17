import { useEffect, useState } from 'react';
import { formatNumber } from '../utils/players';
import './Modal.css';

const ANIMATION_MS = 250;

// Modal reutilizable con fade-in / fade-out. Se cierra con la X, con "Cerrar", con clic afuera o con Escape.
function Modal({ isOpen, onClose, player, darkMode, isFavorite, onToggleFavorite }) {
  // Mantiene el modal en pantalla mientras corre la animación de salida.
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return undefined;
    }
    const timer = setTimeout(() => setIsRendered(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cerrar con la tecla Escape. El cleanup quita el listener al cerrar.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!(isOpen || isRendered) || !player) return null;

  const details = [
    { label: 'Equipo', value: player.team },
    { label: 'Edad', value: `${player.age} años` },
    { label: 'Altura', value: `${player.height.toFixed(2)} m` },
    { label: 'Peso', value: `${player.weight} kg` },
    { label: 'Asistencias', value: player.assists },
    { label: 'Dorsal', value: formatNumber(player.number) }
  ];

  return (
    <div
      className={`modal ${isOpen ? 'modal--open' : 'modal--closing'} ${darkMode ? '' : 'modal--light'}`}
      onClick={onClose}
    >
      <article
        className="modal__card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal__header">
          <div>
            <h2 className="modal__title" id="modal-title">{player.name}</h2>
            <span className="modal__position">{player.position}</span>
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <div className="modal__body">
          <button
            type="button"
            className={`modal__favorite ${isFavorite ? 'modal__favorite--active' : ''}`}
            onClick={() => onToggleFavorite(player.id)}
          >
            {isFavorite ? '★ Favorito' : '☆ Agregar a favoritos'}
          </button>

          <dl className="modal__details">
            {details.map((item) => (
              <div key={item.label} className="modal__detail">
                <dt className="modal__detail-label">{item.label}</dt>
                <dd className="modal__detail-value">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="modal__stats">
            <div className="modal__stat modal__stat--points">
              <span className="modal__stat-label">Puntos</span>
              <strong className="modal__stat-value">{player.points}</strong>
            </div>
            <div className="modal__stat modal__stat--rebounds">
              <span className="modal__stat-label">Rebotes</span>
              <strong className="modal__stat-value">{player.rebounds}</strong>
            </div>
            <div className="modal__stat modal__stat--efficiency">
              <span className="modal__stat-label">Eficiencia</span>
              <strong className="modal__stat-value">{player.efficiency}</strong>
            </div>
          </div>

          <button type="button" className="modal__button" onClick={onClose}>Cerrar</button>
        </div>
      </article>
    </div>
  );
}

export default Modal;
