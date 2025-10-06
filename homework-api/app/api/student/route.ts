import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Homework from '@/models/HomeworkTemplate';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary (from .env)
cloudinary.config({ cloud_name: process.env.CLOUDINARY_URL });

// Multer configuration for memory storage (stream to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (
    req,
    file,
    callback
  ) => {
    if (!file.mimetype.match(/^(image\/jpeg|application\/pdf)$/)) {
      return callback(new Error('Only JPEG and PDF files are allowed'));
    }
    callback(null, true);
  },
}).single('file');

// Middleware to handle file upload
async function handleUpload(req: NextRequest) {
  return new Promise((resolve, reject) => {
    upload(req as any, {} as any, (err) => {
      if (err) reject(err);
      else resolve(req);
    });
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // Parse form data and handle file upload
    const formData = await req.formData();
    const assignmentName = formData.get('assignmentName') as string;
    const studentName = formData.get('studentName') as string;

    if (!assignmentName || !studentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reqWithFile = await handleUpload(req);
    const file = (reqWithFile as any).file;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    

    // Upload to Cloudinary
    const stream = Readable.from(file.buffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.pipe(uploadStream);
    });
    

    // Save to MongoDB
    const homework = new Homework({
      assignmentName,
      studentName,
      fileUrl: (uploadResult as { secure_url: string }).secure_url,
    });
    await homework.save();

    return NextResponse.json({ message: 'Homework submitted', id: homework._id }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const grade = url.searchParams.get('grade') as string;
    const assignmentName = url.searchParams.get('assignmentName') as string;

    const query: any = { studentName: 'currentStudent' }; // Replace with authenticated user
    if (grade) query.grade = grade;
    if (assignmentName) query.assignmentName = { $regex: assignmentName, $options: 'i' };

    const submissions = await Homework.find(query).lean();
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}