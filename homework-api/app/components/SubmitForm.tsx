'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom'; // For server actions (optional enhancement)

interface SubmitFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
    >
      {pending ? 'Submitting...' : 'Submit Homework'}
    </button>
  );
}

export default function SubmitForm({ onSubmit }: SubmitFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000); // Auto-hide after 3s
    } catch (err) {
      setError('Submission failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Submit Your Paper</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Homework submitted successfully!</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Assignment Name Input */}
        <div>
          <label htmlFor="assignmentName" className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Name
          </label>
          <input
            id="assignmentName"
            type="text"
            name="assignmentName"
            required
            placeholder="e.g., Python Homework 1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Student Name Input (Auto-fill or from auth) */}
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="studentName"
            type="text"
            name="studentName"
            required
            placeholder="e.g., John Doe"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Upload: Big Box for PDF/JPEG */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Paper (PDF or JPEG only, max 5MB)
          </label>
          <input
            id="file"
            type="file"
            name="file"
            accept=".pdf,image/jpeg,image/jpg"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && !file.type.match(/^application\/pdf|image\/jpeg/)) {
                setError('Only PDF or JPEG files are allowed.');
                e.target.value = ''; // Clear invalid file
              } else {
                setError(null);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Button: Changes to Green on Success */}
        <SubmitButton />
      </form>
    </div>
  );
}