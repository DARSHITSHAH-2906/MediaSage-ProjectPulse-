'use client';
import { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import type { Task, TaskStatus } from '@/lib/types';
import { StatusBadge, PriorityBadge } from './Badges';
import { format, isPast, parseISO } from 'date-fns';
import EditTaskDrawer from './EditTaskDrawer';
import type { UpdateTaskInput } from '@/lib/types';

interface Props {
  tasks: Task[];
  onUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddTask: (status: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string; bg: string }[] = [
  { status: 'todo', label: 'Todo', color: '#94a3b8', bg: 'rgba(100,116,139,0.12)' },
  { status: 'in-progress', label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { status: 'done', label: 'Done', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
];

export default function KanbanBoard({ tasks, onUpdate, onDelete, onAddTask }: Props) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getColumnTasks = (status: TaskStatus) => tasks.filter(t => t.status === status);

  return (
    <>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
        {COLUMNS.map(col => {
          const colTasks = getColumnTasks(col.status);
          return (
            <div key={col.status} className="kanban-col">
              {/* Column Header */}
              <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(70,69,84,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>{col.label}</span>
                  <span style={{ background: col.bg, color: col.color, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="kanban-col-body">
                {colTasks.map(task => {
                  const overdue = task.due_date && isPast(parseISO(task.due_date)) && task.status !== 'done';
                  return (
                    <div
                      key={task.id}
                      className="kanban-card"
                      onClick={() => setEditingTask(task)}
                      style={{ borderLeft: `3px solid ${col.color}30`, position: 'relative' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 8 }}>
                        <GripVertical size={13} style={{ color: 'var(--outline-variant)', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.4 }}>{task.title}</span>
                      </div>
                      {task.description && (
                        <p style={{ fontSize: 12, color: 'var(--on-surface-muted)', marginBottom: 10, marginLeft: 19, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 19 }}>
                        <PriorityBadge priority={task.priority} />
                        <span style={{ fontSize: 11, color: overdue ? '#f87171' : 'var(--outline)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          {overdue && <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />}
                          {format(parseISO(task.due_date), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => onAddTask(col.status)}
                  style={{
                    width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed rgba(70,69,84,0.4)',
                    background: 'transparent', color: 'var(--outline)', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 4,
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                  }}
                >
                  <Plus size={12} /> Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingTask && (
        <EditTaskDrawer
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
