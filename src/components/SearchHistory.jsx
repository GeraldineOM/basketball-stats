import './SearchHistory.css';

// Lista con las últimas 5 búsquedas. Un clic en una etiqueta la vuelve a buscar.
function SearchHistory({ history, onSelectSearch, onClearHistory }) {
  return (
    <article className="search-history">
      <header className="search-history__header">
        <h2 className="search-history__title">Historial de búsqueda</h2>
        {history.length > 0 && (
          <button type="button" className="search-history__clear" onClick={onClearHistory}>
            Limpiar
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <p className="search-history__empty">Sin búsquedas recientes</p>
      ) : (
        <ul className="search-history__list">
          {history.map((term) => (
            <li key={term}>
              <button type="button" className="search-history__chip" onClick={() => onSelectSearch(term)}>
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default SearchHistory;
