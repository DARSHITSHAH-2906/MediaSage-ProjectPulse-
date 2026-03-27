'use client';
import { useState, useEffect } from 'react';
import { Plus, FolderKanban, CheckSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import CreateProjectModal from '@/components/CreateProjectModal';
import Pagination from '@/components/Pagination';
import Loader from '@/components/Loader';
import type { Project, CreateProjectInput } from '@/lib/types';
import Link from 'next/link';
import { format, parseISO, isPast } from 'date-fns';
import { getProjects, createProject, deleteProject, getTasks } from '@/lib/api';

const LIMIT = 6;

function CircularProgress({ pct, size = 48 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-highest)" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--primary)" strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fill="var(--on-surface)" fontSize={10} fontWeight={700}>
        {pct}%
      </text>
    </svg>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const pct = project.task_count ? Math.round((project.completed_count ?? 0) / project.task_count * 100) : 0;
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.02em', cursor: 'pointer', marginBottom: 4 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface)')}>
              {project.name}
            </h3>
          </Link>
          <p style={{ fontSize: 12, color: 'var(--outline)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>
        </div>
        <CircularProgress pct={pct} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--outline)' }}>Progress</span>
          <span style={{ fontSize: 11, color: 'var(--on-surface-muted)' }}>{project.completed_count ?? 0}/{project.task_count ?? 0} tasks</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="badge badge-primary">{project.task_count} tasks</span>
        <span style={{ fontSize: 11, color: 'var(--outline)' }}>
          {format(parseISO(project.created_at), 'MMM d, yyyy')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Link href={`/projects/${project.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '7px 12px', fontSize: 12 }}>
            View Details
          </button>
        </Link>
        <Link href={`/projects/${project.id}/board`} style={{ textDecoration: 'none' }}>
          <button className="btn-ghost" style={{ padding: '7px 12px', fontSize: 12 }}>
            Board
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await getProjects(1, 100);
        setProjects(res.data);
        
        // Fetch tasks to calculate overdue precisely
        let overdue = 0;
        for (const p of res.data) {
          const tRes = await getTasks(String(p.id), { limit: 100 });
          for (const t of tRes.data) {
            if (t.status !== 'done' && isPast(parseISO(t.due_date))) {
              overdue++;
            }
          }
        }
        setOverdueCount(overdue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const totalPages = Math.ceil(projects.length / LIMIT);
  const paged = projects.slice((page - 1) * LIMIT, page * LIMIT);

  const totalTasks = projects.reduce((a, p) => a + (p.task_count ?? 0), 0);
  const completedTasks = projects.reduce((a, p) => a + (p.completed_count ?? 0), 0);
  const activeTasks = totalTasks - completedTasks;

  const handleCreate = async (data: CreateProjectInput) => {
    try {
      const newProject = await createProject(data);
      setProjects(prev => [newProject, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => String(p.id) !== String(id)));
    } catch(err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'var(--primary)', bg: 'rgba(192, 193, 255, 0.12)' },
    { label: 'Active Tasks', value: activeTasks, icon: TrendingUp, color: 'var(--tertiary)', bg: 'rgba(255, 183, 131, 0.12)' },
    { label: 'Completed', value: completedTasks, icon: CheckSquare, color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'var(--red)', bg: 'rgba(255, 180, 171, 0.12)' },
  ];

  return (
    <>
      <Header breadcrumbs={['Dashboard']} />

      <div className="page-body animate-fade-in">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--on-surface)', letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--outline)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>Recent Projects</h2>
            <p style={{ fontSize: 12, color: 'var(--outline)', marginTop: 2 }}>{projects.length} total</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Project
          </button>
        </div>

        {loading ? (
          <Loader fill />
        ) : paged.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--outline)' }}>
            <FolderKanban size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            <p>No projects yet. Create your first!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {paged.map(p => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
    </>
  );
}
