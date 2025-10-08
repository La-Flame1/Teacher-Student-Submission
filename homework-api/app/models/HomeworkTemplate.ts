import mongoose, { Schema, Document } from 'mongoose';

// Plain TypeScript interface for data typing (no Mongoose extras)
export interface Homework {
  _id: string; // Use string for JSON-serialized IDs (from .lean() or API)
  assignmentName: string;
  studentName: string;
  submissionDate: Date;
  gradingDate: Date | null;
  fileUrl: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'incomplete' | 'ungraded'; // Updated to string enums
  teacherNotes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose interface (extends Document)
interface IHomework extends Document {
  assignmentName: string;
  studentName: string;
  submissionDate: Date;
  gradingDate: Date | null;
  fileUrl: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'incomplete' | 'ungraded'; // Updated to string enums
  teacherNotes: string | null;
}

// Schema unchanged
const HomeworkSchema: Schema<IHomework> = new Schema({
  assignmentName: { type: String, required: true, trim: true },
  studentName: { type: String, required: true, trim: true },
  submissionDate: { type: Date, default: Date.now, immutable: true },
  gradingDate: { type: Date, default: null },
  fileUrl: { type: String, required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F', 'incomplete', 'ungraded'], default: 'ungraded' }, // Updated to string enum, default 'ungraded'
  teacherNotes: { type: String, default: null, required: false },
}, {
  timestamps: true,
});

// Model (value)
const HomeworkModel = mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);

HomeworkSchema.index({ studentName: 1, assignmentName: 1 });

// Export model as default (for DB use, e.g., in API routes)
export default HomeworkModel;

// Also export as named if needed elsewhere
export { HomeworkModel as Homework };