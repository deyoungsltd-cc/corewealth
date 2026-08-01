'use client';

import { useState, useEffect, useCallback, Component, type ReactNode, type ErrorInfo } from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import {  
  Shield,
  Upload,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Camera,
  X,
  HelpCircle,
  ChevronRight,
  Building2,
} from 'lucide-react';

// ── Error Boundary ──

class KycErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[KYC Error Boundary]', error?.message, error?.stack, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-foreground font-bold text-lg">Identity Verification</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Complete verification to unlock full banking services</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-foreground text-sm font-medium mb-1">Failed to load verification page</p>
            <p className="text-muted-foreground text-xs mb-5">An unexpected error occurred. Please try refreshing.</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Types ──

type DocumentCategory = 'id_front' | 'id_back' | 'selfie' | 'proof_of_address';
type DocumentType = 'passport' | 'drivers_license' | 'national_id' | 'residence_permit';

interface VerificationStep {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  documents: { type: DocumentCategory; label: string; hint: string; accept?: string }[];
  features: string[];
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    step: 1,
    title: 'Step 1 — Personal Information',
    subtitle: 'Government-issued photo identification',
    description:
      'Upload the front and back of a valid government-issued photo ID. Accepted documents include passports, driver\'s licenses, national ID cards, and residence permits.',
    icon: <Shield className="w-5 h-5" />,
    documents: [
      { type: 'id_front', label: 'ID — Front Side', hint: 'Passport, driver\'s license, national ID, or residence permit (front)' },
      { type: 'id_back', label: 'ID — Back Side', hint: 'Back of your identification document' },
    ],
    features: [
      'Deposit up to $5,000 per transaction',
      'Access basic banking services',
      'View account statements',
    ],
  },
  {
    step: 2,
    title: 'Step 2 — Facial Verification',
    subtitle: 'Biometric identity confirmation',
    description:
      'Take a clear, well-lit selfie so we can verify your identity matches the submitted ID document. Ensure good lighting, no face coverings, and a neutral expression.',
    icon: <Camera className="w-5 h-5" />,
    documents: [
      { type: 'selfie', label: 'Selfie Photo', hint: 'Clear, well-lit photo of your face — no sunglasses or masks' },
    ],
    features: [
      'Deposit up to $50,000 per transaction',
      'Apply for credit products',
      'Priority customer support',
    ],
  },
  {
    step: 3,
    title: 'Step 3 — Address Verification',
    subtitle: 'Proof of residential address',
    description:
      'Upload a recent utility bill, bank statement, or government-issued letter that clearly shows your full name and residential address. Documents must be issued within the last 90 days.',
    icon: <Home className="w-5 h-5" />,
    documents: [
      { type: 'proof_of_address', label: 'Proof of Address', hint: 'Utility bill, bank statement, or tax document (issued within 90 days)' },
    ],
    features: [
      'Unlimited withdrawal access',
      'Deposit up to $250,000 per transaction',
      'International wire transfers',
      'Premium banking features',
    ],
  },
];

const SUPPORTED_DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'national_id', label: 'National ID Card' },
  { value: 'residence_permit', label: 'Residence Permit' },
];

const DOC_LABEL: Record<DocumentCategory, string> = {
  id_front: 'ID — Front',
  id_back: 'ID — Back',
  selfie: 'Selfie',
  proof_of_address: 'Proof of Address',
};

// ── Helpers ──

function levelFromString(s: string | undefined | null): number {
  if (!s) return 0;
  const m = /LEVEL_(\d)/.exec(s);
  return m ? parseInt(m[1], 10) : 0;
}

