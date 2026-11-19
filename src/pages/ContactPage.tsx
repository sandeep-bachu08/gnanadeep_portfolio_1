import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Database,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  Send,
  Trash2,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import {
  ContactMessage,
  deleteContactMessage,
  fetchContactMessages,
  submitContactMessage,
} from '../services/api';

export const ContactPage: React.FC = () => {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [savedMessages, setSavedMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const items = await fetchContactMessages();
      setSavedMessages(items);
    } catch {
      // Non-blocking if backend is booting
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleCopy = async (value: string, field: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const created = await submitContactMessage({
        sender_name: senderName.trim(),
        sender_email: senderEmail.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSavedMessages((prev) => [created, ...prev]);
      setSenderName('');
      setSenderEmail('');
      setSubject('');
      setMessage('');
      setSubmitSuccess('Message saved to SQLite database via FastAPI.');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to save message. Please check all fields.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await deleteContactMessage(id);
      setSavedMessages((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
      {/* Page Header */}
      <div className="pb-10 border-b border-[#E8D9B9]">
        <div className="flex items-center gap-2 font-mono text-xs text-[#B39458]">
          <span>04. Contact</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#777777]">Direct Communication &amp; Social Profiles</span>
        </div>
        <h1
          className="mt-3 font-display font-bold text-[#252525] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          Contact Me
        </h1>
        <p className="mt-2 text-sm text-[#777777] max-w-xl">
          Reach out directly to {PORTFOLIO_DATA.name} via email, telephone, GitHub, LinkedIn, or
          submit an inquiry stored in the Python FastAPI + SQLite backend.
        </p>
      </div>

      {/* Main Contact Grid */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Email, Phone, GitHub & LinkedIn Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-7 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#777777]">01. Electronic Mail</span>
              <Mail className="w-5 h-5 text-[#B39458]" />
            </div>

            <div>
              <p className="text-xs font-mono text-[#777777]">Email Address</p>
              <a
                href={PORTFOLIO_DATA.contact.emailHref}
                className="mt-1.5 block font-mono text-base sm:text-lg font-semibold text-[#252525] hover:text-[#B39458] transition-colors break-all"
              >
                {PORTFOLIO_DATA.contact.email}
              </a>
            </div>

            <div className="pt-4 border-t border-[#E8D9B9] flex flex-wrap items-center gap-3">
              <a
                href={PORTFOLIO_DATA.contact.emailHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopy(PORTFOLIO_DATA.contact.email, 'email')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] font-mono text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#B39458]" />
                    <span className="text-[#B39458] font-medium">Copied Email</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B39458]" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-7 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#777777]">02. Direct Telephone</span>
              <Phone className="w-5 h-5 text-[#B39458]" />
            </div>

            <div>
              <p className="text-xs font-mono text-[#777777]">Phone Number</p>
              <a
                href={PORTFOLIO_DATA.contact.phoneHref}
                className="mt-1.5 block font-mono text-lg sm:text-xl font-semibold text-[#252525] hover:text-[#B39458] transition-colors tabular-nums"
              >
                {PORTFOLIO_DATA.contact.phoneDisplay}
              </a>
            </div>

            <div className="pt-4 border-t border-[#E8D9B9] flex flex-wrap items-center gap-3">
              <a
                href={PORTFOLIO_DATA.contact.phoneHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Phone</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopy(PORTFOLIO_DATA.contact.phoneDisplay, 'phone')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] font-mono text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedField === 'phone' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#B39458]" />
                    <span className="text-[#B39458] font-medium">Copied Number</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B39458]" />
                    <span>Copy Number</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(37,37,37,0.03)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#777777]">03. Social Profiles</span>
              <span className="font-mono text-xs text-[#B39458]">Verified Links</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={PORTFOLIO_DATA.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] group-hover:text-[#B39458] shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-[#252525] group-hover:text-[#B39458] transition-colors">
                      GitHub
                    </p>
                    <p className="font-mono text-[11px] text-[#777777] truncate">
                      Repositories
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#777777] group-hover:text-[#B39458] shrink-0" />
              </a>

              <a
                href={PORTFOLIO_DATA.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] group-hover:text-[#B39458] shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-[#252525] group-hover:text-[#B39458] transition-colors">
                      LinkedIn
                    </p>
                    <p className="font-mono text-[11px] text-[#777777] truncate">
                      Professional Profile
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#777777] group-hover:text-[#B39458] shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: FastAPI + SQLite Contact Inquiry Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-7 sm:p-8 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_30px_rgba(37,37,37,0.03)]">
            <div className="pb-5 border-b border-[#E8D9B9] flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#252525]">
                  Send an Inquiry
                </h2>
                <p className="mt-1 text-xs text-[#777777]">
                  Submitted directly to the Python FastAPI backend and persisted in SQLite.
                </p>
              </div>
              <Database className="w-5 h-5 text-[#B39458] shrink-0" />
            </div>

            <form onSubmit={handleSubmitInquiry} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="sender-name"
                    className="block font-mono text-xs text-[#252525] font-medium mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="sender-name"
                    type="text"
                    required
                    minLength={2}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Recruiter / Hiring Team"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] text-sm text-[#252525] placeholder:text-[#777777]/70 focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sender-email"
                    className="block font-mono text-xs text-[#252525] font-medium mb-1.5"
                  >
                    Your Email
                  </label>
                  <input
                    id="sender-email"
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] text-sm text-[#252525] placeholder:text-[#777777]/70 focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiry-subject"
                  className="block font-mono text-xs text-[#252525] font-medium mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="inquiry-subject"
                  type="text"
                  required
                  minLength={2}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Internship / Entry-Level Role Inquiry"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] text-sm text-[#252525] placeholder:text-[#777777]/70 focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-message"
                  className="block font-mono text-xs text-[#252525] font-medium mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="inquiry-message"
                  rows={4}
                  required
                  minLength={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hello ${PORTFOLIO_DATA.shortName}, I would like to connect regarding...`}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] text-sm text-[#252525] placeholder:text-[#777777]/70 focus:outline-none focus:border-[#B39458] focus:bg-[#FFFFFF] transition-colors resize-y"
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {submitError}
                </p>
              )}

              {submitSuccess && (
                <p className="text-xs text-[#252525] bg-[#F8F6F1] border border-[#B39458] rounded-lg px-3.5 py-2.5 font-mono">
                  {submitSuccess}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] disabled:opacity-60 text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Saving to SQLite...' : 'Submit Inquiry'}</span>
                </button>

                <a
                  href={PORTFOLIO_DATA.contact.emailHref}
                  className="font-mono text-xs text-[#777777] hover:text-[#B39458] transition-colors"
                >
                  Or open email client →
                </a>
              </div>
            </form>
          </div>

          <div className="p-7 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D9B9]">
              <h3 className="font-display text-sm font-semibold text-[#252525]">
                Stored Inquiries (SQLite)
              </h3>
              <span className="font-mono text-xs text-[#777777] tabular-nums">
                {loadingMessages ? 'Loading...' : `${savedMessages.length} saved`}
              </span>
            </div>

            {savedMessages.length === 0 ? (
              <p className="text-xs text-[#777777] leading-relaxed">
                No inquiries stored yet. Messages submitted through the form above are saved in{' '}
                <span className="font-mono text-[#252525]">backend/portfolio.db</span>.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {savedMessages.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF] space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-[#252525] truncate">
                          {item.subject}
                        </p>
                        <p className="font-mono text-[11px] text-[#777777] truncate">
                          {item.sender_name} · {item.sender_email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(item.id)}
                        aria-label={`Delete message ${item.subject}`}
                        className="p-1.5 rounded-lg text-[#777777] hover:text-[#252525] hover:bg-[#F8F6F1] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#777777] leading-relaxed">{item.message}</p>
                    <p className="font-mono text-[10px] text-[#B39458] tabular-nums">
                      Saved UTC: {item.created_at}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
