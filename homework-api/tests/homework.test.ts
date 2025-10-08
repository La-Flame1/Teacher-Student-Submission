import Homework from '@/models/HomeworkTemplate';
import connectDB from '@/lib/database';


jest.mock('@/lib/database', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

// Mock the Homework model
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockDeleteMany = jest.fn();
const mockFind = jest.fn();
const mockCreate = jest.fn();

const mockHomework = {
  assignmentName: 'Math101',
  studentName: 'John Doe',
  fileUrl: 'http://example.com/file.pdf',
  grade: 'A',
};

jest.mock('@/models/HomeworkTemplate', () => ({
  default: jest.fn(() => ({
    save: mockSave,
    deleteMany: mockDeleteMany,
    findOne: mockFindOne,
    find: mockFind,
    create: mockCreate,
  })),
}));

describe('Homework API Tests', () => {
  beforeAll(async () => {
    await connectDB(); 
    // Uses the mocked version
    await mockDeleteMany.mockResolvedValue(true); 
  });

  it('should save a valid homework submission', async () => {
    mockSave.mockResolvedValue(mockHomework);
    mockFindOne.mockResolvedValue(mockHomework);

    const homework = new Homework({
      assignmentName: 'Math101',
      studentName: 'John Doe',
      fileUrl: 'http://example.com/file.pdf',
    });
    await homework.save();
    const saved = await Homework.findOne({ studentName: 'John Doe' });
    expect(saved).toBeTruthy();
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it('should filter submissions by grade', async () => {
    mockCreate.mockResolvedValue(mockHomework);
    mockFind.mockResolvedValue([mockHomework]);

    await Homework.create({ assignmentName: 'Math101', studentName: 'John Doe', grade: 'A', fileUrl: 'http://example.com/file.pdf' });
    const submissions = await Homework.find({ grade: 'A' });
    expect(submissions.length).toBe(1);
    expect(submissions[0].grade).toBe('A');
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith({ grade: 'A' });
  });
});