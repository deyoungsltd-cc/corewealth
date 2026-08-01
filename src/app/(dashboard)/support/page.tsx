'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  Send,
  HelpCircle,
  ShieldCheck,
  Clock,
  UserCheck,
  Landmark,
  DollarSign,
  Receipt,
  CreditCard,
} from 'lucide-react';

const faqItems = [
  {
    icon: Landmark,
    question: 'How do I make a deposit?',
    answer:
      'You can make a deposit via bank transfer, wire transfer, or ACH. Navigate to the Transfers section in your dashboard, select Deposit, choose your funding method, and follow the on-screen instructions. ACH deposits typically arrive within 1-2 business days, while wire transfers are usually available the same day.',
  },
  {
    icon: Clock,
    question: 'How long do transfers take?',
    answer:
      'Transfer times vary by method. ACH transfers take 1-3 business days, domestic wire transfers are processed the same business day if submitted before 5:00 PM ET, and international wire transfers take 2-5 business days depending on the destination country and receiving bank.',
  },
  {
    icon: DollarSign,
    question: 'What are the savings account interest rates?',
    answer:
      'CoreWealth offers competitive rates across all savings tiers. Our High-Yield Savings account currently earns 4.50% APY for balances under $50,000, 4.75% APY for balances between $50,000 and $250,000, and 5.00% APY for balances above $250,000. Rates are variable and may change at any time.',
  },
  {
    icon: UserCheck,
    question: 'How do I complete identity verification?',
    answer:
      "To verify your identity, go to Settings then Identity Verification in your dashboard. You will need to provide a valid government-issued photo ID (driver's license or passport) and proof of address (utility bill or bank statement dated within the last 60 days). Verification is typically completed within 24 hours.",
  },
  {
    icon: CreditCard,
    question: 'How do I set up direct deposit?',
    answer:
      "Setting up direct deposit is easy. Go to the Transfers section and select Direct Deposit. You'll find your unique routing and account numbers there. Provide these details to your employer's payroll department. Direct deposits usually begin within 1-2 pay cycles after enrollment.",
  },
  {
    icon: ShieldCheck,
    question: 'Is my money FDIC insured?',
    answer:
      'Yes. All deposits at CoreWealth Bank are insured by the Federal Deposit Insurance Corporation (FDIC) up to $250,000 per depositor, per insured bank, for each account ownership category. This coverage includes checking, savings, money market, and CD accounts.',
  },
  {
    icon: MessageCircle,
    question: 'How do I contact customer support?',
    answer:
      'You can reach our support team through multiple channels: by phone at 1-800-555-WEALTH (available 24/7), via email at support@corewealth.com, or through the live chat feature on our website and mobile app. Our average response time is under 2 minutes for live chat and 4 hours for email.',
  },
  {
    icon: Receipt,
    question: 'What are the wire transfer fees?',
    answer:
      'CoreWealth charges competitive wire transfer fees. Domestic outgoing wires are $15 per transaction, incoming domestic wires are free. International outgoing wires are $35 per transaction, and incoming international wires are $10. Premium account holders receive discounted or waived wire fees — check your account tier for details.',
  },
];

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone Support',
    detail: '1-800-555-WEALTH',
    description: 'Available 24/7, including holidays',
  },
  {
    icon: Mail,
    title: 'Email Support',
    detail: 'support@corewealth.com',
    description: 'Response within 4 business hours',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    detail: 'Chat with us now',
    description: 'Average wait time under 2 minutes',
  },
];

export default function SupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setLoading(true);
    setSuccess('');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setSuccess(
          'Your support ticket has been submitted successfully. A member of our team will respond within 24 hours.'
        );
        setSubject('');
        setMessage('');
      }
    } catch {
      /* handled silently */
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <HelpCircle className="w-6 h-6 text-[#7C3AED]" />
          <h2 className="text-foreground font-bold text-xl">Help and Support</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Find answers to common questions, submit a support ticket, or get in touch with our team.
        </p>
      </div>

      {/* Contact Methods */}
      <section aria-label="Contact methods">
        <h3 className="text-foreground font-semibold text-base mb-4">Get In Touch</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="glass-card rounded-xl p-5 flex flex-col items-center text-center gap-3 cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{method.title}</p>
                  <p className="text-[#7C3AED] font-medium text-sm mt-0.5">{method.detail}</p>
                  <p className="text-muted-foreground text-xs mt-1">{method.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support Ticket Form */}
      <section aria-label="Submit a support ticket">
        <h3 className="text-foreground font-semibold text-base mb-4">Submit a Support Ticket</h3>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label htmlFor="ticket-subject" className="block text-foreground text-sm font-medium mb-1.5">
              Subject
            </label>
            <input
              id="ticket-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="ticket-message" className="block text-foreground text-sm font-medium mb-1.5">
              Message
            </label>
            <textarea
              id="ticket-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail so we can assist you as quickly as possible..."
              rows={5}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors resize-none"
            />
          </div>
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg px-4 py-3">
              {success}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !subject.trim() || !message.trim()}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section aria-label="Frequently asked questions">
        <h3 className="text-foreground font-semibold text-base mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqItems.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openFaq === index;
            return (
              <div key={index} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center gap-3 w-full px-5 py-4 text-left cursor-pointer transition-colors hover:bg-[#7C3AED]/5"
                  aria-expanded={isOpen}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <span className="text-foreground text-sm font-medium flex-1">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pl-[4.25rem]">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
