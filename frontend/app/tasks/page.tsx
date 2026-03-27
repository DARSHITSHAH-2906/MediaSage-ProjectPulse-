'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Search, ArrowUpDown, Filter, Pencil, Trash2,
  CheckSquare, Clock, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import Header from '@/components/Header';
import { StatusBadge, PriorityBadge } from '@/components/Badges';
import EditTaskDrawer from '@/components/EditTaskDrawer';
import Pagination from '@/components/Pagination';
import TaskFilters from '@/components/TaskFilters';
import Loader from '@/components/Loader';
import type { Task, Project, TaskStatus, TaskPriority, UpdateTaskInput } from '@/lib/types';
import { format, isPast, parseISO, isToday, isTomorrow } from 'date-fns';
import { getProjects, getTasks, updateTask, deleteTask } from '@/lib/api';

const LIMIT = 10;

type SortKey = 'title' | 'due_date' | 'priority' | 'status' | 'created_at';
const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, todo: 1, done: 2 };

function dueBadge(dueDate: string, status: TaskStatus) {
  const d = parseISO(dueDate);
  if (status === 'done') return null;
  if (isPast(d)) return <span style={{ fontSize: 10, color: 'var(--red)', background: 'rgba(255, 180, 171, 0.1)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>Overdue</span>;
  if (isToday(d)) return <span style={{ fontSize: 10, color: 'var(--tertiary)', background: 'rgba(255, 183, 131, 0.1)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>Today</span>;
  if (isTomorrow(d)) return <span style={{ fontSize: 10, color: 'var(--primary)', background: 'rgba(192, 193, 255, 0.1)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>Tomorrow</span>;
  return null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('due_date');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const pRes = await getProjects(1, 100);
        const projs = pRes.data;
        setProjectsData(projs);
        
        let allTasks: Task[] = [];
        for (const p of projs) {
          const tRes = await getTasks(String(p.id), { limit: 100 });
          allTasks = [...allTasks, ...tRes.data];
        }
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const projectName = (id: string) => projectsData.find(p => String(p.id) === String(id))?.name ?? 'Unknown';

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') list = list.filter(t => t.priority === priorityFilter);

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'due_date') cmp = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      else if (sortKey === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      else if (sortKey === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      else if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [tasks, search, statusFilter, priorityFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paged = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const handleUpdate = async (id: string, data: UpdateTaskInput) => {
    try {
      await updateTask(id, data);
      setTasks(prev => prev.map(t => t.id === String(id) || String(t.id) === String(id) ? { ...t, ...data } as Task : t));
    } catch(err) {
      console.error(err);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => String(t.id) !== String(id)));
    } catch(err) {
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

  const stats = [
    { label: 'All Tasks', value: tasks.length, icon: CheckSquare, color: 'var(--primary)', bg: 'rgba(192, 193, 255, 0.1)' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'var(--tertiary)', bg: 'rgba(255, 183, 131, 0.1)' },
    { label: 'Overdue', value: tasks.filter(t => t.status !== 'done' && isPast(parseISO(t.due_date))).length, icon: AlertTriangle, color: 'var(--red)', bg: 'rgba(255, 180, 171, 0.1)' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, icon: CheckCircle2, color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.1)' },
  ];

  return (
    <>
      <Header breadcrumbs={['Tasks']} />
      <div className="page-body animate-fade-in">

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ padding: 16, gap: 12 }}>
              <div className="stat-icon" style={{ width: 38, height: 38, background: s.bg, borderRadius: 9 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--outline)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <TaskFilters
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          taskCount={filtered.length}
          onFilterChange={() => setPage(1)}
        />

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.15)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Column headers with sort */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 130px 110px 140px 80px', padding: '10px 14px', background: 'var(--surface-low)', gap: 8, alignItems: 'center' }}>
            <SortBtn k="title" label="Title" />
            <span style={{ fontSize: 11, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Project</span>
            <SortBtn k="status" label="Status" />
            <SortBtn k="priority" label="Priority" />
            <SortBtn k="due_date" label="Due Date" />
            <span style={{ fontSize: 11, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Actions</span>
          </div>

          {loading ? (
            <Loader fill />
          ) : paged.length === 0 ? (
            <div style={{ padding: '56px', textAlign: 'center', color: 'var(--outline)' }}>
              <CheckSquare size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p style={{ fontSize: 14, marginBottom: 6 }}>No tasks found</p>
              <p style={{ fontSize: 12 }}>Try adjusting your filters or search.</p>
            </div>
          ) : (
            paged.map((task, i) => {
              const overdue = task.status !== 'done' && isPast(parseISO(task.due_date));
              return (
                <div
                  key={task.id}
                  onClick={() => setEditingTask(task)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 130px 110px 140px 80px',
                    padding: '13px 14px',
                    gap: 8,
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {/* Title */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: task.status === 'done' ? 'var(--outline)' : 'var(--on-surface)', textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--outline)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {task.description}
                    </div>
                  </div>

                  {/* Project */}
                  <div style={{ fontSize: 12, color: 'var(--on-surface-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ background: 'rgba(192, 193, 255, 0.08)', color: 'var(--primary)', padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                      {projectName(task.project_id)}
                    </span>
                  </div>

                  {/* Status */}
                  <div onClick={e => e.stopPropagation()}>
                    <StatusBadge status={task.status} />
                  </div>

                  {/* Priority */}
                  <div onClick={e => e.stopPropagation()}>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  {/* Due Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 12, color: overdue ? 'var(--red)' : 'var(--on-surface-muted)' }}>
                      {format(parseISO(task.due_date), 'MMM d, yyyy')}
                    </span>
                    {dueBadge(task.due_date, task.status)}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                    <button className="btn-icon" onClick={() => setEditingTask(task)} title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(task.id)} title="Delete" style={{ color: 'var(--red)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {editingTask && (
        <EditTaskDrawer
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
