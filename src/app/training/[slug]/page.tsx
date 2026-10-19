'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Play, Check, ChevronRight, Award, Clock, Users, AlertCircle } from 'lucide-react';

interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration_minutes: number;
  summary: string;
  target_audience: string;
  pass_mark_percentage: number;
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      content_html: string;
      key_takeaways?: string;
    }>;
  }>;
  questions: Array<{
    id: string;
    question: string;
    options_json: string;
    correct_option_index: number;
    explanation: string;
  }>;
}

export default function CoursePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'lesson' | 'quiz' | 'result'>('overview');
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [showLearnerForm, setShowLearnerForm] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/training?courseId=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.course) setCourse(data.course);
      });
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center font-sans">
        <div className="animate-spin w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completionPercent = allLessons.length > 0 ? Math.round((completedLessons.size / allLessons.length) * 100) : 0;
  const activeLesson = course.modules[activeModuleIdx]?.lessons[activeLessonIdx];

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

  const submitQuiz = async () => {
    if (!learnerName || !learnerEmail) {
      setShowLearnerForm(true);
      return;
    }
    setIsSubmitting(true);
    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: course.id,
        learnerName,
        learnerEmail,
        schoolName: 'School (via online training)',
        answers,
      }),
    });
    const data = await res.json();
    setQuizResult(data);
    setCurrentView('result');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-ivory text-forest-900 font-sans">
      {/* Header */}
      <div className="bg-forest-950 text-stone-200 py-12 px-4 border-b border-forest-900/60 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FAF8F5 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/training" className="flex items-center gap-2 text-stone-400 text-xs mb-4 hover:text-stone-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Training Courses
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage-800/50 border border-sage-700/60 flex items-center justify-center shrink-0 text-gold-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-gold-300 text-xs font-semibold uppercase tracking-wider bg-gold-400/10 px-3 py-0.5 rounded-full border border-gold-400/20">{course.category}</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ivory mt-2">{course.title}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sage-400" />{course.duration_minutes} minutes</span>
                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-sage-400" />{course.pass_mark_percentage}% to pass</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-sage-400" />{course.target_audience}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {completionPercent > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-stone-300 mb-1.5">
                <span>Course Progress</span>
                <span>{completionPercent}% complete</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-sage-400 h-1.5 rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Module nav */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="font-serif font-medium text-forest-950 text-lg mb-4">Course Content</h2>
              {course.modules.map((module, mIdx) => (
                <div key={module.id} className="bg-white/90 rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
                  <div className="px-4 py-3 bg-linen/30 border-b border-stone-200/70">
                    <p className="font-medium text-xs text-forest-950">{module.title}</p>
                  </div>
                  {module.lessons.map((lesson, lIdx) => {
                    const isDone = completedLessons.has(lesson.id);
                    const isActive = activeModuleIdx === mIdx && activeLessonIdx === lIdx;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveModuleIdx(mIdx);
                          setActiveLessonIdx(lIdx);
                          setCurrentView('lesson');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-stone-100 last:border-0 hover:bg-linen/40 transition-colors ${isActive ? 'bg-linen/50' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-sage-600 text-white' : 'bg-linen text-stone-500 border border-stone-200'}`}>
                          {isDone ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-semibold">{lIdx + 1}</span>}
                        </div>
                        <span className="text-xs font-medium text-forest-950">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Quiz card */}
              <div className={`bg-white/90 rounded-2xl border p-4 shadow-xs transition-colors ${completionPercent === 100 ? 'border-sage-400' : 'border-stone-200/70 opacity-75'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completionPercent === 100 ? 'bg-forest-900 text-ivory' : 'bg-linen text-stone-400'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-serif font-medium text-forest-950">Knowledge Assessment Quiz</p>
                    <p className="text-[11px] text-stone-500">{course.questions.length} questions · {course.pass_mark_percentage}% to pass</p>
                  </div>
                </div>
                {completionPercent === 100 ? (
                  <button
                    onClick={() => setCurrentView('quiz')}
                    className="mt-3 w-full py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-medium hover:bg-forest-800 transition-colors"
                  >
                    Start Quiz →
                  </button>
                ) : (
                  <p className="mt-2 text-[11px] text-stone-400">Complete all lessons to unlock the quiz.</p>
                )}
              </div>
            </div>

            {/* Right: Course intro */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs p-8">
                <h2 className="text-xl font-serif font-normal text-forest-950 mb-4">About This Course</h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">{course.summary}</p>

                <div className="bg-linen/40 rounded-2xl border border-stone-200/80 p-5 mb-6">
                  <h3 className="font-serif font-medium text-sm text-forest-950 mb-2">Who is this for?</h3>
                  <p className="text-xs sm:text-sm text-stone-600">{course.target_audience}</p>
                </div>

                <div className="bg-sage-50/70 border border-sage-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong className="text-forest-950 font-medium">Important:</strong> This online training module provides educational information for school staff awareness. It does not replace formal first aid qualifications, employer-led training or clinical instruction from healthcare professionals.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('lesson')}
                  className="mt-6 w-full py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs tracking-wide flex items-center justify-center gap-3 shadow-xs transition-all"
                >
                  <Play className="w-4 h-4" />
                  Start Course
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'lesson' && activeLesson && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-2">
              <button onClick={() => setCurrentView('overview')} className="flex items-center gap-2 text-xs font-medium text-sage-800 hover:text-forest-950 mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Contents
              </button>
              {course.modules.map((module, mIdx) => (
                <div key={module.id}>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider px-2 mb-1">{module.title}</p>
                  {module.lessons.map((lesson, lIdx) => {
                    const isDone = completedLessons.has(lesson.id);
                    const isActive = activeModuleIdx === mIdx && activeLessonIdx === lIdx;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { setActiveModuleIdx(mIdx); setActiveLessonIdx(lIdx); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium mb-1 transition-colors ${
                          isActive
                            ? 'bg-forest-900 text-ivory'
                            : isDone
                            ? 'text-sage-900 hover:bg-sage-50'
                            : 'text-stone-700 hover:bg-linen/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-sage-600 text-white' : isActive ? 'bg-white/20' : 'bg-linen text-stone-500'}`}>
                          {isDone ? <Check className="w-2.5 h-2.5" /> : <span className="text-[8px]">{lIdx + 1}</span>}
                        </div>
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs">
                <div className="p-6 border-b border-stone-100">
                  <span className="text-xs text-sage-800 font-semibold uppercase tracking-wider">
                    {course.modules[activeModuleIdx]?.title}
                  </span>
                  <h2 className="text-2xl font-serif font-normal text-forest-950 mt-1">{activeLesson.title}</h2>
                </div>

                <div
                  className="p-6 sm:p-8 prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-forest-950 prose-p:text-stone-600 prose-li:text-stone-600"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content_html }}
                />

                {activeLesson.key_takeaways && (
                  <div className="mx-6 mb-6 p-4 bg-linen/50 rounded-2xl border border-stone-200/80">
                    <h4 className="font-serif font-medium text-sm text-forest-950 mb-1 flex items-center gap-2">
                      <Check className="w-4 h-4 text-sage-700" /> Key Takeaway
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{activeLesson.key_takeaways}</p>
                  </div>
                )}

                <div className="p-6 border-t border-stone-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      if (activeLessonIdx > 0) {
                        setActiveLessonIdx(activeLessonIdx - 1);
                      } else if (activeModuleIdx > 0) {
                        const newMod = activeModuleIdx - 1;
                        setActiveModuleIdx(newMod);
                        setActiveLessonIdx(course.modules[newMod].lessons.length - 1);
                      }
                    }}
                    disabled={activeModuleIdx === 0 && activeLessonIdx === 0}
                    className="py-2.5 px-5 rounded-full border border-stone-200 text-xs font-medium text-forest-900 hover:bg-linen/40 disabled:opacity-40 flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() => {
                      markLessonComplete(activeLesson.id);
                      const currModLessons = course.modules[activeModuleIdx].lessons;
                      if (activeLessonIdx < currModLessons.length - 1) {
                        setActiveLessonIdx(activeLessonIdx + 1);
                      } else if (activeModuleIdx < course.modules.length - 1) {
                        setActiveModuleIdx(activeModuleIdx + 1);
                        setActiveLessonIdx(0);
                      } else {
                        setCurrentView('overview');
                      }
                    }}
                    className="py-2.5 px-6 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    <Check className="w-4 h-4" /> Mark Complete & Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-2xl font-serif font-normal text-forest-950">Knowledge Assessment</h2>
                <p className="text-stone-500 text-xs mt-1">{course.questions.length} questions · Score at least {course.pass_mark_percentage}% to receive your certificate</p>
              </div>

              {showLearnerForm && (
                <div className="p-6 bg-linen/30 border-b border-stone-200/80">
                  <h3 className="font-serif font-medium text-sm text-forest-950 mb-3">Your Details (for certificate)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="Full Name" className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sage-500" />
                    <input type="email" value={learnerEmail} onChange={(e) => setLearnerEmail(e.target.value)} placeholder="Work Email" className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sage-500" />
                  </div>
                </div>
              )}

              <div className="p-6 space-y-8">
                {course.questions.map((q, qIdx) => {
                  const options = JSON.parse(q.options_json) as string[];
                  return (
                    <div key={q.id}>
                      <div className="flex items-start gap-3 mb-4">
                        <span className="w-7 h-7 rounded-full bg-linen text-forest-950 border border-stone-200 flex items-center justify-center font-serif text-xs shrink-0">{qIdx + 1}</span>
                        <h3 className="font-serif font-medium text-forest-950 text-sm leading-relaxed">{q.question}</h3>
                      </div>
                      <div className="space-y-2 ml-10">
                        {options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs transition-all ${
                              answers[q.id] === optIdx
                                ? 'border-sage-600 bg-sage-50/50 text-forest-950 font-medium'
                                : 'border-stone-200/80 hover:border-stone-300 hover:bg-linen/20 text-stone-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${answers[q.id] === optIdx ? 'border-sage-700 bg-sage-700' : 'border-stone-300'}`}>
                              {answers[q.id] === optIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-stone-100">
                {!learnerName && (
                  <div className="mb-4 space-y-3">
                    <h3 className="font-serif font-medium text-sm text-forest-950">Your Details (required for certificate)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="Full Name *" className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sage-500" />
                      <input type="email" value={learnerEmail} onChange={(e) => setLearnerEmail(e.target.value)} placeholder="Work Email *" className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-sage-500" />
                    </div>
                  </div>
                )}
                <button
                  onClick={submitQuiz}
                  disabled={isSubmitting || Object.keys(answers).length < course.questions.length || !learnerName || !learnerEmail}
                  className="w-full py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-ivory font-medium text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />Submitting…</> : <><Award className="w-4 h-4" />Submit & Get Certificate</>}
                </button>
                <p className="text-center text-xs text-stone-400 mt-2">{Object.keys(answers).length}/{course.questions.length} questions answered</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'result' && quizResult && (
          <div className="max-w-2xl mx-auto text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${quizResult.passed ? 'bg-sage-100 text-sage-700 border border-sage-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {quizResult.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>

            <h2 className="text-3xl font-serif font-normal text-forest-950 mb-2">
              {quizResult.passed ? 'Congratulations!' : 'Not Quite There'}
            </h2>
            <p className="text-stone-600 text-base mb-2">
              You scored <strong className={quizResult.passed ? 'text-sage-800' : 'text-red-600'}>{quizResult.scorePercentage}%</strong>
            </p>
            <p className="text-stone-500 text-xs mb-8">
              {quizResult.passed ? `You passed with ${quizResult.scorePercentage}% (required: ${quizResult.passMark}%). Your certificate has been issued.` : `You need ${quizResult.passMark}% to pass. Review the course and try again.`}
            </p>

            {quizResult.passed && quizResult.certificateId && (
              <div className="bg-linen/50 border border-stone-200/80 rounded-3xl p-6 mb-6">
                <Award className="w-8 h-8 text-sage-700 mx-auto mb-2" />
                <p className="font-serif font-medium text-forest-950">Certificate Issued</p>
                <p className="text-xs text-stone-500 mb-4">Certificate No: {quizResult.certificateNumber}</p>
                <a
                  href={`/api/certificates/${quizResult.certificateId}/pdf`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs transition-colors"
                >
                  Download Certificate PDF
                </a>
              </div>
            )}

            <div className="space-y-3 text-left mt-8">
              <h3 className="font-serif font-medium text-forest-950">Question Review</h3>
              {quizResult.review.map((item: any, idx: number) => (
                <div key={idx} className={`p-4 rounded-2xl border ${item.isCorrect ? 'bg-sage-50/70 border-sage-200' : 'bg-red-50/70 border-red-200'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.isCorrect ? 'bg-sage-600 text-white' : 'bg-red-500 text-white'}`}>
                      {item.isCorrect ? <Check className="w-2.5 h-2.5" /> : <span className="text-[9px] font-bold">✗</span>}
                    </div>
                    <p className="text-xs font-medium text-forest-950">{item.question}</p>
                  </div>
                  <p className="text-xs text-stone-600 ml-6">{item.explanation}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              {!quizResult.passed && (
                <button onClick={() => { setAnswers({}); setCurrentView('overview'); }} className="flex-1 py-3 rounded-full border border-stone-200 text-forest-900 font-medium text-xs hover:bg-linen/40 transition-colors">
                  Review Course & Retry
                </button>
              )}
              <Link href="/training" className="flex-1 py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all">
                Back to All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
