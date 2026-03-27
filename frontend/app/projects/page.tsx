'use client';
import Header from '@/components/Header';
import Link from 'next/link';
import { Plus, FolderKanban, ChevronRight } from 'lucide-react';

import { useEffect, useState } from 'react';
import CreateProjectModal from '@/components/CreateProjectModal';
import Loader from '@/components/Loader';
import type { Project, CreateProjectInput } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { getProjects, createProject } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects(1, 100).then(res => {
      setProjects(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (data: CreateProjectInput) => {
    try {
      const newProj = await createProject(data);
      setProjects(prev => [newProj, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header breadcrumbs={['Projects']} />
      <div className="page-body animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>All Projects</h1>
            <p style={{ fontSize: 12, color: 'var(--outline)', marginTop: 2 }}>{projects.length} projects</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Project
          </button>
        </div>
        {loading ? (
          <Loader fill />
        ) : projects.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--outline)' }}>
            <FolderKanban size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            No projects found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--surface)', border: '1px solid rgba(70,69,84,0.15)', borderRadius: 12, overflow: 'hidden' }}>
            {projects.map(p => {
            const pct = p.task_count ? Math.round((p.completed_count ?? 0) / p.task_count * 100) : 0;
            return (
              <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(192, 193, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderKanban size={16} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--outline)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--outline)', whiteSpace: 'nowrap' }}>{format(parseISO(p.created_at), 'MMM d, yyyy')}</span>
                    <span className="badge badge-primary">{p.task_count} tasks</span>
                    <div style={{ width: 80 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--outline)' }}>{pct}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    </div>
                    <ChevronRight size={15} color="var(--outline)" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
    </>
  );
}
