'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Award, Users, ArrowRight, Play, GraduationCap } from 'lucide-react';

export default function TrainingPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/training')
      .then((r) => r.json())
      .then((data) => setCourses(data.courses || []));
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-forest-900 font-sans">
      {/* Header */}
      <section className="bg-forest-950 text-stone-200 py-16 px-4 border-b border-forest-900/60 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FAF8F5 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#096556]/20 border border-[#096556]/40 flex items-center justify-center mx-auto mb-5 text-emerald-300">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest bg-emerald-400/10 px-3.5 py-1 rounded-full border border-emerald-400/20">
            Staff Academy & CPD Accreditation
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-ivory mt-4 mb-3 tracking-tight">
            Allergy Safety Training for School Staff
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            CPD-recognised online training modules for teachers, teaching assistants, lunchtime supervisors, and school leadership.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
            <span className="bg-white/10 text-stone-200 rounded-full px-4 py-1.5 border border-white/10 font-medium">Free for Adrenaline4Schools customers</span>
            <span className="bg-white/10 text-stone-200 rounded-full px-4 py-1.5 border border-white/10 font-medium">Certificates issued upon completion</span>
            <span className="bg-white/10 text-stone-200 rounded-full px-4 py-1.5 border border-white/10 font-medium">Benedict&apos;s Law compliant content</span>
          </div>
        </div>
      </section>

      {/* Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-serif font-normal text-forest-950 mb-8">Available Training Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/90 rounded-3xl border border-stone-200/80 shadow-xs hover:border-sage-400 transition-all overflow-hidden group flex flex-col justify-between">
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-800 border border-sage-200/70 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium bg-sage-100/70 text-sage-900 px-3 py-1 rounded-full border border-sage-200">
                    {course.category}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-medium text-forest-950 mt-4 mb-2 group-hover:text-sage-800 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {course.summary}
                </p>

                <div className="flex flex-wrap gap-4 mt-5 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sage-700" />{course.duration_minutes} mins</span>
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-sage-700" />{course.pass_mark_percentage}% to pass</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-sage-700" />Certificate issued</span>
                </div>
              </div>

              <div className="px-7 pb-7 pt-4 border-t border-stone-100 bg-linen/20">
                <p className="text-xs text-stone-500 mb-3"><strong className="text-forest-950 font-medium">Target:</strong> {course.target_audience}</p>
                <Link
                  href={`/training/${course.slug}`}
                  className="w-full py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Training
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Section */}
        <div className="mt-12 bg-linen/40 border border-stone-200/80 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-serif font-medium text-forest-950 mb-3">Important Notice About Online Training</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            These online training modules are designed to support school staff awareness and preparedness. They provide educational information about anaphylaxis recognition, emergency procedures and adrenaline auto-injectors. They do not replace formal first aid qualifications, employer-mandated training, or clinical instruction from healthcare professionals. Schools should ensure training reflects current official Department of Health guidance and Resuscitation Council UK guidelines. Completion of these modules should be recorded alongside any formal training records maintained by the school.
          </p>
        </div>
      </div>
    </div>
  );
}
