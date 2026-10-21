'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  Download,
  BellRing,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  Shield,
  KeyRound,
  LogOut,
  User,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';
import { useSchoolAuth } from '@/lib/school-auth-context';
import SchoolSearchInput, { UKSchoolRecord } from '@/components/SchoolSearchInput';

export default function SchoolPortalPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    login,
    register,
    verifyCode,
    resendCode,
    logout,
  } = useSchoolAuth();

  // Active view for unauthenticated users: 'login' | 'register' | 'verify' | 'forgot'
  const [authView, setAuthView] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');
  const [isManualRegSchool, setIsManualRegSchool] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    schoolName: '',
    urn: '',
    postcode: '',
    townCity: '',
    contactName: '',
    jobTitle: 'School Business Manager',
    headteacherName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Verification state
  const [verifyEmail, setVerifyEmail] = useState('');
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status/Error messages
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Portal Dashboard data
  const [activeTab, setActiveTab] = useState<'stock' | 'orders' | 'invoices' | 'training'>('stock');
  const [orders, setOrders] = useState<any[]>([]);
  const [supplies, setSupplies] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load portal data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingData(true);

    const schoolId = user?.schoolId || 'sch-1';

    Promise.all([
      fetch(`/api/orders?schoolId=${schoolId}`).then((r) => r.json()).catch(() => ({ orders: [] })),
      fetch('/api/reminders').then((r) => r.json()).catch(() => ({ supplies: [] })),
      fetch('/api/invoices').then((r) => r.json()).catch(() => ({ invoices: [] })),
    ])
      .then(([ordersData, remindersData, invoicesData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (remindersData.supplies) {
          setSupplies(remindersData.supplies.filter((s: any) => s.school_id === schoolId || !s.school_id));
        }
        if (invoicesData.invoices) {
          setInvoices(invoicesData.invoices.filter((i: any) => i.school_id === schoolId || !i.school_id));
        }
      })
      .finally(() => setLoadingData(false));
  }, [isAuthenticated, user?.schoolId]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setIsSubmitting(true);

    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!res.success) {
      if (res.requiresVerification) {
        setVerifyEmail(loginEmail);
        setAuthView('verify');
        setActionError('Please verify your email address before accessing the school portal.');
      } else {
        setActionError(res.error || 'Invalid school credentials.');
      }
    }
  };

  // Demo Login Helper
  const handleDemoLogin = async () => {
    setLoginEmail('sbm@stmarys-school.co.uk');
    setLoginPassword('school2026');
    setActionError('');
    setIsSubmitting(true);
    const res = await login('sbm@stmarys-school.co.uk', 'school2026');
    setIsSubmitting(false);
    if (!res.success) {
      setActionError(res.error || 'Demo login failed');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (regData.password !== regData.confirmPassword) {
      setActionError('Passwords do not match.');
      return;
    }
    if (regData.password.length < 8) {
      setActionError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(regData);
    setIsSubmitting(false);

    if (res.success) {
      setVerifyEmail(regData.email);
      if (res.verificationCode) {
        setDemoCodeHint(res.verificationCode);
      }
      setResendCooldown(60);
      setAuthView('verify');
      setActionSuccess('School account registered! A 6-digit verification code has been dispatched to your email.');
    } else {
      setActionError(res.error || 'Registration failed. Please check your information.');
    }
  };

  // Handle PIN input change
  const handlePinChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = val.slice(-1);
    setPinDigits(newDigits);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle Verify Code
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = pinDigits.join('');
    if (fullCode.length !== 6) {
      setActionError('Please enter the complete 6-digit code.');
      return;
    }

    setActionError('');
    setActionSuccess('');
    setIsSubmitting(true);

    const res = await verifyCode(verifyEmail, fullCode);
    setIsSubmitting(false);

    if (res.success) {
      setActionSuccess('Email verified successfully! Opening school portal...');
    } else {
      setActionError(res.error || 'Invalid or expired verification code.');
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setActionError('');
    const res = await resendCode(verifyEmail);
    if (res.success) {
      if (res.verificationCode) {
        setDemoCodeHint(res.verificationCode);
      }
      setResendCooldown(60);
      setActionSuccess('A fresh 6-digit code has been dispatched to your school email.');
    } else {
      setActionError(res.error || 'Failed to resend code.');
    }
  };

  // Handle Password Reset Request
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/school/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: forgotEmail }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setForgotStep('reset');
        if (data.resetCode) {
          setDemoCodeHint(data.resetCode);
        }
        setActionSuccess('Password recovery code dispatched to your email.');
      } else {
        setActionError(data.error || 'Unable to request password reset.');
      }
    } catch {
      setIsSubmitting(false);
      setActionError('Network error requesting password reset.');
    }
  };

  // Handle Password Reset Confirm
  const handleForgotConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (newPassword.length < 8) {
      setActionError('New password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/school/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', email: forgotEmail, code: resetCode, newPassword }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setActionSuccess('Password successfully reset! You may now sign in.');
        setAuthView('login');
        setLoginEmail(forgotEmail);
        setForgotStep('request');
      } else {
        setActionError(data.error || 'Failed to reset password.');
      }
    } catch {
      setIsSubmitting(false);
      setActionError('Network error resetting password.');
    }
  };

  // Loading spinner during auth hydration
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfb] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#096556] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0c2340]">Loading School Portal...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNAUTHENTICATED STATE: Login, Register, Verify PIN, Forgot PW
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fbfb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#096556]" />
              NHS & DfE Compliant School Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">
              School Allergy Portal
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Secure portal for UK Schools, Academies & MATs to monitor emergency adrenaline stock, track orders, and manage staff allergy training.
            </p>
          </div>

          {/* Main Auth Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            {/* View Switcher Tabs (when not in verify or forgot) */}
            {authView !== 'verify' && authView !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setActionError('');
                    setActionSuccess('');
                  }}
                  className={`py-2.5 rounded-xl transition-all ${
                    authView === 'login'
                      ? 'bg-white text-[#0c2340] shadow-xs'
                      : 'text-stone-500 hover:text-[#0c2340]'
                  }`}
                >
                  Sign In to School
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('register');
                    setActionError('');
                    setActionSuccess('');
                  }}
                  className={`py-2.5 rounded-xl transition-all ${
                    authView === 'register'
                      ? 'bg-white text-[#0c2340] shadow-xs'
                      : 'text-stone-500 hover:text-[#0c2340]'
                  }`}
                >
                  Register New School
                </button>
              </div>
            )}

            {/* Error / Success Notifications */}
            {actionError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#096556] shrink-0 mt-0.5" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    School Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. sbm@stmarys-school.co.uk"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthView('forgot');
                        setForgotEmail(loginEmail);
                        setActionError('');
                        setActionSuccess('');
                      }}
                      className="text-xs text-[#096556] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#096556]/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to School Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('verify');
                      setActionError('');
                      setActionSuccess('');
                    }}
                    className="text-xs text-stone-500 hover:text-[#096556] transition-colors"
                  >
                    Need to enter a verification code? <span className="font-semibold underline">Verify email here</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {authView === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                      Find Official UK School <span className="text-red-500">*</span>
                    </label>
                    <SchoolSearchInput
                      selectedSchoolName={regData.schoolName}
                      isManualMode={isManualRegSchool}
                      onToggleManual={(m) => setIsManualRegSchool(m)}
                      onSelectSchool={(school: UKSchoolRecord) => {
                        setRegData((prev) => ({
                          ...prev,
                          schoolName: school.name,
                          urn: school.urn || prev.urn,
                          postcode: school.postcode || prev.postcode,
                          townCity: school.town_city || prev.townCity,
                          headteacherName: school.headteacher_name || prev.headteacherName,
                        }));
                      }}
                    />
                    {isManualRegSchool && (
                      <div className="mt-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Official School Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Oakridge Primary School"
                          value={regData.schoolName}
                          onChange={(e) => setRegData({ ...regData, schoolName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      DfE URN (6 Digits)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 102941"
                      value={regData.urn}
                      onChange={(e) => setRegData({ ...regData, urn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      School Postcode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SW1A 1AA"
                      value={regData.postcode}
                      onChange={(e) => setRegData({ ...regData, postcode: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Town / City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manchester"
                      value={regData.townCity}
                      onChange={(e) => setRegData({ ...regData, townCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Headteacher Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs Eleanor Clarke"
                      value={regData.headteacherName}
                      onChange={(e) => setRegData({ ...regData, headteacherName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Lead Contact Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={regData.contactName}
                      onChange={(e) => setRegData({ ...regData, contactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Contact Job Role
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. School Business Manager"
                      value={regData.jobTitle}
                      onChange={(e) => setRegData({ ...regData, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Official School Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. office@schoolname.sch.uk"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Please use your designated school or trust email for UK regulatory compliance.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Create Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 8 characters"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#096556]/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Register School & Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 3. VERIFY EMAIL PIN (6 DIGITS) */}
            {authView === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="space-y-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#096556] flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0c2340]">Enter 6-Digit Verification PIN</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    We sent a one-time security code to{' '}
                    <span className="font-semibold text-[#0c2340]">{verifyEmail || 'your school email'}</span>.
                  </p>
                </div>

                {/* Email change input if needed */}
                {!verifyEmail && (
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to verify"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                  />
                )}

                {/* 6 Digits Box */}
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pin-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg sm:text-xl rounded-xl border-2 border-stone-200 focus:border-[#096556] focus:outline-none bg-stone-50/50 text-[#0c2340] transition-colors"
                    />
                  ))}
                </div>

                {demoCodeHint && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-[11px] font-mono text-center">
                    <span>Dev Preview Note: Code logged as </span>
                    <strong className="text-[#096556] font-bold">{demoCodeHint}</strong>
                    <p className="text-[10px] text-stone-400 mt-0.5">Connect RESEND_API_KEY in .env.local for automatic school inbox delivery</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#096556]/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Access School Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className="text-[#096556] hover:underline font-semibold disabled:opacity-50 disabled:no-underline"
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('login');
                      setActionError('');
                      setActionSuccess('');
                    }}
                    className="text-stone-500 hover:text-[#0c2340]"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* 4. FORGOT PASSWORD */}
            {authView === 'forgot' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-serif font-bold text-[#0c2340]">Reset School Account Password</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {forgotStep === 'request'
                      ? 'Enter your registered school email to receive a password reset code.'
                      : 'Enter the 6-digit code and choose a new secure password.'}
                  </p>
                </div>

                {forgotStep === 'request' ? (
                  <form onSubmit={handleForgotRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                        School Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. sbm@stmarys-school.co.uk"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#096556]/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Password Reset Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotConfirm} className="space-y-4">
                    {demoCodeHint && (
                      <div className="p-2 text-center rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono">
                        Reset Code: <span className="font-bold">{demoCodeHint}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                        6-Digit Reset Code
                      </label>
                      <input
                        type="text"
                        required
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 font-mono tracking-widest text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                        New Password (Min 8 Characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-full bg-[#096556] hover:bg-[#075246] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#096556]/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Update Password & Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('login');
                      setActionError('');
                      setActionSuccess('');
                    }}
                    className="text-xs text-stone-500 hover:text-[#0c2340]"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Discreet Developer / Sandbox Testing Panel */}
          <div className="mt-8 text-center">
            <details className="inline-block text-left text-xs text-stone-400 group">
              <summary className="cursor-pointer hover:text-stone-600 font-semibold list-none text-center select-none py-1">
                ⚙️ Testing & Development Shortcuts
              </summary>
              <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-200 text-stone-600 text-xs shadow-xs space-y-2.5 max-w-sm mx-auto">
                <p className="font-bold text-[#0c2340]">Pre-loaded Test School Account</p>
                <div className="text-[11px] font-mono bg-stone-50 p-2 rounded-lg border border-stone-100 space-y-1">
                  <div>Email: <span className="text-[#0c2340] font-semibold">sbm@stmarys-school.co.uk</span></div>
                  <div>Password: <span className="text-[#0c2340] font-semibold">school2026</span></div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0c2340] font-bold text-xs transition-colors"
                >
                  Quick Sign-in to Test School &rarr;
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED STATE: School Allergy Management Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8fbfb] text-[#0c2340] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header with School Profile & Sign Out */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#096556] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                School Allergy Management Portal
              </span>
              <span className="text-xs text-stone-400 font-normal">
                • {user?.organisationName || 'St. Mary\'s Multi-Academy Trust'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0c2340]">
              {user?.schoolName || "St. Mary's CE Primary School"}
            </h1>
            <p className="text-xs text-stone-500">
              DfE URN: <span className="font-mono font-semibold text-[#0c2340]">{user?.urn || '102941'}</span> · Headteacher: {user?.headteacherName || 'Mrs. Eleanor Clarke'} · {user?.townCity || 'Manchester'}
            </p>
          </div>

          {/* User profile capsule & Sign Out */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#096556] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0c2340] leading-tight">{user?.name}</p>
                <p className="text-[10px] text-stone-500">{user?.jobTitle || 'School Business Manager'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'bg-[#096556] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0c2340] hover:bg-white'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Emergency Adrenaline Stock ({supplies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#096556] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0c2340] hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>School Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'bg-[#096556] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0c2340] hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices & 30-Day BACS ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'training'
                ? 'bg-[#096556] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#0c2340] hover:bg-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Staff CPD Academy</span>
          </button>
        </div>

        {/* TAB 1: REGISTERED EMERGENCY ADRENALINE STOCK */}
        {activeTab === 'stock' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-[#096556]" />
                  <h2 className="text-lg font-serif font-bold text-[#0c2340]">Registered Auto-Injector Stock</h2>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Live auto-injectors registered at this school premises with automated batch and expiry notifications.
                </p>
              </div>

              <Link
                href="/order-pens"
                className="px-5 py-2.5 rounded-full bg-[#096556] hover:bg-[#075246] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <span>Order Additional Pens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingData ? (
                <p className="col-span-3 text-xs text-stone-400 py-8 text-center">Loading adrenaline records...</p>
              ) : supplies.length === 0 ? (
                <div className="col-span-3 text-center py-12 border border-dashed border-stone-200 rounded-3xl">
                  <p className="text-sm font-semibold text-stone-600">No active adrenaline auto-injectors registered yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Place an order to have your school&apos;s batch monitored automatically.</p>
                  <Link
                    href="/order-pens"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-[#096556] text-white text-xs font-semibold"
                  >
                    <span>Order School Pens Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                supplies.map((sup) => (
                  <div
                    key={sup.id}
                    className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#096556]/50 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
                          Lot: {sup.batch_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                            sup.days_remaining <= 30
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : sup.days_remaining <= 90
                              ? 'bg-orange-50 text-orange-800 border border-orange-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {sup.days_remaining} days remaining
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-14 h-24 rounded-xl bg-stone-50 border border-stone-200/60 p-1 flex items-center justify-center shrink-0">
                          <MedicalDeviceVisual
                            type={
                              sup.product_name.includes('EpiPen')
                                ? sup.product_name.includes('300')
                                  ? 'epipen-300'
                                  : 'epipen-150'
                                : sup.product_name.includes('300')
                                ? 'jext-300'
                                : 'jext-150'
                            }
                            size="sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-sm text-[#0c2340] leading-snug">
                            {sup.product_name}
                          </h3>
                          <p className="text-xs text-stone-500 mt-1">
                            Supplied: {sup.supplied_date} · Qty: {sup.quantity_supplied} Twin Pack(s)
                          </p>
                          <p className="text-xs font-semibold text-[#0c2340] mt-2">
                            Expiry Date:{' '}
                            <span
                              className={
                                sup.days_remaining <= 60
                                  ? 'text-red-700 font-bold'
                                  : 'text-[#096556] font-bold'
                              }
                            >
                              {sup.expiry_date}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Monitored by Pharmacy
                      </span>
                      {sup.reorder_token && (
                        <Link
                          href={`/reorder/${sup.reorder_token}`}
                          className="text-xs font-semibold text-white bg-[#096556] hover:bg-[#075246] px-3.5 py-1.5 rounded-full shadow-xs transition-colors"
                        >
                          1-Click Reorder &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#0c2340] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#096556]" />
              Recent School Orders
            </h2>
            <div className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <p className="py-8 text-xs text-stone-400 text-center">No orders recorded yet.</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0c2340] text-sm">{ord.order_reference}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Placed: {ord.created_at?.split(' ')[0]} · Total: £{ord.total_amount?.toFixed(2)} · Method: {ord.payment_method?.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      {ord.tracking_number && (
                        <p className="text-[11px] text-[#096556] font-semibold mt-1">
                          Tracked Courier: {ord.courier_name} ({ord.tracking_number})
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize self-start sm:self-auto ${
                        ord.order_status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.order_status === 'awaiting_payment'
                          ? 'bg-stone-100 text-stone-700 border border-stone-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {ord.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES & 30-DAY BACS */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#0c2340] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#096556]" />
              School Invoices & 30-Day BACS Remittance
            </h2>
            <div className="divide-y divide-stone-100">
              {invoices.length === 0 ? (
                <p className="py-8 text-xs text-stone-400 text-center">No invoices issued.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0c2340] text-sm">{inv.invoice_number}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Due Date: {inv.due_date} · Amount: £{inv.total_amount?.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        BACS Payment Ref: <span className="font-bold text-[#0c2340]">{inv.bacs_reference}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </span>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0c2340] transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TRAINING ACCESS BANNER */}
        {activeTab === 'training' && (
          <div className="bg-[#096556] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">Staff Allergy CPD Training Academy</h3>
                <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                  All staff at {user?.schoolName || 'your school'} have full access to accredited anaphylaxis awareness, auto-injector administration practicals, and printable CPD certificates.
                </p>
              </div>
            </div>
            <Link
              href="/training"
              className="px-6 py-3.5 rounded-full bg-white text-[#096556] hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
            >
              Launch Training Modules &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
