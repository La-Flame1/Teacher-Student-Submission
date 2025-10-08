import mongoose, { Schema, Document, models } from 'mongoose';

export interface Homework extends Document {
  assignmentName: string;
  studentName: string;
  fileUrl: string;
  grade: string;
  teacherNotes?: string;
  submissionDate: Date;
  gradingDate?: Date;
  _id: string;
}

const HomeworkSchema = new Schema<Homework>({
  assignmentName: { type: String, required: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  grade: { type: String, default: 'ungraded' },
  teacherNotes: String,
  submissionDate: { type: Date, default: Date.now },
  gradingDate: Date,
});

export default models.Homework || mongoose.model<Homework>('Homework', HomeworkSchema);
