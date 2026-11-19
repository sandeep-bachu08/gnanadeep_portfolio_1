import React from 'react';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';
import { Portrait3DCard } from '../components/Portrait3DCard';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const profileAttributes = [
    { label: 'Name', value: PORTFOLIO_DATA.name },
    { label: 'Education', value: PORTFOLIO_DATA.degreeShort },
    { label: 'University', value: PORTFOLIO_DATA.university },
    { label: 'Academic Status', value: PORTFOLIO_DATA.academicStatus },
    { label: 'Professional Status', value: PORTFOLIO_DATA.status },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
      {/* Page Header */}
      <div className="pb-10 border-b border-[#E8D9B9]">
        <div className="flex items-center gap-2 font-mono text-xs text-[#B39458]">
          <span>01. About</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#777777]">Personal &amp; Academic Profile</span>
        </div>
        <h1
          className="mt-3 font-display font-bold text-[#252525] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          {PORTFOLIO_DATA.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-[#777777]">
          {PORTFOLIO_DATA.status} <span aria-hidden="true">·</span> {PORTFOLIO_DATA.academicStatus} <span aria-hidden="true">·</span> {PORTFOLIO_DATA.university}
        </p>
      </div>

      {/* Main Content Split */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Natural Introduction & Specification Ledger */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#252525]">
              Introduction
            </h2>
            <p className="text-base text-[#777777] leading-relaxed max-w-[68ch]">
              {PORTFOLIO_DATA.aboutIntroduction}
            </p>
            <p className="text-base text-[#777777] leading-relaxed max-w-[68ch]">
              {PORTFOLIO_DATA.aboutSecondary}
            </p>
          </div>

          {/* Core Profile Specification Table */}
          <div className="rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] overflow-hidden shadow-[0_8px_30px_rgba(37,37,37,0.03)]">
            <div className="px-6 py-4 border-b border-[#E8D9B9] bg-[#F8F6F1] flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-[#252525]">
                Profile Details
              </h3>
              <span className="font-mono text-xs text-[#B39458]">Verified Information</span>
            </div>
            <dl className="divide-y divide-[#E8D9B9]">
              {profileAttributes.map((attr) => (
                <div
                  key={attr.label}
                  className="px-6 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline"
                >
                  <dt className="sm:col-span-5 font-mono text-xs text-[#777777]">
                    {attr.label}
                  </dt>
                  <dd className="sm:col-span-7 text-sm font-medium text-[#252525]">
                    {attr.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Spoken Languages Section */}
          <div className="rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] overflow-hidden shadow-[0_8px_30px_rgba(37,37,37,0.03)]">
            <div className="px-6 py-4 border-b border-[#E8D9B9] bg-[#F8F6F1] flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-[#252525]">
                Languages
              </h3>
              <span className="font-mono text-xs text-[#777777]">Communication Proficiency</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8D9B9]">
              {PORTFOLIO_DATA.languages.map((item) => (
                <div key={item.language} className="p-6">
                  <p className="font-display text-base font-semibold text-[#252525]">
                    {item.language}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#B39458] font-medium">
                    {item.proficiency}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation & Social Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('education')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>View Education Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('skills')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] hover:bg-[#F8F6F1] hover:border-[#B39458] text-[#252525] font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Explore Technical Skills</span>
            </button>
            <a
              href={PORTFOLIO_DATA.contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] font-mono text-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Github className="w-3.5 h-3.5 text-[#B39458]" />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_DATA.contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E8D9B9] bg-[#F8F6F1] hover:border-[#B39458] text-[#252525] hover:text-[#B39458] font-mono text-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#B39458]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right Column: Profile Photograph */}
        <div className="lg:col-span-5">
          <Portrait3DCard compact />
        </div>
      </div>
    </div>
  );
};
