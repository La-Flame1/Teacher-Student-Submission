import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Homework from '@/app/models/HomeworkTemplate';
// GET: Retrieve homework submissions with filtering and pagination
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const assignmentName = url.searchParams.get('assignmentName') ?? undefined;
    const from = url.searchParams.get('from') ?? undefined;
    const to = url.searchParams.get('to') ?? undefined;
    const studentName = url.searchParams.get('studentName') ?? undefined;

    const query: any = {};

    if (assignmentName) {
      query.assignmentName = { $regex: assignmentName, $options: 'i' };
    }
    if (studentName) {
      query.studentName = { $regex: studentName, $options: 'i' };
    }

    // Validate and add date ranges
    const hasFrom = !!from && !isNaN(Date.parse(from));
    const hasTo = !!to && !isNaN(Date.parse(to));
    if (hasFrom || hasTo) {
      query.submissionDate = {};
      if (hasFrom) query.submissionDate.$gte = new Date(from as string);
      if (hasTo) query.submissionDate.$lte = new Date(to as string);
    }

    // Pagination: sane defaults and caps
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const limitRaw = parseInt(url.searchParams.get('limit') || '5', 10) || 5;
    const MAX_LIMIT = 100;
    const limit = Math.min(MAX_LIMIT, Math.max(1, limitRaw));

    const total = await Homework.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const submissions = await Homework.find(query)
      .sort({ submissionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        submissions,
        meta: { total, page, limit, totalPages },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/homework error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH: Grade a homework submission.
 * Expects JSON body: { id: string, grade: string, teacherNotes?: string }
 *
 * Accepts letter grades (A,B,C,D,F) or words ('incomplete','ungraded').
 * Normalizes letter grades to uppercase and words to lowercase.
 */
export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, grade: rawGrade, teacherNotes } = body ?? {};

    if (!id || typeof rawGrade !== 'string') {
      return NextResponse.json({ error: 'Missing id or grade' }, { status: 400 });
    }
    let grade = rawGrade.trim();
    if (grade.length === 1) grade = grade.toUpperCase();
    else grade = grade.toLowerCase();

    const allowed = ['A', 'B', 'C', 'D', 'F', 'incomplete', 'ungraded'];
    if (!allowed.includes(grade)) {
      return NextResponse.json({ error: 'Invalid grade value' }, { status: 400 });
    }

    const update: any = {
      grade,
      gradingDate: new Date(),
    };
    if (typeof teacherNotes === 'string') update.teacherNotes = teacherNotes;

    const homework = await Homework.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!homework) {
      return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Graded successfully', homework }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/homework error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
