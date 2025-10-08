'use client';

import { useEffect, useState } from 'react';
import GradeForm from '@/app/components/GradeForm';
import TeacherFilters from '@/app/components/TeacherFilters';
import type { Homework } from '@/app/models/HomeworkTemplate';

export default function TeacherDashboard({ initialFilters }: { initialFilters: Record<string, string> }) {
  const [submissions, setSubmissions] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [filters, setFilters] = useState(initialFilters);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v !== '')).toString();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/teacher?${query}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error();
      setSubmissions(data);
    } catch {
      setStatus({ type: 'error', message: 'Failed to load submissions. Please try again.' });
      setSubmissions([]); // ensure it’s always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const handleGrade = async (id: string, grade: string, notes: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/teacher`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, grade, teacherNotes: notes }),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: 'success', message: 'Grade submitted successfully!' });
      fetchSubmissions();
    } catch {
      setStatus({ type: 'error', message: 'Unable to submit grade. Please try again.' });
    } finally {
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-header">Teacher Dashboard</h1>
        <p className="dashboard-subtitle">
          Review and grade student homework submissions efficiently using the filters and forms below.
        </p>

        {status.message && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {status.message}
          </div>
        )}

        <div className="card mb-10">
          <h2 className="card-title">Filter Submissions</h2>
          <TeacherFilters onFilterChange={setFilters} />
        </div>

        <div className="card">
          <h2 className="card-title mb-6">Student Submissions</h2>
          {loading ? (
            <div className="empty-state">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">No submissions found for the selected filters.</div>
          ) : (
            <div className="submission-grid">
              {submissions.map((sub) => (
                <GradeForm key={sub._id} submission={sub} onGrade={handleGrade} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
