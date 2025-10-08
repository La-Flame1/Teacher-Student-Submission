'use client';

import type { Homework } from '@/app/models/HomeworkTemplate'; // Type import

interface SubmissionListProps {
  submissions: Homework[]; // Uses interface
}

export default function SubmissionList({ submissions }: SubmissionListProps) {
  return (
    <ul className="space-y-4 p-4">
      {submissions.map((sub) => (
        <li key={sub._id} className="flex justify-between items-center p-4 bg-white border rounded shadow">
          <div>
            <h3 className="font-semibold">{sub.assignmentName}</h3>
            <p className="text-sm text-gray-600">Grade: {sub.level || 'Ungraded'}</p> {/* Handle number or string */}
            <p className="text-sm text-gray-500">Submitted: {new Date(sub.submissionDate).toLocaleDateString()}</p>
          </div>
          <a
            href={sub.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  );
}