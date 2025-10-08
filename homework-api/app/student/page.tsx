'use client';

import { useEffect, useState } from 'react';

interface Submission {
  _id: string;
  fileName: string;
  status: string;
  dateSubmitted: string;
}

export default function StudentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const validFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (validFileTypes.includes(selected.type)) {
        setFileStatus('valid');
        setFile(selected);
      } else {
        setFileStatus('invalid');
        setFile(null);
      }
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/student`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch submissions');
      setSubmissions(await res.json());
    } catch (err) {
      setStatus({ type: 'error', message: 'Unable to fetch submissions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !studentName || !assignmentName) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentName', studentName);
    formData.append('assignmentName', assignmentName);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/student`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      setStatus({ type: 'success', message: 'Paper uploaded successfully!' });
      setFile(null);
      setAssignmentName('');
      setStudentName('');
      setFileStatus('idle');
      fetchSubmissions();
    } catch {
      setStatus({ type: 'error', message: 'Failed to upload paper. Please try again.' });
    } finally {
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }
  };

  return (
    <div className="theme-student dashboard-page">
      <div className="dashboard-container">
        <h1 className="dashboard-header accent">Student Dashboard</h1>
        <p className="dashboard-subtitle">
          Upload your homework or research papers here. Accepted file types are PDF and DOCX.
        </p>

        {status.message && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT SIDE - UPLOAD SECTION */}
          <div className="md:col-span-2 card">
            <h2 className="card-title">Submit New Paper</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                className="filter-input w-full"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Assignment Title"
                className="filter-input w-full"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                required
              />

              {/* UPLOAD BOX */}
              <label
                htmlFor="file"
                className={`upload-box ${
                  fileStatus === 'valid'
                    ? 'upload-box-valid'
                    : fileStatus === 'invalid'
                    ? 'upload-box-invalid'
                    : 'upload-box-idle'
                }`}
              >
                <div>
                  <p className="text-lg font-semibold">
                    {file ? file.name : 'Click or drag a file here to upload'}
                  </p>
                  <p className="upload-instructions">
                    {fileStatus === 'valid'
                      ? 'Valid file detected — ready to upload.'
                      : fileStatus === 'invalid'
                      ? 'Invalid file type! Only PDF or DOCX allowed.'
                      : 'Only PDF or DOCX files are supported.'}
                  </p>
                </div>
                <input id="file" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
              </label>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                Submit Paper
              </button>
            </form>
          </div>

          {/* RIGHT SIDE - PREVIOUS SUBMISSIONS */}
          <div className="card">
            <h2 className="card-title">Previous Submissions</h2>

            {loading ? (
              <p className="text-gray-500 text-center py-10">Loading submissions...</p>
            ) : submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No previous submissions found.</p>
            ) : (
              <ul className="space-y-4">
                {submissions.map((sub) => (
                  <li
                    key={sub._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <p className="font-semibold text-gray-800">{sub.fileName}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium text-blue-600">{sub.status}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Submitted: {new Date(sub.dateSubmitted).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
