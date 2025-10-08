'use client';

import { useState } from 'react';
import type { Homework } from '@/app/models/HomeworkTemplate'; // Import type only (no value)

interface GradeFormProps {
  submission: Homework; // Now uses the interface (type)
  onGrade: (id: string, grade: string, notes: string) => Promise<void>;
}

export default function GradeForm({ submission, onGrade }: GradeFormProps) {
  const [grade, setGrade] = useState(submission.grade || 'ungraded'); // Use .level (number -> string for select)
  const [notes, setNotes] = useState(submission.teacherNotes || '');

  const handleGrade = async () => {
    const numericGrade = grade === 'ungraded' ? 0 : parseInt(grade, 10); // Convert back to number
    if (!submission._id) return; // Guard against undefined id
    await onGrade(submission._id, grade, notes); // Pass as string if API expects it
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="font-semibold">{submission.assignmentName} by {submission.studentName}</h3>
      <label htmlFor="grade-select" className="block font-medium mb-1">
        Grade
      </label>
      <select
        id="grade-select"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="ungraded">Ungraded</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="F">F</option>
        <option value="incomplete">Incomplete</option>
      </select>
      <textarea
        placeholder="Teacher Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border rounded mt-2"
      />
      <button
        onClick={handleGrade}
        className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Grade
      </button>
    </div>
  );
}