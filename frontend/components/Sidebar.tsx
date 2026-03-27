'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  Zap,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        background: 'var(--surface-low)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(192, 193, 255, 0.35)',
          }}>
            <Zap size={18} color="var(--on-primary)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              ProjectPulse
            </div>
            <div style={{ fontSize: 10, color: 'var(--outline)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Workspace</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', marginTop: 12 }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                background: isActive ? 'rgba(192, 193, 255, 0.12)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--on-surface-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
                position: 'relative',
              }}
              className={clsx({ 'sidebar-link-active': isActive })}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 18, background: 'var(--primary)', borderRadius: '0 3px 3px 0',
                }} />
              )}
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '16px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 32, height: 32, minWidth: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--on-primary)',
            }}>{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name ?? 'Loading...'}</div>
              <div style={{ fontSize: 10, color: 'var(--outline)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email ?? 'User'}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-ghost" style={{ flexShrink: 0, padding: 6, color: 'var(--red)', display: 'flex' }} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
