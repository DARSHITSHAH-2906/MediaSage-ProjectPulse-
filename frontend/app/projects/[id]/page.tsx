'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, Pencil, ArrowUpDown, Kanban, List, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import EditTaskDrawer from '@/components/EditTaskDrawer';
import Pagination from '@/components/Pagination';
import TaskFilters from '@/components/TaskFilters';
import Loader from '@/components/Loader';
import { getProject, getTasks, createTask, updateTask, deleteTask, deleteProject } from '@/lib/api';
import type { Project, Task, TaskStatus, TaskPriority, UpdateTaskInput, CreateTaskInput } from '@/lib/types';
import { format, isPast, parseISO } from 'date-fns';
import Link from 'next/link';

const LIMIT = 8;

type SortKey = 'title' | 'due_date' | 'priority' | 'status' | 'created_at';
const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, todo: 1, done: 2 };

function AddTaskModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: CreateTaskInput) => void }) {
  const [form, setForm] = useState<CreateTaskInput>({ title: '', description: '', priority: 'medium', due_date: '' });
  const [err, setErr] = useState('');
  const set = (k: keyof CreateTaskInput, v: string) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title required'); return; }
    if (!form.due_date) { setErr('Due date required'); return; }
    onSubmit({ ...form, due_date: form.due_date + 'T00:00:00Z' });
  };
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ width: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--on-surface)' }}>Add New Task</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="divider" />
        <form onSubmit={handleSubmit} style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="field-label">Title *</label>
            <input className="input" placeholder="Task title..." value={form.title} onChange={e => { set('title', e.target.value); setErr(''); }} />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="input" placeholder="Task description..." value={form.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">Priority</label>
              <select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="field-label">Due Date *</label>
              <input type="date" className="input" value={form.due_date} onChange={e => set('due_date', e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>
          </div>
          {err && <p style={{ color: '#f87171', fontSize: 12 }}>{err}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('due_date');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const pRes = await getProject(id);
        const tRes = await getTasks(id, { limit: 100 });
        setProject(pRes);
        setTasks(tRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const filteredTasks = tasks
    .filter(t => statusFilter === 'all' || t.status === statusFilter)
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .filter(t => {
       if (!search) return true;
       const q = search.toLowerCase();
       return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'due_date') cmp = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      else if (sortKey === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      else if (sortKey === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      else if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filteredTasks.length / LIMIT);
  const pagedTasks = filteredTasks.slice((page - 1) * LIMIT, page * LIMIT);

  const pct = project?.task_count ? Math.round((project.completed_count ?? 0) / project.task_count * 100) : 0;

  const handleUpdate = async (taskId: string, data: UpdateTaskInput) => {
    try {
      const updated = await updateTask(taskId, data);
      setTasks(prev => prev.map(t => String(t.id) === String(taskId) ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete task?')) return;
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      style={{
        background: sortKey === k ? 'rgba(192, 193, 255, 0.1)' : 'transparent',
        border: 'none', color: sortKey === k ? 'var(--primary)' : 'var(--outline)',
        fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '4px 8px', borderRadius: 5, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em',
        transition: 'all 0.15s',
      }}
    >
      {label} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
    </button>
  );

  const handleAddTask = async (data: CreateTaskInput) => {
    try {
      const newTask = await createTask(id, data);
      setTasks(prev => [...prev, newTask]);
      setProject(prev => prev ? { ...prev, task_count: (prev.task_count ?? 0) + 1 } : prev);
      setShowAddTask(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      router.push('/dashboard');
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return (
    <>
      <Header breadcrumbs={['Projects', 'Loading...']} />
      <div className="page-body"><Loader fill /></div>
    </>
  );

  if (!project) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--outline)' }}>Project not found.</div>;

  return (
    <>
      <Header
        breadcrumbs={['Projects', project.name]}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/projects/${id}/board`}>
              <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: 12 }}>
                <Kanban size={13} /> Board View
              </button>
            </Link>
            <button className="btn-danger" onClick={handleDeleteProject} style={{ padding: '7px 12px', fontSize: 12 }}>
              <Trash2 size={13} /> Delete
            </button>
            <button className="btn-primary" onClick={() => setShowAddTask(true)}>
              <Plus size={14} /> Add Task
            </button>
          </div>
        }
      />

      <div className="page-body animate-fade-in">
        {/* Project Hero */}
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.2)', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', letterSpacing: '-0.03em', marginBottom: 8 }}>{project.name}</h1>
              <p style={{ fontSize: 13, color: 'var(--on-surface-muted)', lineHeight: 1.6, marginBottom: 16 }}>{project.description}</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--outline)' }}>Created {format(parseISO(project.created_at), 'MMM d, yyyy')}</span>
                <span className="badge badge-primary">{project.task_count} Tasks</span>
                <span className="badge badge-done">{project.completed_count} Done</span>
              </div>
            </div>
            {/* Progress Circle */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <svg width={80} height={80}>
                <circle cx={40} cy={40} r={34} fill="none" stroke="var(--surface-highest)" strokeWidth={7} />
                <circle cx={40} cy={40} r={34} fill="none" stroke="#6366f1" strokeWidth={7}
                  strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - pct / 100)}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x={40} y={44} textAnchor="middle" fill="var(--on-surface)" fontSize={14} fontWeight={800}>{pct}%</text>
              </svg>
              <div style={{ fontSize: 11, color: 'var(--outline)', marginTop: 4 }}>Complete</div>
            </div>
          </div>
        </div>

        {/* Task Toolbar */}
        <TaskFilters
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          taskCount={filteredTasks.length}
          onFilterChange={() => setPage(1)}
        />

        {/* Task Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.2)', borderRadius: 12, overflow: 'hidden' }}>
          {pagedTasks.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--outline)' }}>
              No tasks found. {statusFilter !== 'all' && <span>Try clearing the filter.</span>}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ padding: 0 }}><SortBtn k="title" label="Title" /></th>
                  <th>Description</th>
                  <th style={{ padding: 0 }}><SortBtn k="status" label="Status" /></th>
                  <th style={{ padding: 0 }}><SortBtn k="priority" label="Priority" /></th>
                  <th style={{ padding: 0 }}><SortBtn k="due_date" label="Due Date" /></th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedTasks.map(task => {
                  const overdue = task.status !== 'done' && isPast(parseISO(task.due_date));
                  return (
                    <tr key={task.id}>
                      <td style={{ maxWidth: 200 }}>{task.title}</td>
                      <td style={{ maxWidth: 260, color: 'var(--outline)', fontSize: 12 }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.description}
                        </span>
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      <td className={overdue ? 'text-overdue' : ''} style={{ fontSize: 12 }}>
                        {overdue && '⚠ '}{format(parseISO(task.due_date), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon" onClick={() => setEditingTask(task)} title="Edit"><Pencil size={13} /></button>
                          <button className="btn-icon" onClick={() => handleDelete(task.id)} title="Delete" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {editingTask && <EditTaskDrawer task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdate} onDelete={handleDelete} />}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onSubmit={handleAddTask} />}
    </>
  );
}
