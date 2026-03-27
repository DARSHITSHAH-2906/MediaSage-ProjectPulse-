'use client';
import { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle, Clock } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, UpdateTaskInput } from '@/lib/types';
import { format, isPast, parseISO } from 'date-fns';

interface Props {
  task: Task;
  onClose: () => void;
  onSave: (id: string, data: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EditTaskDrawer({ task, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date.split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isOverdue = dueDate && isPast(parseISO(dueDate + 'T23:59:59Z'));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setErrors({ title: 'Title is required' }); return; }
    setLoading(true);
    try {
      await onSave(task.id, { title, description, priority, due_date: dueDate + 'T00:00:00Z' });
      onClose();
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    await onDelete(task.id);
    onClose();
  };

  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'todo', label: '○ Todo', color: '#94a3b8' },
    { value: 'in-progress', label: '● In Progress', color: '#f59e0b' },
    { value: 'done', label: '✓ Done', color: '#10b981' },
  ];

  const priorityBtns: { value: TaskPriority; label: string; cls: string }[] = [
    { value: 'low', label: 'Low', cls: 'active-low' },
    { value: 'medium', label: 'Medium', cls: 'active-medium' },
    { value: 'high', label: 'High', cls: 'active-high' },
  ];

  return (
    <div className="drawer-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer-box animate-slide-right">
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(70,69,84,0.2)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>Edit Task</h2>
              <span style={{ fontSize: 11, color: 'var(--outline)', background: 'var(--surface-highest)', padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace' }}>
                #{task.id}
              </span>
            </div>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label className="field-label">Task Title <span style={{ color: '#f87171' }}>*</span></label>
            <input
              className={`input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
            />
            {errors.title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, color: '#f87171', fontSize: 12 }}>
                <AlertCircle size={12} /> {errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Description</label>
            <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 80 }} />
          </div>

          {/* Status */}
          <div>
            <label className="field-label">Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={{ color: statusOptions.find(s => s.value === status)?.color }}
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="field-label">Priority</label>
            <div className="seg-ctrl">
              {priorityBtns.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`seg-btn ${priority === p.value ? p.cls : ''}`}
                  onClick={() => setPriority(p.value)}
                >{p.label}</button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="field-label">Due Date</label>
            <input
              type="date"
              className={`input ${isOverdue ? 'error' : ''}`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />
            {isOverdue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, color: '#f87171', fontSize: 12 }}>
                <Clock size={12} /> Task is overdue!
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div>
            <button
              type="button"
              onClick={() => setShowLog(!showLog)}
              style={{ fontSize: 12, color: 'var(--outline)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}
            >
              {showLog ? '▾' : '▸'} Activity Log
            </button>
            {showLog && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { text: 'Changed status to In Progress', time: '2h ago', initials: 'AR' },
                  { text: 'Task created', time: '1d ago', initials: 'AR' },
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{log.initials}</div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--on-surface)' }}>{log.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--outline)' }}>{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(70,69,84,0.2)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button type="button" className="btn-danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