function formatDate(iso?: string | Date | null): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    approved: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800/50',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800/50',
    expired: 'bg-muted text-muted-foreground border-border',
  };
  const cls = styles[status] || 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${cls} capitalize`}>
      {status}
    </span>
  );
}

// ── File Picker Component ──

interface FilePickerProps {
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File | null) => void;
}

function FilePicker({ label, hint, file, onFile }: FilePickerProps) {
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div>
      <label className="block text-foreground text-sm font-medium mb-2">{label}</label>
      <label className="group flex flex-col items-center justify-center h-36 border-2 border-dashed border-border rounded-xl hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 transition-all cursor-pointer bg-muted/50 overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="h-full w-full object-contain" />
        ) : file ? (
          <span className="text-green-600 dark:text-green-400 text-sm font-medium px-3 text-center flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />{file.name}
          </span>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-2 group-hover:bg-[#7C3AED]/20 transition-colors">
              <Upload className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <span className="text-foreground text-sm font-medium">Click to upload</span>
            <span className="text-muted-foreground text-xs mt-1 px-4 text-center">{hint}</span>
          </>
        )}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
      </label>
      {file && (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="text-xs text-muted-foreground hover:text-red-500 mt-1.5 flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" /> Remove file
        </button>
      )}
    </div>
  );
}

// ── FAQ Data ──

const FAQ_ITEMS = [
  {
    question: 'What documents are accepted for identity verification?',
    answer:
      'CoreWealth Bank accepts the following government-issued identification: valid passports, driver\'s licenses, national ID cards, and residence permits. All documents must be current and not expired.',
  },
  {
    question: 'How long does the verification process take?',
    answer:
      'Most verifications are reviewed within 1–2 business days. During peak periods, it may take up to 3 business days. You will receive an email notification once your documents have been reviewed.',
  },
  {
    question: 'What qualifies as proof of address?',
    answer:
      'Accepted proof of address documents include: utility bills (electric, water, gas), bank statements, tax assessment letters, or government-issued correspondence. The document must show your full name and current residential address, and must be issued within the last 90 days.',
  },
  {
    question: 'What if my verification is rejected?',
    answer:
      'If your verification is rejected, you will receive a detailed reason via email and in your account dashboard. You can then correct the issue and resubmit the required documents. There is no limit on resubmissions.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'CoreWealth Bank uses bank-grade 256-bit AES encryption for all document storage and transmission. Your documents are processed in compliance with international data protection regulations and are only used for identity verification purposes.',
  },
  {
    question: 'Can I update my verified information later?',
    answer:
      'Yes. If your identification documents expire or your personal details change, you can submit updated documents through this page. Your account will retain its existing verification level during the update process.',
  },
];

// ── Verification Step Card ──

interface StepCardProps {
  config: VerificationStep;
  status: 'locked' | 'available' | 'pending' | 'approved' | 'rejected';
  isExpanded: boolean;
  onExpand: () => void;
  onSubmit: (docs: { type: DocumentCategory; file: File }[]) => Promise<void>;
  submitting: boolean;
  lastRejectionNote?: string | null;
  selectedDocType: DocumentType;
  onDocTypeChange: (t: DocumentType) => void;
}

function StepCard({
  config,
  status,
  isExpanded,
  onExpand,
  onSubmit,
  submitting,
  lastRejectionNote,
  selectedDocType,
  onDocTypeChange,
}: StepCardProps) {
  const [files, setFiles] = useState<Record<DocumentCategory, File | null>>({
    id_front: null,
    id_back: null,
    selfie: null,
    proof_of_address: null,
  });

  const setFile = (type: DocumentCategory, f: File | null) => setFiles((prev) => ({ ...prev, [type]: f }));
  const allFilesReady = config.documents.every((d) => files[d.type]);

  const statusIndicator = () => {
    if (status === 'approved') {
      return (
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/30 border-2 border-green-500 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/30 border-2 border-amber-500 flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-500" />
        </div>
      );
    }
    if (status === 'rejected') {
      return (
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 border-2 border-red-500 flex items-center justify-center">
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
      );
    }
    if (status === 'available') {
      return (
        <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 border-2 border-[#7C3AED] flex items-center justify-center">
          <span className="text-[#7C3AED] font-bold text-sm">{config.step}</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  };

  const statusLabel = () => {
    if (status === 'approved') return <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Verified</span>;
    if (status === 'pending') return <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold">Under Review</span>;
    if (status === 'rejected') return <span className="text-red-600 dark:text-red-400 text-xs font-semibold">Rejected — Resubmit</span>;
    if (status === 'available') return <span className="text-[#7C3AED] text-xs font-semibold">Ready to Verify</span>;
    return <span className="text-muted-foreground text-xs font-medium">Locked</span>;
  };

  const borderHighlight =
    status === 'available'
      ? 'border-[#7C3AED]/40'
      : status === 'approved'
        ? 'border-green-500/30'
        : status === 'rejected'
          ? 'border-red-500/30'
          : 'border-border';

  return (
    <div className={`glass-card border rounded-xl overflow-hidden transition-all ${borderHighlight}`}>
      {/* Header row */}
      <button
        type="button"
        onClick={onExpand}
        disabled={status === 'locked'}
        className="w-full flex items-start gap-4 p-4 sm:p-5 text-left disabled:cursor-not-allowed group"
      >
        {statusIndicator()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-foreground font-semibold text-sm group-hover:text-[#7C3AED] transition-colors">{config.title}</h3>
            {statusLabel()}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">{config.subtitle}</p>
        </div>
        {status !== 'locked' && (
          <div className="mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        )}
      </button>

      {/* Available — Upload Form */}
      {isExpanded && status === 'available' && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-border pt-4">
          <p className="text-muted-foreground text-sm leading-relaxed">{config.description}</p>

          {/* Document type selector (Step 1 only) */}
          {config.step === 1 && (
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Document Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_DOC_TYPES.map((dt) => (
                  <button
                    key={dt.value}
                    type="button"
                    onClick={() => onDocTypeChange(dt.value)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all text-center $
                      ${
                        selectedDocType === dt.value
                          ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                          : 'border-border bg-card text-muted-foreground hover:border-[#7C3AED]/40 hover:text-foreground'
                      }`
                    }
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {config.documents.map((d) => (
              <FilePicker
                key={d.type}
                label={d.label}
                hint={d.hint}
                file={files[d.type]}
                onFile={(f) => setFile(d.type, f)}
              />
            ))}
          </div>

          {lastRejectionNote && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg px-4 py-3">
              <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">Previous submission rejected</p>
              <p className="text-red-500/80 dark:text-red-300/70 text-xs">{lastRejectionNote}</p>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground text-xs font-semibold mb-2 uppercase tracking-wide">Unlocks with this step</p>
            <ul className="space-y-1.5">
              {config.features.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            disabled={!allFilesReady || submitting}
            onClick={() =>
              onSubmit(
                config.documents.map((d) => ({ type: d.type, file: files[d.type]! })),
              )
            }
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Submit Step {config.step} Verification
              </>
            )}
          </button>
        </div>
      )}

      {/* Pending — Review Notice */}
      {isExpanded && status === 'pending' && (
        <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-4 py-3 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">Documents Under Review</p>
              <p className="text-amber-600/80 dark:text-amber-300/70 text-xs mt-0.5">
                Your submitted documents are being reviewed by our compliance team. This typically takes 1–2 business days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Approved — Success Notice */}
      {isExpanded && status === 'approved' && (
        <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-lg px-4 py-3 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-green-700 dark:text-green-400 text-sm font-medium">Step {config.step} Verified</p>
              <p className="text-green-600/80 dark:text-green-300/70 text-xs mt-0.5">
                This verification step has been completed. You may proceed to the next step if applicable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected — Resubmit Form */}
      {isExpanded && status === 'rejected' && (
        <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4 space-y-4">
          {lastRejectionNote && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg px-4 py-3">
              <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1">Rejection Reason</p>
              <p className="text-red-500/80 dark:text-red-300/70 text-xs">{lastRejectionNote}</p>
            </div>
          )}
          <p className="text-muted-foreground text-xs">Please address the issue above and resubmit your documents.</p>

          {config.step === 1 && (
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Document Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_DOC_TYPES.map((dt) => (
                  <button
                    key={dt.value}
                    type="button"
                    onClick={() => onDocTypeChange(dt.value)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all text-center $
                      ${
                        selectedDocType === dt.value
                          ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                          : 'border-border bg-card text-muted-foreground hover:border-[#7C3AED]/40 hover:text-foreground'
                      }`
                  }
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {config.documents.map((d) => (
              <FilePicker
                key={d.type}
                label={d.label}
                hint={d.hint}
                file={files[d.type]}
                onFile={(f) => setFile(d.type, f)}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={!allFilesReady || submitting}
            onClick={() =>
              onSubmit(
                config.documents.map((d) => ({ type: d.type, file: files[d.type]! })),
              )
            }
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resubmitting…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Resubmit Step {config.step}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── FAQ Accordion Item ──

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-[#7C3AED] transition-colors">{question}</span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{answer}</p>}
    </div>
  );
}

// ── Main KYC Page ──

function KycPageInner() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<string, any>[]>([]);
  const [verificationByStep, setVerificationByStep] = useState<Record<number, any>>({});
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('passport');

  // Verification code modal state
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeModalData, setCodeModalData] = useState<{
    docs: { type: DocumentCategory; file: File }[];
    targetStep: 1 | 2 | 3;
  } | null>(null);
  const [kycCode, setKycCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSending, setCodeSending] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const currentLevel = levelFromString(user?.kycLevel);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.kyc.status();
      const docs = Array.isArray(data?.documents) ? data.documents : [];
      setHistory(docs);

      const v = data?.verification;
      const byStep: Record<number, any> = {};
      if (v && v.level) {
        const lvl = levelFromString(v.level);
        if (lvl >= 1 && lvl <= 3) {
          byStep[lvl] = v;
        }
      }
      setVerificationByStep(byStep);

      const nextStep = currentLevel + 1;
      if (nextStep >= 1 && nextStep <= 3) {
        setExpandedStep(nextStep);
      } else if (currentLevel === 0) {
        setExpandedStep(1);
      } else {
        setExpandedStep(null);
      }
    } catch (e: any) {
      console.error('[KYC] refresh error:', e);
      setError(e.message || 'Failed to load verification status');
    } finally {
      setLoading(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const performSubmit = async (
    docs: { type: DocumentCategory; file: File }[],
    targetStep: 1 | 2 | 3,
    code?: string,
  ) => {
    // Upload each file to get a fileUrl
    const uploaded: { type: DocumentCategory; fileUrl: string }[] = [];
    for (const d of docs) {
      const fd = new FormData();
      fd.append('file', d.file);
      if (targetStep === 1) {
        fd.append('documentType', selectedDocType);
      }
      const up = await api.kyc.upload(fd);
      if (!up?.fileUrl) {
        throw new Error(up?.error?.message || `Failed to upload ${DOC_LABEL[d.type]}`);
      }
      uploaded.push({ type: d.type, fileUrl: up.fileUrl });
    }

    const payload: any = { level: targetStep, documents: uploaded, documentType: targetStep === 1 ? selectedDocType : undefined };
    if (targetStep === 1 && code) payload.verificationCode = code;
    await api.kyc.submit(payload);
    setSuccess(
      `Step ${targetStep} documents submitted successfully. Our compliance team will review your submission and notify you within 1–2 business days.`,
    );
    await refresh();
  };

  const handleSubmit = async (docs: { type: DocumentCategory; file: File }[]) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const docTypes = docs.map((d) => d.type);
      let targetStep: 1 | 2 | 3 = 1;
      if (docTypes.includes('proof_of_address')) targetStep = 3;
      else if (docTypes.includes('selfie')) targetStep = 2;
      else targetStep = 1;

      if (targetStep === 1) {
        setCodeModalData({ docs, targetStep });
        setCodeModalOpen(true);
        setKycCode('');
        setCodeError('');
        setSubmitting(false);
        return;
      }

      await performSubmit(docs, targetStep);
    } catch (e: any) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!codeModalData || !kycCode.trim()) return;
    setCodeSending(true);
    setCodeError('');
    setSubmitting(true);
    try {
      await performSubmit(codeModalData.docs, codeModalData.targetStep, kycCode.trim());
      setCodeModalOpen(false);
      setCodeModalData(null);
      setKycCode('');
    } catch (e: any) {
      setCodeError(e.message || 'Submission failed. Please verify your code and try again.');
    } finally {
      setCodeSending(false);
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await api.kyc.resendCode();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (e: any) {
      setCodeError(e.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeModalClose = () => {
    if (codeSending) return;
    setCodeModalOpen(false);
    setCodeModalData(null);
    setKycCode('');
    setCodeError('');
    setSubmitting(false);
  };

  const getStatus = (lvl: 1 | 2 | 3): 'locked' | 'available' | 'pending' | 'approved' | 'rejected' => {
    const v = verificationByStep[lvl];
    if (v?.status === 'approved') return 'approved';
    if (v?.status === 'pending') return 'pending';
    if (v?.status === 'rejected') return 'rejected';
    if (currentLevel + 1 === lvl) return 'available';
    if (lvl <= currentLevel) return 'approved';
    return 'locked';
  };

  // Profile info
  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'User';
  const initials = [firstName?.charAt(0), lastName?.charAt(0)].filter(Boolean).join('').toUpperCase() || 'U';
  const avatarUrl = user?.profile?.avatarUrl || null;
  const email = user?.email || '';
  const kycLevelStr = user?.kycLevel || 'LEVEL_0';
  const activeMode = user?.activeMode || 'demo';

  function verificationBadgeColor(level: string) {
    const l = (level || '').toLowerCase();
    if (l === 'level_3') return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/50';
    if (l === 'level_2') return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50';
    if (l === 'level_1') return 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30';
    return 'bg-muted text-muted-foreground border-border';
  }

  function verificationBadgeLabel(level: string) {
    const l = (level || '').toLowerCase();
    if (l === 'level_3') return 'Fully Verified';
    if (l === 'level_2') return 'Partially Verified';
    if (l === 'level_1') return 'Basic Verified';
    return 'Not Verified';
  }

  return (
    <div className="space-y-6">
      {/* User Identity Card */}
      <div className="glass-card border border-border rounded-xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-foreground font-bold text-base">{fullName}</h2>
            <span
              className={`
                ${activeMode === 'live' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/50' : 'bg-muted text-muted-foreground border-border'}
                text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize
              `}
            >
              {activeMode === 'live' ? 'Live Account' : 'Demo Account'}
            </span>
            <span
              className={`${verificationBadgeColor(kycLevelStr)} text-[10px] font-bold px-2.5 py-0.5 rounded-full border`}
            >
              {verificationBadgeLabel(kycLevelStr)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5 truncate">{email}</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="glass-card border border-border rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step, i) => {
            const isDone = currentLevel >= step;
            const isCurrent = currentLevel + 1 === step;
            const isLocked = currentLevel + 1 < step;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors $
                      ${
                        isDone
                          ? 'bg-green-100 dark:bg-green-950/30 border-green-500 text-green-600 dark:text-green-400'
                          : isCurrent
                            ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED]'
                            : 'bg-muted border-border text-muted-foreground'
                      }
                    `}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium $
                      ${isDone ? 'text-green-600 dark:text-green-400' : isCurrent ? 'text-[#7C3AED]' : 'text-muted-foreground'}`}
                  >
                    Step {step}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full ${isDone ? 'bg-green-500/50' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-border text-center">
          {currentLevel === 0 && <p className="text-muted-foreground text-xs">Begin with Step 1 to start your identity verification.</p>}
          {currentLevel === 1 && <p className="text-muted-foreground text-xs">Step 1 verified. Complete Step 2 to unlock higher transaction limits.</p>}
          {currentLevel === 2 && <p className="text-muted-foreground text-xs">Step 2 verified. Complete Step 3 to unlock full banking services.</p>}
          {currentLevel === 3 && (
            <p className="text-green-600 dark:text-green-400 text-xs font-semibold">
              All verification steps complete — full banking access granted.
            </p>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />{success}
        </div>
      )}

      {/* Verification Step Cards */}
      {loading ? (
        <div className="glass-card border border-border rounded-xl p-8 text-center space-y-3">
          <span className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin block mx-auto" />
          <p className="text-muted-foreground text-sm">Loading verification status…</p>
        </div>
      ) : (
        <div className="space-y-3">
          {VERIFICATION_STEPS.map((cfg) => (
            <StepCard
              key={cfg.step}
              config={cfg}
              status={getStatus(cfg.step)}
              isExpanded={expandedStep === cfg.step}
              onExpand={() => setExpandedStep(expandedStep === cfg.step ? null : cfg.step)}
              onSubmit={handleSubmit}
              submitting={submitting}
              lastRejectionNote={verificationByStep[cfg.step]?.notes || null}
              selectedDocType={selectedDocType}
              onDocTypeChange={setSelectedDocType}
            />
          ))}
        </div>
      )}

      {/* Submission History */}
      <div>
        <h3 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#7C3AED]" />
          Submission History
        </h3>
        <div className="glass-card border border-border rounded-xl overflow-hidden">
          {history.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-foreground text-sm font-medium">No submissions yet</p>
              <p className="text-muted-foreground text-xs mt-1">
                Your submitted documents will appear here once you begin the verification process.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-4 py-3">Document Type</th>
                    <th className="text-left text-muted-foreground font-medium px-4 py-3">Submitted</th>
                    <th className="text-right text-muted-foreground font-medium px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item: any) => (
                    <tr key={item.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="text-foreground px-4 py-3">{DOC_LABEL[item.type as DocumentCategory] || item.type}</td>
                      <td className="text-muted-foreground px-4 py-3">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-foreground font-semibold text-sm mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
          Frequently Asked Questions
        </h3>
        <div className="glass-card border border-border rounded-xl px-4 sm:px-5">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>

      {/* Verification Code Modal */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleCodeModalClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCodeModalClose}
              disabled={codeSending}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-[#7C3AED]" />
              </div>
            </div>

            <h3 className="text-foreground font-bold text-lg text-center mb-2">Verification Code Required</h3>
            <p className="text-muted-foreground text-sm text-center mb-6 leading-relaxed">
              Before submitting your identity documents, you must enter the verification code provided by your CoreWealth account manager.
            </p>

            <div className="bg-muted rounded-xl p-4 mb-5">
              <p className="text-[#7C3AED] text-xs font-bold uppercase tracking-wider mb-3">How to Obtain Your Code</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-medium">Email Support</p>
                    <p className="text-muted-foreground text-[11px]">Contact our support team to request a verification code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-medium">Live Chat</p>
                    <p className="text-muted-foreground text-[11px]">Use the chat widget to speak with a banking specialist directly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-foreground text-xs font-medium">Account Manager</p>
                    <p className="text-muted-foreground text-[11px]">Your dedicated account manager can provide the code during your onboarding call</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-foreground text-sm font-medium mb-1.5">Enter Verification Code</label>
              <input
                type="text"
                value={kycCode}
                onChange={(e) => { setKycCode(e.target.value); setCodeError(''); }}
                placeholder="Enter code provided by your account manager"
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all text-center tracking-widest font-mono"
                disabled={codeSending}
              />
            </div>

            {codeError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs rounded-lg px-3 py-2.5 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />{codeError}
              </div>
            )}

            <button
              onClick={handleCodeSubmit}
              disabled={!kycCode.trim() || codeSending}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {codeSending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting with code…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Submit with Verification Code
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="w-full mt-3 text-muted-foreground hover:text-[#7C3AED] text-xs font-medium py-2 transition-colors border border-border rounded-lg hover:border-[#7C3AED]/40"
            >
              {resendLoading
                ? 'Sending…'
                : resendSuccess
                  ? '✓ Code resent to your registered email!'
                  : "Didn't receive a code? Resend to email"}
            </button>

            <button
              onClick={handleCodeModalClose}
              disabled={codeSending}
              className="w-full mt-2 text-muted-foreground hover:text-foreground text-xs py-2 transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}

export default function KycPage() {
  return (
    <KycErrorBoundary>
      <KycPageInner />
    </KycErrorBoundary>
  );
}
