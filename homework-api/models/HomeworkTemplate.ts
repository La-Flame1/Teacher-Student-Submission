import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for TypeScript (extends Document for Mongoose)
interface IHomework extends Document {
  assignmentName: string;
  studentName: string;
  submissionDate: Date;
  gradingDate: Date | null;
  fileUrl: string;
  level: 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 | 'ungraded';
  teacherNotes: string | null;
}

// Define the Mongoose schema
const HomeworkSchema: Schema<IHomework> = new Schema({
  assignmentName: { type: String, required: true, trim: true }, // Required, removes whitespace
  studentName: { type: String, required: true, trim: true },    // Required, removes whitespace
  submissionDate: { type: Date, default: Date.now, immutable: true }, // Auto-sets on creation, immutable
  gradingDate: { type: Date, default: null },                   // Null until graded
  fileUrl: { type: String, required: true },                    // URL from Cloudinary/S3
  level: { type: Number, int: [7, 6, 5, 4, 3, 2, 1  ], default: 'ungraded' }, // Restricted values
  teacherNotes: { type: String, default: null, required: false }, // Optional notes, allows null
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Export the model, creating it only if it doesn't exist
const Homework = mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);

HomeworkSchema.index({ studentName: 1, assignmentName: 1 }); // Compound index for efficient querying

export default Homework;