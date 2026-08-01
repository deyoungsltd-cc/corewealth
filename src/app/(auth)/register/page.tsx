'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CoreWealthLogo from '@/components/CoreWealthLogo';
import TurnstileWidget from '@/components/TurnstileWidget';
import { useAuthStore } from '@/store/useAuthStore';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COUNTRIES = [
  { value: 'US', label: 'United States', code: '+1' },
  { value: 'GB', label: 'United Kingdom', code: '+44' },
  { value: 'CA', label: 'Canada', code: '+1' },
  { value: 'AU', label: 'Australia', code: '+61' },
  { value: 'DE', label: 'Germany', code: '+49' },
  { value: 'FR', label: 'France', code: '+33' },
  { value: 'JP', label: 'Japan', code: '+81' },
  { value: 'CH', label: 'Switzerland', code: '+41' },
  { value: 'SG', label: 'Singapore', code: '+65' },
  { value: 'AE', label: 'United Arab Emirates', code: '+971' },
  { value: 'NL', label: 'Netherlands', code: '+31' },
  { value: 'SE', label: 'Sweden', code: '+46' },
  { value: 'HK', label: 'Hong Kong', code: '+852' },
  { value: 'NZ', label: 'New Zealand', code: '+64' },
  { value: 'IE', label: 'Ireland', code: '+353' },
];

