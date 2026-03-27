import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import type { TaskStatus, TaskPriority } from '@/lib/types';

interface TaskFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: TaskStatus | 'all';
  setStatusFilter: (s: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  setPriorityFilter: (p: TaskPriority | 'all') => void;
  taskCount: number;
  onFilterChange?: () => void;
  actions?: React.ReactNode;
}

export default function TaskFilters({
  search, setSearch, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, taskCount, onFilterChange, actions
}: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleStatus = (s: TaskStatus | 'all') => { setStatusFilter(s); onFilterChange?.(); };
  const handlePriority = (p: TaskPriority | 'all') => { setPriorityFilter(p); onFilterChange?.(); };
  const handleSearch = (s: string) => { setSearch(s); onFilterChange?.(); };
  const handleClear = () => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); onFilterChange?.(); };

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
          <input
            className="input"
            style={{ paddingLeft: 32, height: 36, fontSize: 12 }}
            placeholder="Search tasks..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        <button
          className={`btn-ghost ${showFilters ? 'btn-ghost-active' : ''}`}
          style={{ padding: '6px 12px', fontSize: 12, gap: 5, height: 34, background: showFilters ? 'rgba(192, 193, 255, 0.1)' : '', borderColor: showFilters ? 'rgba(192, 193, 255, 0.3)' : '' }}
          onClick={() => setShowFilters(v => !v)}
        >
          <Filter size={12} /> Filters {showFilters ? '▲' : '▼'}
        </button>
        
        {actions}

        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--outline)' }}>
          {taskCount} task{taskCount !== 1 ? 's' : ''}
        </div>
      </div>

      {showFilters && (
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.15)', borderRadius: 10, padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
          <div className="pill-tabs" style={{ marginRight: 16 }}>
            {(['all', 'todo', 'in-progress', 'done'] as const).map(s => (
              <button key={s} className={`pill-tab ${statusFilter === s ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => handleStatus(s)}>
                {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</span>
          <div className="pill-tabs">
            {(['all', 'low', 'medium', 'high'] as const).map(p => (
              <button key={p} className={`pill-tab ${priorityFilter === p ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => handlePriority(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          
          {(priorityFilter !== 'all' || statusFilter !== 'all' || search) && (
            <button className="btn-ghost" style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 10px', height: 'auto' }}
              onClick={handleClear}>
              Clear all
            </button>
          )}
        </div>
      )}
    </>
  );
}
