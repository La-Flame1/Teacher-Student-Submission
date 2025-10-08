'use client';

import { useState } from 'react';

export default function TeacherFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({ assignmentName: '', studentName: '', from: '', to: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-grid">
      <input type="text" name="assignmentName" placeholder="Assignment Name" value={filters.assignmentName} onChange={handleChange} className="filter-input" required />
      <input type="text" name="studentName" placeholder="Student Name" value={filters.studentName} onChange={handleChange} className="filter-input" required />
      <input type="date" name="from" value={filters.from} onChange={handleChange} className="filter-input" />
      <input type="date" name="to" value={filters.to} onChange={handleChange} className="filter-input" />
    </div>
  );
}
