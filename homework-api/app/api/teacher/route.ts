import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Homework from '@/models/HomeworkTemplate';

// Pagination logic will be handled inside the GET handler.


export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const assignmentName = url.searchParams.get('assignmentName') as string;
    const from = url.searchParams.get('from') as string;
    const to = url.searchParams.get('to') as string;
    const studentName = url.searchParams.get('studentName') as string;

    const query: any = {};
    if (assignmentName) query.assignmentName = { $regex: assignmentName, $options: 'i' };
    if (from && to) {
      query.submissionDate = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      query.submissionDate = { $gte: new Date(from) };
    } else if (to) {
      query.submissionDate = { $lte: new Date(to) };
    }
    if (studentName) query.studentName = { $regex: studentName, $options: 'i' };

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '5');
    const submissions = await Homework.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { id, grade, teacherNotes } = await req.json();
    if (!id || !grade || !['A', 'B', 'C', 'D', 'F', 'incomplete', 'ungraded'].includes(grade)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const homework = await Homework.findByIdAndUpdate(
      id,
      { grade, teacherNotes, gradingDate: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!homework) {
      return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Graded successfully', homework }, { status: 200 });
  } catch (error) {
    console.error('Grading error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}