const BRANDING = [
  {
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    title: 'Banking that',
    highlight: 'works for you.',
    desc: 'Open your account in minutes. No paperwork, no branch visits. Just smart, secure banking from anywhere.',
    features: [
      { svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', t: 'Bank-grade security', d: '256-bit encryption protects every transaction' },
      { svg: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>', t: 'Virtual & physical cards', d: 'Instant virtual card, physical card delivered to your door' },
      { svg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', t: '24/7 access', d: 'Manage your money anytime, anywhere' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    title: 'Your address,',
    highlight: 'your choice.',
    desc: 'We serve customers across 180+ countries. Tell us where you are and we\'ll tailor the experience.',
    features: [
      { svg: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', t: 'Global coverage', d: 'Operate from anywhere in the world' },
      { svg: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>', t: 'Instant notifications', d: 'Real-time alerts for every transaction' },
      { svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', t: 'FDIC insured', d: 'Your deposits are protected up to $250,000' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    title: 'Verify your',
    highlight: 'identity.',
    desc: 'A quick selfie is all it takes. Our AI-powered system verifies your identity in seconds.',
    features: [
      { svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', t: 'AI-powered KYC', d: 'Advanced facial recognition technology' },
      { svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', t: 'Secure verification', d: 'Your biometric data is encrypted end-to-end' },
      { svg: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', t: 'Fast approval', d: 'Most accounts verified within 60 seconds' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    title: 'Welcome to',
    highlight: 'CoreWealth.',
    desc: 'Review your details, accept our policies, and you\'re ready to go. Your financial journey starts now.',
    features: [
      { svg: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', t: 'AML compliant', d: 'Full anti-money laundering compliance' },
      { svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', t: 'Regulated entity', d: 'Licensed and regulated financial institution' },
      { svg: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', t: 'Global reach', d: 'Bank in 180+ countries with one account' },
    ],
  },
];

const STEPS_LABELS = ['Personal Info', 'Address & Details', 'Selfie Capture', 'Review & Submit'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { level: 0, label: 'Too Short', color: 'bg-gray-600' },
    { level: 1, label: 'Weak', color: 'bg-red-500' },
    { level: 2, label: 'Fair', color: 'bg-orange-500' },
    { level: 3, label: 'Good', color: 'bg-yellow-500' },
    { level: 4, label: 'Strong', color: 'bg-green-500' },
  ];
  return levels[Math.min(score, 4)] || levels[0];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', countryCode: '+1', country: 'US',
    dobMonth: '', dobDay: '', dobYear: '',
    password: '', confirmPassword: '',
    streetAddress: '', city: '', state: '', postalCode: '',
    accountType: 'Checking', referralCode: '',
    terms: false, privacy: false, aml: false, ageConfirm: false,
  });
  const [selfie, setSelfie] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const strength = getPasswordStrength(form.password);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const goNext = () => { setAnimKey((k) => k + 1); setStep((s) => Math.min(s + 1, 4)); setError(''); };
  const goBack = () => { setAnimKey((k) => k + 1); setStep((s) => Math.max(s - 1, 1)); setError(''); };

  /* ---- Validation ---- */
  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) e.firstName = 'At least 2 characters';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) e.lastName = 'At least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{5,15}$/.test(form.phone.replace(/[\s\-()]/g, ''))) e.phone = 'Enter a valid phone number';
    if (!form.dobMonth || !form.dobDay || !form.dobYear) e.dob = 'Date of birth is required';
    else {
      const m = parseInt(form.dobMonth, 10); const d = parseInt(form.dobDay, 10); const y = parseInt(form.dobYear, 10);
      if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) e.dob = 'Enter a valid date';
    }
    if (!form.country) e.country = 'Country is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Need at least one uppercase letter';
    else if (!/[a-z]/.test(form.password)) e.password = 'Need at least one lowercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Need at least one number';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.streetAddress.trim()) e.streetAddress = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State/Province is required';
    if (!form.postalCode.trim()) e.postalCode = 'Postal/ZIP code is required';
    if (form.referralCode && form.referralCode.trim().length < 3) e.referralCode = 'Invalid referral code';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.terms) e.terms = 'You must accept the Terms of Service';
    if (!form.privacy) e.privacy = 'You must accept the Privacy Policy';
    if (!form.aml) e.aml = 'You must acknowledge the AML Policy';
    if (!form.ageConfirm) e.ageConfirm = 'You must confirm your age';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---- Camera ---- */
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 640 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(false);
      }
    } catch { setCameraError(true); setCameraActive(false); }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }, []);

  const captureSelfie = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setSelfie(canvas.toDataURL('image/jpeg', 0.8));
    stopCamera();
  };

  const retakeSelfie = () => { setSelfie(null); setCameraError(false); };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelfie(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (step === 3 && !selfie && !cameraError && !cameraActive) {
      const t = setTimeout(() => startCamera(), 300);
      return () => clearTimeout(t);
    }
    return () => { if (step !== 3) stopCamera(); };
  }, [step, selfie, cameraError, cameraActive, startCamera, stopCamera]);

  /* ---- Submit ---- */
  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          email: form.email.trim(), password: form.password,
          referralCode: form.referralCode.trim() || undefined,
          captchaToken: captchaToken || undefined,
          phone: form.phone.trim(), countryCode: form.countryCode,
          dateOfBirth: `${form.dobYear}-${form.dobMonth.padStart(2, '0')}-${form.dobDay.padStart(2, '0')}`,
          country: form.country,
          streetAddress: form.streetAddress.trim(), city: form.city.trim(),
          state: form.state.trim(), postalCode: form.postalCode.trim(),
          accountType: form.accountType,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        setAuth(data.data.user, data.data.token);
        router.push('/dashboard');
      } else {
        if (data.error?.code === 'EMAIL_EXISTS') setError('This email is already registered. Please sign in.');
        else if (data.error?.code === 'INVALID_REFERRAL_CODE') setError('Invalid referral code.');
        else setError(data.error?.message || 'Registration failed. Please try again.');
      }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  /* ---- UI ---- */
  const ic = (field?: string) =>
    `w-full bg-white/5 border ${field && fieldErrors[field] ? 'border-red-500/80' : 'border-white/10'} rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]/60 focus:ring-1 focus:ring-[#2563EB]/20 backdrop-blur transition-all duration-200`;

  const selC = (field?: string) =>
    `w-full bg-white/5 border ${field && fieldErrors[field] ? 'border-red-500/80' : 'border-white/10'} rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB]/60 focus:ring-1 focus:ring-[#2563EB]/20 backdrop-blur transition-all duration-200 appearance-none cursor-pointer [background-image:url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F3E%3C%2Fsvg%3E')] [background-repeat:no-repeat] [background-position:right_14px_center]`;

  const countryLabel = COUNTRIES.find((c) => c.value === form.country)?.label || '';
  const monthLabel = MONTHS[parseInt(form.dobMonth, 10) - 1] || '';
  const accountTypeLabel = form.accountType;

  const brand = BRANDING[step - 1];

  const ErrorIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  );
  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );
  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  );
  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );
  const BackArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  );
  const RightArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  );
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#060A13] flex">
      {/* ===== LEFT PANEL (DESKTOP) ===== */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 transition-opacity duration-700">
          <Image src={brand.image} alt="" fill className="object-cover" priority={step === 1} />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060A13]/80 via-[#060A13]/70 to-[#2563EB]/20" />
        {/* Purple ambient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#60A5FA]/5 rounded-full blur-[100px]" />
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <CoreWealthLogo variant="wordmark" className="h-9" />
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              {brand.title}{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">{brand.highlight}</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">{brand.desc}</p>
            <div className="space-y-4">
              {brand.features.map((f) => (
                <div key={f.t} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: f.svg }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.t}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} CoreWealth Bank. All rights reserved.</p>
        </div>
      </div>

      {/* ===== RIGHT PANEL (FORM) ===== */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile header */}
        <div className="lg:hidden relative h-32 shrink-0 overflow-hidden">
          <Image src={brand.image} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060A13]/60 to-[#060A13]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CoreWealthLogo className="h-10" />
          </div>
        </div>

        {/* Mobile ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2563EB]/5 rounded-full blur-[150px] pointer-events-none lg:hidden" />

        {/* Scrollable form area */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-6 py-6 lg:py-12 overflow-y-auto">
          <div className="w-full max-w-lg relative z-10">

            {/* ---- STEP INDICATOR ---- */}
            <div className="flex items-center justify-center mb-8">
              {STEPS_LABELS.map((label, i) => {
                const n = i + 1;
                const isCompleted = n < step;
                const isCurrent = n === step;
                return (
                  <div key={label} className="flex items-center">
                    {/* Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                            : isCurrent
                            ? 'bg-[#2563EB] text-white shadow-[0_0_16px_rgba(124,58,237,0.5)] ring-2 ring-[#60A5FA]/40'
                            : 'bg-white/5 border border-white/10 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <CheckIcon /> : n}
                      </div>
                      <span className={`text-[10px] mt-1.5 hidden sm:block ${isCurrent ? 'text-[#60A5FA] font-medium' : 'text-gray-600'}`}>{label}</span>
                    </div>
                    {/* Line */}
                    {i < 3 && (
                      <div className={`w-10 sm:w-16 h-0.5 mx-1.5 rounded-full transition-all duration-300 ${n < step ? 'bg-[#2563EB]' : 'bg-white/10'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---- GLOBAL ERROR ---- */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                <ErrorIcon /> {error}
              </div>
            )}

            {/* ======== STEP CONTENT ======== */}
            <div key={animKey} className="animate-[fadeSlideIn_0.35s_ease-out]">

              {/* ============ STEP 1 ============ */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="mb-5">
                    <h1 className="text-2xl font-bold text-white">Personal Information</h1>
                    <p className="text-gray-400 text-sm mt-1">Tell us about yourself to get started.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">First Name</label>
                      <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" autoComplete="given-name" className={ic('firstName')} />
                      {fieldErrors.firstName && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">Last Name</label>
                      <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" autoComplete="family-name" className={ic('lastName')} />
                      {fieldErrors.lastName && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" className={ic('email')} />
                    {fieldErrors.email && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <select value={form.countryCode} onChange={(e) => update('countryCode', e.target.value)} className={`${selC()} w-24 shrink-0`}>
                        {COUNTRIES.map((c) => (
                          <option key={c.value + c.code} value={c.code} className="bg-[#0e1420] text-white">{c.code}</option>
                        ))}
                      </select>
                      <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 000-0000" autoComplete="tel" className={ic('phone')} />
                    </div>
                    {fieldErrors.phone && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={form.dobMonth} onChange={(e) => update('dobMonth', e.target.value)} className={selC()}>
                        <option value="" className="bg-[#0e1420] text-white">Month</option>
                        {MONTHS.map((m, i) => (
                          <option key={m} value={String(i + 1)} className="bg-[#0e1420] text-white">{m}</option>
                        ))}
                      </select>
                      <select value={form.dobDay} onChange={(e) => update('dobDay', e.target.value)} className={selC()}>
                        <option value="" className="bg-[#0e1420] text-white">Day</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1)} className="bg-[#0e1420] text-white">{i + 1}</option>
                        ))}
                      </select>
                      <select value={form.dobYear} onChange={(e) => update('dobYear', e.target.value)} className={selC()}>
                        <option value="" className="bg-[#0e1420] text-white">Year</option>
                        {Array.from({ length: 100 }, (_, i) => {
                          const y = new Date().getFullYear() - i;
                          return <option key={y} value={String(y)} className="bg-[#0e1420] text-white">{y}</option>;
                        })}
                      </select>
                    </div>
                    {fieldErrors.dob && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Country</label>
                    <select value={form.country} onChange={(e) => update('country', e.target.value)} className={selC('country')}>
                      <option value="" className="bg-[#0e1420] text-white">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value} className="bg-[#0e1420] text-white">{c.label}</option>
                      ))}
                    </select>
                    {fieldErrors.country && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 chars, Aa1@" autoComplete="new-password" className={ic('password') + ' pr-11'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.password}</p>}
                    {form.password && (
                      <div className="mt-2.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-white/5'}`} />
                          ))}
                        </div>
                        <p className="text-xs mt-1 text-gray-500">{strength.label}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat your password" autoComplete="new-password" className={ic('confirmPassword') + ' pr-11'} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" tabIndex={-1}>
                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.confirmPassword}</p>}
                  </div>

                  <button
                    type="button" onClick={() => { if (validateStep1()) goNext(); }}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0 mt-2"
                  >
                    Continue <span className="inline-block ml-1"><RightArrow /></span>
                  </button>
                </div>
              )}

              {/* ============ STEP 2 ============ */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="mb-5">
                    <h1 className="text-2xl font-bold text-white">Address & Account Details</h1>
                    <p className="text-gray-400 text-sm mt-1">Where should we send your cards and statements?</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Street Address</label>
                    <input type="text" value={form.streetAddress} onChange={(e) => update('streetAddress', e.target.value)} placeholder="123 Main Street, Apt 4B" autoComplete="street-address" className={ic('streetAddress')} />
                    {fieldErrors.streetAddress && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.streetAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">City</label>
                      <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="New York" autoComplete="address-level2" className={ic('city')} />
                      {fieldErrors.city && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">State / Province</label>
                      <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="NY" autoComplete="address-level1" className={ic('state')} />
                      {fieldErrors.state && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.state}</p>}
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Postal / ZIP Code</label>
                    <input type="text" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} placeholder="10001" autoComplete="postal-code" className={ic('postalCode')} />
                    {fieldErrors.postalCode && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.postalCode}</p>}
                  </div>

                  {/* Account Type Cards */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Account Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Checking', 'Savings', 'Both Checking & Savings'] as const).map((type) => {
                        const shortLabel = type === 'Both Checking & Savings' ? 'Both' : type;
                        const isSelected = form.accountType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => update('accountType', type)}
                            className={`relative rounded-xl border p-4 text-center transition-all duration-200 ${
                              isSelected
                                ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </div>
                            )}
                            <div className={`text-lg mb-1 ${isSelected ? 'text-[#60A5FA]' : 'text-gray-500'}`}>
                              {type === 'Checking' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                              )}
                              {type === 'Savings' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-0.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.1C1.7 11 1 13 1 15"/><path d="M5.4 6.4C4.3 7.8 4 9.4 4 11"/></svg>
                              )}
                              {type === 'Both Checking & Savings' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
                              )}
                            </div>
                            <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>{shortLabel}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Referral Code <span className="text-gray-600 font-normal">(optional)</span></label>
                    <input type="text" value={form.referralCode} onChange={(e) => update('referralCode', e.target.value)} placeholder="Enter referral code" className={ic('referralCode')} />
                    {fieldErrors.referralCode && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.referralCode}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={goBack} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-gray-300 text-sm font-medium transition-all duration-200">
                      <BackArrow /> Back
                    </button>
                    <button
                      type="button" onClick={() => { if (validateStep2()) goNext(); }}
                      className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue <span className="inline-block ml-1"><RightArrow /></span>
                    </button>
                  </div>
                </div>
              )}

              {/* ============ STEP 3 ============ */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="mb-5">
                    <h1 className="text-2xl font-bold text-white">Selfie Verification</h1>
                    <p className="text-gray-400 text-sm mt-1">Position your face within the frame. Ensure good lighting.</p>
                  </div>

                  {/* Camera / Selfie area */}
                  <div className="flex flex-col items-center">
                    {!selfie ? (
                      <>
                        {/* Camera preview or fallback */}
                        <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-5">
                          {!cameraError ? (
                            <>
                              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                              {/* Oval guide overlay */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-64 rounded-[50%] border-2 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                              </div>
                              {/* Corner markers */}
                              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#2563EB]/60 rounded-tl-lg" />
                              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#2563EB]/60 rounded-tr-lg" />
                              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#2563EB]/60 rounded-bl-lg" />
                              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#2563EB]/60 rounded-br-lg" />
                              {/* Instruction text */}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-center">
                                <p className="text-white/80 text-xs">Center your face in the oval</p>
                              </div>
                              {!cameraActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                  <div className="text-center">
                                    <Spinner />
                                    <p className="text-gray-400 text-xs mt-2">Starting camera...</p>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                              </div>
                              <p className="text-gray-300 text-sm font-medium mb-1">Camera not available</p>
                              <p className="text-gray-500 text-xs mb-4">Upload a photo instead</p>
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-[#2563EB]/20 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-[#60A5FA] text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                Upload Photo
                                <input type="file" accept="image/*" capture="user" onChange={handleFileUpload} className="hidden" />                              </label>
                            </div>
                          )}
                        </div>

                        {/* Capture button */}
                        {!cameraError && cameraActive && (
                          <button
                            type="button"
                            onClick={captureSelfie}
                            className="w-16 h-16 rounded-full bg-white border-4 border-[#2563EB] hover:border-[#60A5FA] transition-all duration-200 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] active:scale-95 group"
                          >
                            <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gray-100 transition-colors" />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Selfie preview */}
                        <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-white/5 border-2 border-[#2563EB]/40 shadow-[0_0_30px_rgba(124,58,237,0.15)] mb-5">
                          <img src={selfie} alt="Your selfie" className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={retakeSelfie}
                          className="inline-flex items-center gap-2 text-[#60A5FA] hover:text-white text-sm font-medium transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                          Retake Photo
                        </button>
                      </>
                    )}
                  </div>

                  {/* Hidden canvas for capture */}
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={goBack} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-gray-300 text-sm font-medium transition-all duration-200">
                      <BackArrow /> Back
                    </button>
                    <button
                      type="button" onClick={goNext}
                      className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue <span className="inline-block ml-1"><RightArrow /></span>
                    </button>
                  </div>
                </div>
              )}

              {/* ============ STEP 4 ============ */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="mb-5">
                    <h1 className="text-2xl font-bold text-white">Review & Submit</h1>
                    <p className="text-gray-400 text-sm mt-1">Please review your information before creating your account.</p>
                  </div>

                  {/* Summary card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur p-5 space-y-4">
                    {/* Selfie preview */}
                    {selfie && (
                      <div className="flex justify-center mb-2">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#2563EB]/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                          <img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Full Name</p>
                        <p className="text-white font-medium">{form.firstName} {form.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-white font-medium break-all">{form.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                        <p className="text-white font-medium">{form.countryCode} {form.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Date of Birth</p>
                        <p className="text-white font-medium">{monthLabel} {form.dobDay}, {form.dobYear}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Country</p>
                        <p className="text-white font-medium">{countryLabel}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Account Type</p>
                        <p className="text-white font-medium">{accountTypeLabel}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Address</p>
                      <p className="text-white font-medium text-sm">{form.streetAddress}, {form.city}, {form.state} {form.postalCode}</p>
                    </div>
                  </div>

                  {/* Policy checkboxes */}
                  <div className="space-y-3">
                    {[
                      { key: 'terms', label: <>I agree to the <Link href="/terms" target="_blank" className="text-[#60A5FA] hover:text-[#2563EB] transition-colors underline underline-offset-2">Terms of Service</Link></> },
                      { key: 'privacy', label: <>I agree to the <Link href="/privacy" target="_blank" className="text-[#60A5FA] hover:text-[#2563EB] transition-colors underline underline-offset-2">Privacy Policy</Link></> },
                      { key: 'aml', label: <>I acknowledge the <Link href="/aml-policy" target="_blank" className="text-[#60A5FA] hover:text-[#2563EB] transition-colors underline underline-offset-2">AML (Anti-Money Laundering) Policy</Link></> },
                      { key: 'ageConfirm', label: 'I confirm the information provided is accurate and I am at least 18 years of age' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form[key as keyof typeof form] as boolean}
                          onChange={(e) => update(key, e.target.checked)}
                          className="mt-0.5 accent-[#2563EB] w-4 h-4 rounded cursor-pointer"
                        />
                        <span className={`text-xs leading-relaxed ${fieldErrors[key] ? 'text-red-400' : 'text-gray-400'}`}>{label}</span>
                      </div>
                    ))}
                    {Object.entries(fieldErrors).filter(([k]) => ['terms','privacy','aml','ageConfirm'].includes(k)).map(([k, v]) => (
                      <p key={k} className="text-red-400 text-xs pl-7">{v}</p>
                    ))}
                  </div>

                  {/* Turnstile */}
                  <TurnstileWidget onToken={(t) => setCaptchaToken(t)} onError={() => setCaptchaToken(null)} onExpire={() => setCaptchaToken(null)} />

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={goBack} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-gray-300 text-sm font-medium transition-all duration-200">
                      <BackArrow /> Back
                    </button>
                    <button
                      type="button" onClick={handleSubmit} disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2"><Spinner /> Opening Account...</span>
                      ) : 'Open My Account'}
                    </button>
                  </div>
                </div>
              )}

            </div>{/* end animKey wrapper */}

            {/* ---- Already a member ---- */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-600 text-xs uppercase tracking-wider">Already a member?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              href="/login"
              className="block w-full text-center bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#2563EB]/30 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Keyframes for step animation */}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}` }} />
    </div>
  );
}