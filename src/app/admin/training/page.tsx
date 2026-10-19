'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function AdminTrainingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/training')
      .then((r) => r.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
        if (data.enrolments) setEnrolments(data.enrolments);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Training Modules & Staff Certificates</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor school staff allergy training completion, pass rates, and verified CPD certificate issuance.
          </p>
        </div>
      </div>

      {/* Courses summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {course.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{course.duration_minutes} Mins</span>
              </div>
              <h3 className="font-bold text-base text-navy-950 mb-2">{course.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{course.summary}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Pass threshold: <strong>{course.pass_mark_percentage}%</strong></span>
              <a href={`/training/${course.slug}`} target="_blank" className="text-brand-600 font-bold hover:underline">
                Preview Course &nearr;
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Enrolment & Certificate Database */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-navy-900">Staff Learner Records & CPD Certificates</h2>
          <span className="text-xs text-slate-500">{enrolments.length} total completions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Learner Name</th>
                <th className="py-3.5 px-4">School</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Exam Score</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Completed Date</th>
                <th className="py-3.5 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">No staff enrolments recorded yet.</td>
                </tr>
              ) : (
                enrolments.map((e: any) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-navy-950">
                      {e.learner_name}
                      <span className="block text-[10px] text-slate-400 font-normal">{e.learner_email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{e.school_name || "St. Mary's CE Primary"}</td>
                    <td className="py-3.5 px-4 text-slate-800">{e.course_title}</td>
                    <td className="py-3.5 px-4 font-black text-navy-900">{e.quiz_score}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {e.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{e.completed_at?.split(' ')[0]}</td>
                    <td className="py-3.5 px-4 text-right">
                      {e.certificate_id ? (
                        <a
                          href={`/api/certificates/${e.certificate_id}/pdf`}
                          target="_blank"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Certificate
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
