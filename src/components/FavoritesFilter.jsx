import './FavoritesFilter.css';

// Contador de favoritos y opción para mostrar solo favoritos.
function FavoritesFilter({ count, showOnlyFavorites, onToggle }) {
  return (
    <div className={`favorites-filter ${showOnlyFavorites ? 'favorites-filter--active' : ''}`}>
      <label className="favorites-filter__label">
        <input
          type="checkbox"
          className="favorites-filter__checkbox"
          checked={showOnlyFavorites}
          onChange={onToggle}
        />
        Mostrar solo favoritos
      </label>
      <span className="favorites-filter__count">
        ★ {count} {count === 1 ? 'favorito guardado' : 'favoritos guardados'}
      </span>
    </div>
  );
}

export default FavoritesFilter;
