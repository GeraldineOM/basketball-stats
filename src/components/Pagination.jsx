import { getPageNumbers } from '../utils/players';
import './Pagination.css';

const PAGE_SIZES = [5, 10, 15, 20, 25];

// Controles de paginación: tamaño de página, resumen "Mostrando X-Y de Z" y navegación.
function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems }) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const navButtons = {
    first: { label: 'Primera', symbol: '«', page: 1, disabled: isFirst },
    previous: { label: 'Anterior', symbol: '‹', page: currentPage - 1, disabled: isFirst },
    next: { label: 'Siguiente', symbol: '›', page: currentPage + 1, disabled: isLast },
    last: { label: 'Última', symbol: '»', page: totalPages, disabled: isLast }
  };

  const renderNav = ({ label, symbol, page, disabled }) => (
    <button
      type="button"
      className="pagination__button pagination__button--nav"
      onClick={() => onPageChange(page)}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {symbol}
    </button>
  );

  return (
    <nav className="pagination" aria-label="Paginación de jugadores">
      <div className="pagination__left">
        <label className="pagination__size">
          Mostrar
          <select
            className="pagination__select"
            value={itemsPerPage}
            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size} por página</option>
            ))}
          </select>
        </label>
        <p className="pagination__info">
          Mostrando {firstItem}-{lastItem} de {totalItems} registros
        </p>
      </div>

      <div className="pagination__buttons">
        {renderNav(navButtons.first)}
        {renderNav(navButtons.previous)}
        {getPageNumbers(currentPage, totalPages).map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination__button ${page === currentPage ? 'pagination__button--active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        {renderNav(navButtons.next)}
        {renderNav(navButtons.last)}
      </div>
    </nav>
  );
}

export default Pagination;
