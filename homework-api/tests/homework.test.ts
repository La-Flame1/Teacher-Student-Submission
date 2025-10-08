import Homework from '@/app/models/HomeworkTemplate';
import connectDB from '@/app/lib/database';
import mongoose from 'mongoose';

jest.mock('@/lib/database', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

describe('Homework API Tests', () => {
  beforeAll(async () => {
    await connectDB(); 
    // Uses the mocked version
    await Homework.deleteMany({}); 
  });

  it('should save a valid homework submission', async () => {
    const homework = new Homework({
      assignmentName: 'Math101',
      studentName: 'John Doe',
      fileUrl: 'http://example.com/file.pdf',
    });
    await homework.save();
    const saved = await Homework.findOne({ studentName: 'John Doe' });
    expect(saved).toBeTruthy();
  });

  it('should filter submissions by grade', async () => {
    await Homework.create({ assignmentName: 'Math101', studentName: 'John Doe', grade: 'A', fileUrl: 'http://example.com/file.pdf' });
    const submissions = await Homework.find({ grade: 'A' });
    expect(submissions.length).toBe(1);
    expect(submissions[0].grade).toBe('A');
  });
});