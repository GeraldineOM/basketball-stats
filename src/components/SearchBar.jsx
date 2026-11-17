import './SearchBar.css';

// Barra de búsqueda controlada: el valor vive en App y llega por props.
function SearchBar({ value, onChange, onClear, resultsCount }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="search-input">Buscar jugadores</label>
      <div className="search-bar__row">
        <div className={`search-bar__field ${value ? 'search-bar__field--active' : ''}`}>
          <span className="search-bar__icon" aria-hidden="true">🔍</span>
          <input
            id="search-input"
            className="search-bar__input"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Escribe el nombre de un jugador..."
            autoComplete="off"
          />
          {value && (
            <button type="button" className="search-bar__clear" onClick={onClear} aria-label="Limpiar búsqueda">
              ×
            </button>
          )}
        </div>
        {value && (
          <button type="button" className="search-bar__button" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>
      <p className="search-bar__count" aria-live="polite">
        Mostrando {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
      </p>
    </div>
  );
}

export default SearchBar;
