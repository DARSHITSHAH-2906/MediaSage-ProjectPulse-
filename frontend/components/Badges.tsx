import type { TaskStatus, TaskPriority } from '@/lib/types';

export function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; className: string; dot: string }> = {
    'todo': { label: 'Todo', className: 'badge badge-todo', dot: '#64748b' },
    'in-progress': { label: 'In Progress', className: 'badge badge-inprogress', dot: '#f59e0b' },
    'done': { label: 'Done', className: 'badge badge-done', dot: '#10b981' },
  };
  const { label, className, dot } = map[status];
  return (
    <span className={className}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, { label: string; className: string }> = {
    low: { label: 'Low', className: 'badge badge-low' },
    medium: { label: 'Medium', className: 'badge badge-medium' },
    high: { label: 'High', className: 'badge badge-high' },
  };
  const { label, className } = map[priority];
  return <span className={className}>{label}</span>;
}
