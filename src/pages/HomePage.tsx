import React, { useState } from 'react';
import { ArrowRight, FileText, Github, Linkedin, Mail, Phone, X } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';
import { SpatialCanvas, GeometryMode } from '../components/SpatialCanvas';
import { Portrait3DCard } from '../components/Portrait3DCard';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [geometryMode, setGeometryMode] = useState<GeometryMode>('polyhedron');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* Light-Themed Hero Section with Subtle Champagne-Gold Accents */}
      <section className="relative overflow-hidden border-b border-[#E8D9B9] bg-[#FFFFFF] bg-architectural-grid">
        {/* Subtle Warm Gold Abstract Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 w-[460px] h-[460px] rounded-full bg-[#E8D9B9]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-10 w-[340px] h-[340px] rounded-full bg-[#F8F6F1] blur-2xl"
        />

        {/* Interactive Minimal 3D-Inspired Decorative Canvas */}
        <div className="absolute inset-0 z-0">
          <SpatialCanvas mode={geometryMode} interactive={true} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-12 pb-16 lg:py-20">
          {/* Split-Screen Hero Grid: Introduction on Left, Portrait on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
            {/* Left Column: Typographic Hierarchy & Prominent Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div>
                {/* Clean unboxed technical label kicker */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#B39458] tracking-wide">
                  <span>B.Tech Artificial Intelligence &amp; Machine Learning</span>
                  <span aria-hidden="true" className="text-[#E8D9B9]">·</span>
                  <span className="text-[#777777]">Jain University, Bangalore (2025–2029)</span>
                </div>

                {/* Main Heading */}
                <h1
                  className="mt-5 font-display font-bold text-[#252525] tracking-tight leading-[1.08]"
                  style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)' }}
                >
                  {PORTFOLIO_DATA.heroGreeting}
                </h1>

                {/* Tagline */}
                <p
                  className="mt-3 font-display font-medium text-[#B39458] tracking-tight leading-[1.2]"
                  style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2rem)' }}
                >
                  {PORTFOLIO_DATA.heroTagline}
                </p>

                {/* Supporting Introduction */}
                <p className="mt-6 text-base sm:text-lg text-[#777777] leading-relaxed max-w-[60ch]">
                  {PORTFOLIO_DATA.heroSupportingIntro}
                </p>

                {/* Two Prominent Buttons: Contact Me & View Resume */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-[0_6px_20px_rgba(179,148,88,0.22)]"
                  >
                    <span>Contact Me</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#B39458] bg-[#FFFFFF] hover:bg-[#F8F6F1] text-[#252525] font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <FileText className="w-4 h-4 text-[#B39458]" />
                    <span>View Resume</span>
                  </button>

                  {/* Social Profile Quick Links */}
                  <div className="flex items-center gap-2.5 pl-1">
                    <a
                      href={PORTFOLIO_DATA.contact.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Repositories"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={PORTFOLIO_DATA.contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Interactive 3D Spatial Geometry Mode Selector */}
              <div className="mt-12 pt-6 border-t border-[#E8D9B9] flex flex-wrap items-center justify-between gap-4">
                <div className="font-mono text-xs text-[#777777]">
                  <span className="text-[#252525] font-medium">3D Spatial Elements</span>
                  <span aria-hidden="true" className="mx-2 text-[#E8D9B9]">·</span>
                  <span>Move cursor to tilt perspective</span>
                </div>

                <div
                  role="group"
                  aria-label="Select 3D background geometry"
                  className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#F8F6F1] border border-[#E8D9B9]"
                >
                  {(
                    [
                      { id: 'polyhedron', label: 'Polyhedron' },
                      { id: 'lattice', label: 'Tensor Grid' },
                      { id: 'orbital', label: 'Orbital' },
                    ] as { id: GeometryMode; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGeometryMode(item.id)}
                      className={`px-3 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        geometryMode === item.id
                          ? 'bg-[#B39458] text-white font-medium'
                          : 'text-[#777777] hover:text-[#252525]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Profile Portrait with Gold Detailing */}
            <div className="lg:col-span-5 flex items-stretch">
              <Portrait3DCard />
            </div>
          </div>

          {/* Full-Width Key Academic & Technical Summary Row Below Hero Split */}
          <div className="mt-14 pt-8 border-t border-[#E8D9B9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-mono text-xs text-[#777777]">Degree &amp; Specialization</p>
              <p className="mt-1.5 font-display text-base font-semibold text-[#252525]">
                B.Tech — AI &amp; ML
              </p>
              <p className="mt-0.5 text-xs text-[#777777]">Artificial Intelligence &amp; Machine Learning</p>
            </div>

            <div>
              <p className="font-mono text-xs text-[#777777]">Institution &amp; Batch</p>
              <p className="mt-1.5 font-display text-base font-semibold text-[#252525]">
                Jain University, Bangalore
              </p>
              <p className="mt-0.5 text-xs text-[#777777] tabular-nums">
                2025–2029 · Second Year – Semester 3
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-[#777777]">Technical Stack</p>
              <p className="mt-1.5 font-display text-base font-semibold text-[#252525]">
                Python <span aria-hidden="true" className="text-[#B39458]">·</span> SQL <span aria-hidden="true" className="text-[#B39458]">·</span> Data Structures
              </p>
              <p className="mt-0.5 text-xs text-[#777777]">Core programming &amp; problem-solving</p>
            </div>

            <div>
              <p className="font-mono text-xs text-[#777777]">Spoken Languages</p>
              <p className="mt-1.5 font-display text-base font-semibold text-[#252525]">
                Telugu <span aria-hidden="true" className="text-[#B39458]">·</span> English <span aria-hidden="true" className="text-[#B39458]">·</span> Tamil
              </p>
              <p className="mt-0.5 text-xs text-[#777777]">Native · Professional · Conversational</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternate Section on Warm Ivory (#F8F6F1) */}
      <section className="bg-[#F8F6F1] py-20 border-b border-[#E8D9B9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E8D9B9]">
            <div>
              <p className="font-mono text-xs text-[#B39458]">Portfolio Directory</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#252525] tracking-tight">
                Academic &amp; Technical Overview
              </h2>
            </div>
            <p className="text-sm text-[#777777] max-w-md">
              Explore {PORTFOLIO_DATA.name}&apos;s background, academic progression, core technical
              skills, and verified contact channels.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 01: About */}
            <div
              onClick={() => onNavigate('about')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('about');
                }
              }}
              className="group p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#777777]">
                  <span>01. About</span>
                  <span className="text-[#B39458] font-medium group-hover:translate-x-1 transition-transform">
                    View Profile →
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#252525]">
                  Personal &amp; Academic Profile
                </h3>
                <p className="mt-2.5 text-sm text-[#777777] leading-relaxed">
                  Fresher pursuing B.Tech in Artificial Intelligence and Machine Learning at Jain
                  University, Bangalore (Second Year – Semester 3).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8D9B9] flex items-center gap-2 font-mono text-xs text-[#777777]">
                <span className="text-[#252525] font-medium">Status: {PORTFOLIO_DATA.status}</span>
                <span aria-hidden="true">·</span>
                <span>{PORTFOLIO_DATA.academicStatus}</span>
              </div>
            </div>

            {/* Card 02: Education */}
            <div
              onClick={() => onNavigate('education')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('education');
                }
              }}
              className="group p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#777777]">
                  <span>02. Education</span>
                  <span className="text-[#B39458] font-medium group-hover:translate-x-1 transition-transform">
                    View Timeline →
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#252525]">
                  Academic Timeline (2025–2029)
                </h3>
                <p className="mt-2.5 text-sm text-[#777777] leading-relaxed">
                  B.Tech AIML at Jain University, Bangalore, preceded by Intermediate at Sri
                  Chaitanya Junior College and 10th Standard at Keshava Reddy EM School.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8D9B9] flex items-center gap-2 font-mono text-xs text-[#777777] tabular-nums">
                <span className="text-[#252525] font-medium">Sem 1 SGPA: 6.75</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#252525] font-medium">Sem 2 SGPA: 6.60</span>
              </div>
            </div>

            {/* Card 03: Skills */}
            <div
              onClick={() => onNavigate('skills')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('skills');
                }
              }}
              className="group p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#777777]">
                  <span>03. Technical Skills</span>
                  <span className="text-[#B39458] font-medium group-hover:translate-x-1 transition-transform">
                    View Skills →
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#252525]">
                  Core Technical Stack &amp; Languages
                </h3>
                <p className="mt-2.5 text-sm text-[#777777] leading-relaxed">
                  Foundational capabilities in Python, SQL, and Data Structures, alongside
                  communication in Telugu, English, and Tamil.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8D9B9] flex items-center gap-2 font-mono text-xs text-[#252525] font-medium">
                <span>Python</span>
                <span aria-hidden="true" className="text-[#B39458]">·</span>
                <span>SQL</span>
                <span aria-hidden="true" className="text-[#B39458]">·</span>
                <span>Data Structures</span>
              </div>
            </div>

            {/* Card 04: Contact & Socials */}
            <div
              onClick={() => onNavigate('contact')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('contact');
                }
              }}
              className="group p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#777777]">
                  <span>04. Contact &amp; Profiles</span>
                  <span className="text-[#B39458] font-medium group-hover:translate-x-1 transition-transform">
                    Open Contact →
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#252525]">
                  Direct Communication &amp; Social Links
                </h3>
                <p className="mt-2.5 text-sm text-[#777777] leading-relaxed">
                  Connect directly via email, phone, GitHub repositories, or LinkedIn.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8D9B9] flex flex-wrap items-center gap-4 font-mono text-xs text-[#252525]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#B39458]" />
                  {PORTFOLIO_DATA.contact.email}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#B39458]" />
                  {PORTFOLIO_DATA.contact.phoneDisplay}
                </span>
              </div>
            </div>

            {/* Card 05: Python, FastAPI & SQLite Backend */}
            <div
              onClick={() => onNavigate('python')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('python');
                }
              }}
              className="group md:col-span-2 p-7 rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] hover:border-[#B39458] shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#777777]">
                  <span>05. Python Backend</span>
                  <span aria-hidden="true" className="text-[#E8D9B9]">·</span>
                  <span className="text-[#B39458] font-medium">FastAPI &amp; SQLite</span>
                </div>
                <h3 className="mt-2.5 font-display text-xl font-semibold text-[#252525]">
                  Interactive Python, FastAPI &amp; SQLite Workbench
                </h3>
                <p className="mt-2 text-sm text-[#777777] leading-relaxed max-w-2xl">
                  Execute live server-side Python data structure algorithms, run read-only SQLite
                  queries against the portfolio database, and calculate SGPA / CGPA projections.
                </p>
              </div>
              <span className="font-mono text-xs text-[#B39458] font-medium group-hover:translate-x-1 transition-transform whitespace-nowrap shrink-0">
                Open Python Lab →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* View Resume Status Modal (Honest handling until a PDF file is supplied) */}
      {resumeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#252525]/50 backdrop-blur-xs p-4"
          onClick={() => setResumeModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Resume availability notice"
        >
          <div
            className="max-w-md w-full rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] p-7 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8D9B9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B39458]" />
                <h3 className="font-display text-base font-bold text-[#252525]">
                  Resume Document
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResumeModalOpen(false)}
                className="p-1 rounded-lg text-[#777777] hover:text-[#252525] cursor-pointer"
                aria-label="Close resume notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-[#777777] leading-relaxed">
              The downloadable PDF resume for <strong className="text-[#252525] font-medium">{PORTFOLIO_DATA.name}</strong> will be linked here once the final document file is uploaded.
            </p>
            <p className="mt-2 text-sm text-[#777777] leading-relaxed">
              In the meantime, you can review his complete academic record and technical skills directly on this portfolio or request a copy via email.
            </p>

            <div className="mt-6 pt-4 border-t border-[#E8D9B9] flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setResumeModalOpen(false);
                  onNavigate('education');
                }}
                className="px-4 py-2 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-xs font-medium text-[#252525] transition-colors cursor-pointer"
              >
                View Academic Record
              </button>
              <a
                href={`${PORTFOLIO_DATA.contact.emailHref}?subject=${encodeURIComponent(
                  'Resume Request — A. Gnanadeep Sai'
                )}`}
                className="px-4 py-2 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-xs font-medium text-white transition-colors"
              >
                Request via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
