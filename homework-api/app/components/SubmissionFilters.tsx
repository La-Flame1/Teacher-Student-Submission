'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SubmissionFiltersProps {
  initialFilters?: { grade?: string; assignmentName?: string };
}

export default function SubmissionFilters({ initialFilters = {} }: SubmissionFiltersProps) {
  const [grade, setGrade] = useState(initialFilters.grade || '');
  const [assignmentName, setAssignmentName] = useState(initialFilters.assignmentName || '');
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (grade) params.set('grade', grade);
    else params.delete('grade');
    if (assignmentName) params.set('assignmentName', assignmentName);
    else params.delete('assignmentName');
    router.push(`/student?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-4 bg-gray-50 rounded">
      <label htmlFor="grade-select" className="sr-only">
        Grade
      </label>
      <select
        id="grade-select"
        aria-label="Grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">All Grades</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
        <option value="incomplete">Incomplete</option>
        <option value="ungraded">Ungraded</option>
      </select>
      <input
        type="text"
        placeholder="Assignment Name"
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        className="p-2 border border-gray-300 rounded flex-1"
      />
      <button
        onClick={applyFilters}
        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition-colors"
      >
        Filter
      </button>
    </div>
  );
}