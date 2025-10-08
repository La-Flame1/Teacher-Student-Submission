import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/database';
import Homework from '@/app/models/HomeworkTemplate';

// Proper Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^(application\/pdf|image\/jpeg|image\/jpg)$/)) {
      return cb(new Error('Only PDF and JPEG files allowed'));
    }
    cb(null, true);
  },
}).single('file');

//Helper
async function parseUpload(req: any) {
  return new Promise((resolve, reject) => {
    upload(req, {} as any, (err: any) => (err ? reject(err) : resolve(req)));
  });
}

// POST: Upload homework
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const formData = await req.formData();
    const assignmentName = formData.get('assignmentName') as string;
    const studentName = formData.get('studentName') as string;
    const file = formData.get('file') as File;

    if (!assignmentName || !studentName || !file)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (err, result) => {
          if (err) {
            console.error('Cloudinary upload error:', err);
            return reject(err);
          }
          console.log('Uploaded to Cloudinary:', result?.secure_url);
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(uploadStream);
    });

    const { secure_url } = uploadResult as { secure_url: string };

    // Save to MongoDB
    const homework = new Homework({
      assignmentName,
      studentName,
      fileUrl: secure_url,
    });
    await homework.save();

    return NextResponse.json(
      { message: 'Homework submitted successfully', homework },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// GET: Fetch submissions
export async function GET() {
  await connectDB();
  try {
    const submissions = await Homework.find();
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
