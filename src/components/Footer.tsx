import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';

interface FooterProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ activePage, onNavigate }) => {
  const pages: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'python', label: 'Python' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-[#E8D9B9] bg-[#F8F6F1]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E8D9B9]">
          {/* Identity & Social Profiles column */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-lg font-bold text-[#252525] hover:text-[#B39458] transition-colors cursor-pointer text-left"
            >
              {PORTFOLIO_DATA.name}
            </button>
            <p className="mt-2 text-sm text-[#777777] max-w-sm leading-relaxed">
              {PORTFOLIO_DATA.degreeShort} <span aria-hidden="true">·</span> {PORTFOLIO_DATA.university}
            </p>

            {/* Clickable Social Icons in Footer */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href={PORTFOLIO_DATA.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile of A. Gnanadeep Sai"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] hover:text-[#B39458] hover:border-[#B39458] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile of A. Gnanadeep Sai"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] hover:text-[#B39458] hover:border-[#B39458] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.contact.emailHref}
                aria-label="Email A. Gnanadeep Sai"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] hover:text-[#B39458] hover:border-[#B39458] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.contact.phoneHref}
                aria-label="Call A. Gnanadeep Sai"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] hover:text-[#B39458] hover:border-[#B39458] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div className="md:col-span-4">
            <p className="font-mono text-xs text-[#777777] mb-3">Navigation</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onNavigate(p.id)}
                  className={`transition-colors cursor-pointer whitespace-nowrap ${
                    activePage === p.id
                      ? 'text-[#B39458] font-semibold'
                      : 'text-[#777777] hover:text-[#252525]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direct contact links */}
          <div className="md:col-span-3">
            <p className="font-mono text-xs text-[#777777] mb-3">Direct Contact</p>
            <div className="flex flex-col space-y-1.5 text-sm font-mono">
              <a
                href={PORTFOLIO_DATA.contact.emailHref}
                className="text-[#252525] hover:text-[#B39458] transition-colors truncate"
              >
                {PORTFOLIO_DATA.contact.email}
              </a>
              <a
                href={PORTFOLIO_DATA.contact.phoneHref}
                className="text-[#777777] hover:text-[#252525] transition-colors tabular-nums"
              >
                {PORTFOLIO_DATA.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#777777]">
          <p>© {new Date().getFullYear()} {PORTFOLIO_DATA.name}. All rights reserved.</p>
          <p className="font-mono">
            {PORTFOLIO_DATA.status} <span aria-hidden="true">·</span> B.Tech AIML (2025–2029)
          </p>
        </div>
      </div>
    </footer>
  );
};
