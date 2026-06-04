import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, pageSize, onPageChange, disabled }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-line bg-white px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Página <strong className="text-ink">{page}</strong> de{' '}
        <strong className="text-ink">{totalPages}</strong> · {total || 0} registros
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || !canGoBack}
          title="Página anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Anterior
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canGoForward}
          title="Próxima página"
        >
          Próxima
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
