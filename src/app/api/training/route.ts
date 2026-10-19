export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      const course = db.prepare('SELECT * FROM training_courses WHERE id = ? OR slug = ?').get(courseId, courseId) as any;
      if (!course) {
        return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
      }

      const modules = db.prepare('SELECT * FROM training_modules WHERE course_id = ? ORDER BY display_order ASC').all(course.id) as any[];
      const getLessons = db.prepare('SELECT * FROM training_lessons WHERE module_id = ? ORDER BY display_order ASC');
      const modulesWithLessons = modules.map((m) => ({
        ...m,
        lessons: getLessons.all(m.id),
      }));

      const questions = db.prepare('SELECT * FROM quiz_questions WHERE course_id = ? ORDER BY display_order ASC').all(course.id);

      return NextResponse.json({
        success: true,
        course: {
          ...course,
          modules: modulesWithLessons,
          questions,
        },
      });
    }

    // List all courses
    const courses = db.prepare('SELECT * FROM training_courses ORDER BY display_order ASC').all();
    const enrolments = db.prepare(`
      SELECT 
        e.*,
        u.name as learner_name,
        u.email as learner_email,
        s.name as school_name,
        c.title as course_title,
        cert.certificate_number
      FROM training_enrolments e
      JOIN users u ON e.user_id = u.id
      JOIN training_courses c ON e.course_id = c.id
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN certificates cert ON e.certificate_id = cert.id
      ORDER BY e.created_at DESC
    `).all();

    return NextResponse.json({ success: true, courses, enrolments });
  } catch (error: any) {
    console.error('API GET /training error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseId,
      learnerName,
      learnerEmail,
      schoolName,
      answers, // { [questionId]: selectedOptionIndex }
    } = body;

    const course = db.prepare('SELECT * FROM training_courses WHERE id = ? OR slug = ?').get(courseId, courseId) as any;
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const questions = db.prepare('SELECT * FROM quiz_questions WHERE course_id = ?').all(course.id) as any[];
    if (questions.length === 0) {
      return NextResponse.json({ success: false, error: 'No quiz questions for this course' }, { status: 400 });
    }

    let correctCount = 0;
    const review = questions.map((q) => {
      const selectedIndex = answers ? answers[q.id] : undefined;
      const isCorrect = selectedIndex === q.correct_option_index;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        question: q.question,
        selectedIndex,
        correctIndex: q.correct_option_index,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (course.pass_mark_percentage || 80);

    // Resolve or create user
    let userId = 'usr-learner';
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(learnerEmail) as any;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      userId = `usr-${Date.now()}`;
      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (?, ?, ?, 'demoHash', 'school_staff')
      `).run(userId, learnerName, learnerEmail);
    }

    let certificateId = null;
    let certificateNumber = null;

    if (passed) {
      certificateId = `cert-${Date.now()}`;
      const certCount = db.prepare('SELECT count(*) as count FROM certificates').get() as { count: number };
      const certSeq = (certCount?.count || 0) + 105;
      certificateNumber = `CERT-2026-${certSeq.toString().padStart(5, '0')}`;
      const today = new Date().toISOString().split('T')[0];

      db.prepare(`
        INSERT INTO certificates (
          id, certificate_number, user_id, course_id, recipient_name, school_name, course_title, score_percentage, issued_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        certificateId,
        certificateNumber,
        userId,
        course.id,
        learnerName,
        schoolName || "St. Mary's CE Primary School",
        course.title,
        scorePercentage,
        today
      );
    }

    // Record enrolment
    const enrolmentId = `enrol-${Date.now()}`;
    db.prepare(`
      INSERT INTO training_enrolments (
        id, user_id, course_id, status, quiz_score, passed, completed_at, certificate_id
      ) VALUES (?, ?, ?, 'completed', ?, ?, CURRENT_TIMESTAMP, ?)
    `).run(enrolmentId, userId, course.id, scorePercentage, passed ? 1 : 0, certificateId);

    return NextResponse.json({
      success: true,
      passed,
      scorePercentage,
      passMark: course.pass_mark_percentage || 80,
      certificateId,
      certificateNumber,
      review,
    });
  } catch (error: any) {
    console.error('API POST /training error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
