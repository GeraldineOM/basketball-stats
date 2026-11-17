import './ThemeToggle.css';

// Botón para cambiar entre modo oscuro y claro. Muestra la acción disponible.
function ThemeToggle({ darkMode, onToggle }) {
  return (
    <button
      type="button"
      className={`theme-toggle ${darkMode ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
      onClick={onToggle}
      role="switch"
      aria-checked={darkMode}
      aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
      {darkMode ? 'Modo claro' : 'Modo oscuro'}
    </button>
  );
}

export default ThemeToggle;
