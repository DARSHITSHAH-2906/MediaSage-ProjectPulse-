import Link from 'next/link';
import { FolderKanban, CheckSquare, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'var(--bg)',
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: 640, marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          background: 'rgba(192, 193, 255, 0.1)',
          borderRadius: 20,
          marginBottom: 24,
        }}>
          <FolderKanban size={16} color="var(--primary)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.02em' }}>
            ProjectPulse
          </span>
        </div>

        <h1 style={{
          fontSize: 48,
          fontWeight: 800,
          color: 'var(--on-surface)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          Manage Projects
          <br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--tertiary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            With Clarity
          </span>
        </h1>

        <p style={{
          fontSize: 16,
          color: 'var(--outline)',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Track projects, manage tasks, and boost team productivity with a clean, intuitive dashboard designed for modern teams.
        </p>

        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{
            padding: '14px 28px',
            fontSize: 15,
            fontWeight: 700,
          }}>
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        maxWidth: 720,
        width: '100%',
      }}>
        {[
          { icon: FolderKanban, title: 'Project Tracking', desc: 'Organize and monitor all your projects in one place' },
          { icon: CheckSquare, title: 'Task Management', desc: 'Create, assign, and track tasks with Kanban boards' },
          { icon: Users, title: 'Team Collaboration', desc: 'Keep your team aligned with real-time updates' },
        ].map((feature) => (
          <div key={feature.title} className="card" style={{
            padding: 24,
            textAlign: 'center',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(192, 193, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <feature.icon size={24} color="var(--primary)" />
            </div>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--on-surface)',
              marginBottom: 6,
            }}>
              {feature.title}
            </h3>
            <p style={{
              fontSize: 12,
              color: 'var(--outline)',
              lineHeight: 1.5,
            }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}