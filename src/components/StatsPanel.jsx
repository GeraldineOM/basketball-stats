import './StatsPanel.css';

// Panel de estadísticas. Los valores llegan calculados (con useMemo) desde App.
// children permite insertar otro componente como tarjeta (el historial de búsqueda).
function StatsPanel({ stats, favoritesCount, darkMode, children }) {
  const maxCount = Math.max(1, ...stats.byPosition.map((item) => item.count));
  const { topScorer, topEfficiency } = stats;

  return (
    <section className={`stats-panel ${darkMode ? '' : 'stats-panel--light'}`} aria-label="Estadísticas">
      <div className="stats-panel__grid">
        <article className="stats-panel__card stats-panel__card--highlight">
          <h2 className="stats-panel__label">Jugadores en tabla</h2>
          <strong className="stats-panel__value">{stats.total}</strong>
          <span className="stats-panel__badge">Favoritos: {favoritesCount}</span>
        </article>

        <article className="stats-panel__card">
          <h2 className="stats-panel__label">Promedio de puntos</h2>
          <strong className="stats-panel__value stats-panel__value--small">{stats.avgPoints.toFixed(1)}</strong>
          <span className="stats-panel__hint">Edad promedio: {stats.avgAge.toFixed(1)} años</span>
        </article>

        <article className="stats-panel__card">
          <h2 className="stats-panel__label">Promedio de rebotes</h2>
          <strong className="stats-panel__value stats-panel__value--small">{stats.avgRebounds.toFixed(1)}</strong>
          <span className="stats-panel__hint">Por partido</span>
        </article>

        <article className="stats-panel__card stats-panel__card--leaders">
          <h2 className="stats-panel__label stats-panel__label--strong">Líderes</h2>
          {topScorer ? (
            <>
              <p className="stats-panel__leader">
                <span className="stats-panel__leader-title">Anotador</span>
                {topScorer.name} · {topScorer.points} pts · {topScorer.assists} ast
              </p>
              <p className="stats-panel__leader">
                <span className="stats-panel__leader-title">Eficiencia</span>
                {topEfficiency.name} · {topEfficiency.efficiency} PER
              </p>
            </>
          ) : (
            <p className="stats-panel__leader">Sin datos</p>
          )}
        </article>

        {children}
      </div>

      <article className="stats-panel__card stats-panel__card--wide">
        <h2 className="stats-panel__label">Distribución por posición</h2>
        <ul className="stats-panel__bars">
          {stats.byPosition.map((item) => (
            <li key={item.position} className="stats-panel__bar-row">
              <span className="stats-panel__bar-name">{item.position}</span>
              <span className="stats-panel__bar-track">
                <span
                  className="stats-panel__bar-fill"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </span>
              <span className="stats-panel__bar-count">{item.count}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export default StatsPanel;
