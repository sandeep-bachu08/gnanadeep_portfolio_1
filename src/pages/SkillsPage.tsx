import React from 'react';
import { ArrowRight, Code2, Database, GitBranch } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';

interface SkillsPageProps {
  onNavigate: (page: PageId) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ onNavigate }) => {
  const getSkillIcon = (id: string) => {
    switch (id) {
      case 'python':
        return <Code2 className="w-5 h-5 text-[#B39458]" />;
      case 'sql':
        return <Database className="w-5 h-5 text-[#B39458]" />;
      default:
        return <GitBranch className="w-5 h-5 text-[#B39458]" />;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
      {/* Page Header */}
      <div className="pb-10 border-b border-[#E8D9B9]">
        <div className="flex items-center gap-2 font-mono text-xs text-[#B39458]">
          <span>03. Skills</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#777777]">Technical Stack &amp; Languages</span>
        </div>
        <h1
          className="mt-3 font-display font-bold text-[#252525] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          Technical Skills
        </h1>
        <p className="mt-2 text-sm text-[#777777] max-w-2xl">
          Core programming, relational querying, and algorithmic problem-solving disciplines studied
          in the B.Tech Artificial Intelligence and Machine Learning program.
        </p>
      </div>

      {/* Elegant White Skill Cards with Subtle Gold Borders & Simple Technical Icons */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {PORTFOLIO_DATA.skills.map((skill, index) => (
          <div
            key={skill.id}
            className="text-left p-7 rounded-2xl border border-[#E8D9B9] hover:border-[#B39458] bg-[#FFFFFF] transition-colors duration-150 flex flex-col justify-between shadow-[0_8px_30px_rgba(37,37,37,0.03)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#777777] tabular-nums">
                  0{index + 1}. Technical Skill
                </span>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#E8D9B9] bg-[#F8F6F1]">
                  {getSkillIcon(skill.id)}
                </div>
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold text-[#252525] tracking-tight">
                {skill.name}
              </h2>

              <p className="mt-3 text-sm text-[#777777] leading-relaxed">
                {skill.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Spoken Languages Section */}
      <div className="mt-16 pt-12 border-t border-[#E8D9B9]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs text-[#B39458]">04. Languages</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#252525] tracking-tight">
              Spoken Languages
            </h2>
          </div>
          <p className="text-sm text-[#777777]">
            Communication capabilities across native, professional, and conversational contexts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.languages.map((lang, idx) => (
            <div
              key={lang.language}
              className="p-6 rounded-2xl border border-[#E8D9B9] bg-[#F8F6F1] flex items-center justify-between"
            >
              <div>
                <p className="font-mono text-xs text-[#777777] tabular-nums">
                  Language 0{idx + 1}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-[#252525]">
                  {lang.language}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#B39458] font-medium">
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Action */}
      <div className="mt-12 pt-8 border-t border-[#E8D9B9] flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#777777]">
          Next Section: Contact Details &amp; Social Profiles
        </p>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Contact {PORTFOLIO_DATA.shortName}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
