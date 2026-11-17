import './RowColorControls.css';

const OPTIONS = [
  { value: 'pares', label: 'Filas pares' },
  { value: 'impares', label: 'Filas impares' },
  { value: 'none', label: 'Limpiar resaltado' }
];

// Botones para colorear filas. El botón activo recibe el modificador --active.
function RowColorControls({ rowColors, onChange }) {
  return (
    <div className="row-colors" role="group" aria-label="Resaltar filas">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`row-colors__button ${
            rowColors === option.value && option.value !== 'none' ? 'row-colors__button--active' : ''
          }`}
          onClick={() => onChange(option.value)}
          aria-pressed={rowColors === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default RowColorControls;
