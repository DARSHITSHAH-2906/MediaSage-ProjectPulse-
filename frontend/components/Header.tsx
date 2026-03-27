'use client';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface HeaderProps {
  breadcrumbs: string[];
  actions?: React.ReactNode;
}

export default function Header({ breadcrumbs, actions }: HeaderProps) {
  const { user } = useAuthStore();
  
  return (
    <header style={{
      height: 60,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      background: 'transparent',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      marginTop: 16,
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: 'var(--outline-variant)', fontSize: 13 }}>/</span>}
            <span style={{
              fontSize: 13,
              color: i === breadcrumbs.length - 1 ? 'var(--on-surface)' : 'var(--outline)',
              fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
            }}>{crumb}</span>
          </span>
        ))}
      </div>



      {/* Actions */}
      {actions}

    </header>
  );
}
