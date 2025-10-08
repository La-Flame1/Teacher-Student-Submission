'use client';

import type { Homework } from '@/app/models/HomeworkTemplate';

interface SubmissionListProps {
  submissions?: Homework[]; // Optional in case no data is passed yet
}

export default function SubmissionList({ submissions = [] }: SubmissionListProps) {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded bg-gray-50">
        No submissions found yet.
      </div>
    );
  }

  return (
    <ul className="space-y-4 p-4">
      {submissions.map((sub) => (
        <li
          key={sub._id?.toString() ?? Math.random().toString()}
          className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800">
              {sub.assignmentName || 'Untitled Assignment'}
            </h3>
            <p className="text-sm text-gray-600">
              Grade:{' '}
              <span className="font-medium text-blue-700">
                {sub.grade && sub.grade !== 'ungraded' ? sub.grade : 'Ungraded'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Submitted:{' '}
              {sub.submissionDate
                ? new Date(sub.submissionDate).toLocaleString()
                : 'Date not available'}
            </p>
          </div>

          {sub.fileUrl ? (
            <a
              href={sub.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline text-sm font-medium"
            >
              View / Download
            </a>
          ) : (
            <span className="text-gray-400 text-sm">No file</span>
          )}
        </li>
      ))}
    </ul>
  );
}
