import { useEffect, useMemo, useState } from 'react';
import { players } from './data/players';
import { readStorage, writeStorage } from './utils/storage';
import { calculateAverage, countByPosition, findTopBy, sortPlayers } from './utils/players';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import StatsPanel from './components/StatsPanel';
import RowColorControls from './components/RowColorControls';
import FavoritesFilter from './components/FavoritesFilter';
import PlayerTable from './components/PlayerTable';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import './App.css';

function App() {
  // ---------- ESTADOS (useState) ----------
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [rowColors, setRowColors] = useState('none'); // 'none' | 'pares' | 'impares'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  // Inicialización perezosa: lee el tema guardado ANTES del primer render (sin parpadeo).
  const [darkMode, setDarkMode] = useState(() => readStorage('darkMode', true));

  // ---------- EFECTOS (useEffect) ----------
  // 1. Carga inicial con [] : se ejecuta una sola vez al montar.
  useEffect(() => {
    setFavorites(readStorage('favorites', []));
    setSearchHistory(readStorage('searchHistory', []));
    setIsStorageLoaded(true);
  }, []);

  // 2. Debounce: espera 300 ms sin escribir antes de buscar. El cleanup cancela el timer anterior.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Guarda el tema y aplica la clase al <body> cada vez que cambia.
  useEffect(() => {
    writeStorage('darkMode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  // 4. Guarda favoritos e historial (solo después de la carga inicial, para no borrarlos).
  useEffect(() => {
    if (isStorageLoaded) writeStorage('favorites', favorites);
  }, [favorites, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded) writeStorage('searchHistory', searchHistory);
  }, [searchHistory, isStorageLoaded]);

  // 5. Historial: guarda las últimas 5 búsquedas (sin repetir).
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      setSearchHistory((prev) => {
        const updated = [debouncedSearch, ...prev.filter((s) => s !== debouncedSearch)];
        return updated.slice(0, 5);
      });
    }
  }, [debouncedSearch]);

  // 6. La paginación vuelve a la página 1 cuando cambian los filtros o el tamaño de página.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showOnlyFavorites, itemsPerPage]);

  // ---------- DATOS DERIVADOS (useMemo) ----------
  const filteredPlayers = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return players
      .filter((player) => player.name.toLowerCase().includes(term))
      .filter((player) => !showOnlyFavorites || favorites.includes(player.id));
  }, [debouncedSearch, showOnlyFavorites, favorites]);

  const sortedPlayers = useMemo(() => sortPlayers(filteredPlayers, sortConfig), [filteredPlayers, sortConfig]);

  const stats = useMemo(() => ({
    total: filteredPlayers.length,
    avgPoints: calculateAverage(filteredPlayers, 'points'),
    avgRebounds: calculateAverage(filteredPlayers, 'rebounds'),
    avgAge: calculateAverage(filteredPlayers, 'age'),
    topScorer: findTopBy(filteredPlayers, 'points'),
    topEfficiency: findTopBy(filteredPlayers, 'efficiency'),
    byPosition: countByPosition(filteredPlayers)
  }), [filteredPlayers]);

  const totalPages = Math.max(1, Math.ceil(sortedPlayers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagePlayers = sortedPlayers.slice(startIndex, startIndex + itemsPerPage);

  // 7. Si se quitan favoritos y la página actual deja de existir, retrocede a la última.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // ---------- MANEJADORES DE EVENTOS ----------
  // Ciclo: sin ordenar -> ascendente -> descendente -> sin ordenar.
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'none' };
    });
  };

  // Agrega o quita un id sin modificar el arreglo original (inmutabilidad).
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const openModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <Hero darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />

      <main className="app__panel">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          resultsCount={filteredPlayers.length}
        />

        <StatsPanel stats={stats} favoritesCount={favorites.length} darkMode={darkMode}>
          <SearchHistory
            history={searchHistory}
            onSelectSearch={setSearchTerm}
            onClearHistory={() => setSearchHistory([])}
          />
        </StatsPanel>

        <div className="app__actions">
          <RowColorControls rowColors={rowColors} onChange={setRowColors} />
          <FavoritesFilter
            count={favorites.length}
            showOnlyFavorites={showOnlyFavorites}
            onToggle={() => setShowOnlyFavorites((prev) => !prev)}
          />
        </div>

        <PlayerTable
          players={pagePlayers}
          onRowClick={openModal}
          onSort={handleSort}
          sortConfig={sortConfig}
          darkMode={darkMode}
          rowColors={rowColors}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={sortedPlayers.length}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        player={selectedPlayer}
        darkMode={darkMode}
        isFavorite={selectedPlayer ? favorites.includes(selectedPlayer.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
