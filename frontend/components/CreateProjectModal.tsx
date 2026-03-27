'use client';
import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { CreateProjectInput } from '@/lib/types';

interface Props {
  onClose: () => void;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
}

export default function CreateProjectModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = () => {
    const e: { name?: string } = {};
    if (!name.trim()) e.name = 'Project name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ width: 520 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              Create New Project
            </h2>
            <p style={{ fontSize: 12, color: 'var(--outline)', marginTop: 2 }}>
              Projects organize tasks and track progress
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="divider" />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          {/* Name */}
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Project Name <span style={{ color: '#f87171' }}>*</span></label>
            <input
              className={`input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors({}); }}
            />
            {errors.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: '#f87171', fontSize: 12 }}>
                <AlertCircle size={12} /> {errors.name}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 8 }}>
            <label className="field-label">Description</label>
            <textarea
              className="input"
              placeholder="Describe your project goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              style={{ minHeight: 100, resize: 'vertical' }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--outline)', marginTop: 4 }}>
              {description.length} / 500
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating…' : '+ Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
