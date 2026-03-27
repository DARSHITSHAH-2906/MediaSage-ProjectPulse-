'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, List } from 'lucide-react';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import TaskFilters from '@/components/TaskFilters';
import Loader from '@/components/Loader';
import { getProject, getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import type { Project, Task, TaskStatus, TaskPriority, UpdateTaskInput, CreateTaskInput } from '@/lib/types';
import Link from 'next/link';

export default function BoardPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
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

  const handleUpdate = async (taskId: string, data: UpdateTaskInput) => {
    try {
      const updated = await updateTask(taskId, data);
      setTasks(prev => prev.map(t => String(t.id) === String(taskId) ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setShowAddTask(true);
  };
  
  const handleTaskCreate = async (data: CreateTaskInput) => {
    try {
      const newTask = await createTask(id, data);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks
    .filter(t => statusFilter === 'all' || t.status === statusFilter)
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .filter(t => {
       if (!search) return true;
       const q = search.toLowerCase();
       return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    });

  const projectName = project?.name ?? 'Project';

  if (loading) return (
    <>
      <Header breadcrumbs={['Projects', 'Loading...', 'Board']} />
      <div className="page-body"><Loader fill /></div>
    </>
  );

  if (!project) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--outline)' }}>Project not found.</div>;

  return (
    <>
      <Header
        breadcrumbs={['Projects', projectName, 'Board']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.3)', borderRadius: 8, overflow: 'hidden' }}>
              <Link href={`/projects/${id}`} style={{ textDecoration: 'none' }}>
                <button className="seg-btn" style={{ padding: '7px 14px', fontSize: 12 }}><List size={13} /> List</button>
              </Link>
              <button className="seg-btn active-medium" style={{ padding: '7px 14px', fontSize: 12, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>
                Board
              </button>
            </div>
            <button className="btn-primary" onClick={() => handleAddTask('todo')}>
              <Plus size={14} /> Add Task
            </button>
          </div>
        }
      />

      <div className="page-body animate-fade-in">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>{projectName} — Board</h1>
        </div>

        <TaskFilters
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          taskCount={filteredTasks.length}
        />

        <KanbanBoard
          tasks={filteredTasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddTask={handleAddTask}
        />
      </div>

      {showAddTask && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddTask(false); }}>
          <div className="modal-box" style={{ width: 480 }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(70,69,84,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--on-surface)' }}>Add Task</h2>
              <button className="btn-icon" onClick={() => setShowAddTask(false)}>✕</button>
            </div>
            <form
              style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}
              onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleTaskCreate({
                  title: fd.get('title') as string,
                  description: fd.get('description') as string,
                  status: defaultStatus,
                  priority: fd.get('priority') as 'low' | 'medium' | 'high',
                  due_date: (fd.get('due_date') as string) + 'T00:00:00Z',
                });
                setShowAddTask(false);
              }}
            >
              <div>
                <label className="field-label">Title *</label>
                <input name="title" className="input" required placeholder="Task title..." />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea name="description" className="input" placeholder="Description..." style={{ minHeight: 70 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Status</label>
                  <select name="status" className="input" defaultValue={defaultStatus}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Priority</label>
                  <select name="priority" className="input" defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Due Date *</label>
                <input name="due_date" type="date" className="input" required style={{ colorScheme: 'dark' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="btn-ghost" onClick={() => setShowAddTask(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
