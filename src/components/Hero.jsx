import ThemeToggle from './ThemeToggle';
import './Hero.css';

// Encabezado con título, botón de tema y marcador del partido.
function Hero({ darkMode, onToggleTheme }) {
  return (
    <header className="hero">
      <div className="hero__inner">
        <div className="hero__top">
          <div>
            <p className="hero__breadcrumb">
              <span className="hero__crumb hero__crumb--club">Top Club</span>
              <span className="hero__crumb-separator">/</span>
              <span className="hero__crumb hero__crumb--sport">Basketball</span>
            </p>
            <h1 className="hero__title">Central de Rendimiento</h1>
            <p className="hero__subtitle">
              Administra convocatorias, analiza métricas clave y mantén la intensidad de juego en cada partido.
            </p>
          </div>
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
        </div>

        <section className="scoreboard" aria-label="Marcador del partido">
          <div className="scoreboard__team">
            <strong className="scoreboard__code">TCB</strong>
            <span className="scoreboard__name">Top Club Flames</span>
          </div>
          <p className="scoreboard__score">
            <span className="scoreboard__points scoreboard__points--home">98</span>
            <span className="scoreboard__dash">—</span>
            <span className="scoreboard__points scoreboard__points--away">92</span>
          </p>
          <div className="scoreboard__team scoreboard__team--away">
            <strong className="scoreboard__code">RIV</strong>
            <span className="scoreboard__name">Rival All-Stars</span>
          </div>
          <div className="scoreboard__meta">
            <span className="scoreboard__clock">Q4 · 01:12</span>
            <span className="scoreboard__venue">Arena Central · 18 Nov</span>
          </div>
        </section>
      </div>
    </header>
  );
}

export default Hero;
