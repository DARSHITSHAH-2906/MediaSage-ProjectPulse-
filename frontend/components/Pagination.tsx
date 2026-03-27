'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
      <button
        className="btn-ghost disabled:cursor-not-allowed"
        onClick={() => onPageChange(page - 1)}
        disabled={page == 1}
        style={{ opacity: page <= 1 ? 0.4 : 1, padding: '6px 12px' }}
      >
        <ChevronLeft size={14} /> Previous
      </button>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              width: 32, height: 32, borderRadius: 6, border: 'none',
              background: p === page ? 'var(--primary)' : 'var(--surface-high)',
              color: p === page ? '#fff' : 'var(--on-surface-muted)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}
          >{p}</button>
        ))}
      </div>
      <button
        className="btn-ghost disabled:cursor-not-allowed"
        onClick={() => onPageChange(page + 1)}
        disabled={page == totalPages}
        style={{ opacity: page >= totalPages ? 0.4 : 1, padding: '6px 12px' }}
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
