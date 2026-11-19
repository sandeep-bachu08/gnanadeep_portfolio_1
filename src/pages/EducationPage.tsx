import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';

interface EducationPageProps {
  onNavigate: (page: PageId) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({ onNavigate }) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredEducation =
    selectedStage === 'all'
      ? PORTFOLIO_DATA.education
      : PORTFOLIO_DATA.education.filter((item) => item.id === selectedStage);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
      {/* Page Header */}
      <div className="pb-10 border-b border-[#E8D9B9] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#B39458]">
            <span>02. Education</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#777777]">Academic Timeline</span>
          </div>
          <h1
            className="mt-3 font-display font-bold text-[#252525] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            Education Timeline
          </h1>
          <p className="mt-2 text-sm text-[#777777] max-w-xl">
            Structured record of undergraduate studies in Artificial Intelligence and Machine
            Learning (2025–2029), Intermediate, and 10th Standard education.
          </p>
        </div>

        {/* Interactive Stage Filter Control */}
        <div
          role="group"
          aria-label="Filter education stages"
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#F8F6F1] border border-[#E8D9B9] self-start md:self-auto"
        >
          {[
            { id: 'all', label: 'All Stages' },
            { id: 'btech', label: 'B.Tech' },
            { id: 'intermediate', label: 'Intermediate' },
            { id: 'tenth', label: '10th Standard' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStage(tab.id)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedStage === tab.id
                  ? 'bg-[#B39458] text-white font-medium'
                  : 'text-[#777777] hover:text-[#252525]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Timeline Layout */}
      <div className="mt-12 space-y-8">
        {filteredEducation.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] p-7 sm:p-9 shadow-[0_8px_30px_rgba(37,37,37,0.03)] transition-colors hover:border-[#B39458]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Stage Index, Degree & Institution */}
              <div className="lg:col-span-4 space-y-2">
                <p className="font-mono text-xs text-[#B39458] font-medium tabular-nums">
                  {entry.stageLabel}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#252525] tracking-tight">
                  {entry.degree}
                </h2>
                <p className="text-sm text-[#777777] font-medium">{entry.institution}</p>
              </div>

              {/* Right Column: Detailed Attributes & Academic Standing */}
              <div className="lg:col-span-8 space-y-6">
                {entry.duration ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#E8D9B9]">
                      <div>
                        <p className="font-mono text-xs text-[#777777]">Institution</p>
                        <p className="mt-1 text-sm font-medium text-[#252525]">{entry.institution}</p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-[#777777]">Academic Batch</p>
                        <p className="mt-1 font-mono text-sm font-semibold text-[#252525] tabular-nums">
                          {entry.duration}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-[#777777]">Current Status</p>
                        <p className="mt-1 text-sm font-semibold text-[#B39458]">
                          {entry.currentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Semester SGPA Table */}
                    {entry.semesters && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-mono text-xs text-[#777777]">
                            Semester SGPA Record
                          </h3>
                          <span className="font-mono text-xs text-[#777777] tabular-nums">
                            2025–2029
                          </span>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-[#E8D9B9] bg-[#F8F6F1]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#E8D9B9] font-mono text-xs text-[#777777]">
                                <th className="py-3 px-4 font-normal">Semester</th>
                                <th className="py-3 px-4 font-normal">Academic Status</th>
                                <th className="py-3 px-4 font-normal text-right">SGPA</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8D9B9] text-sm bg-[#FFFFFF]">
                              {entry.semesters.map((sem) => (
                                <tr key={sem.semester} className="hover:bg-[#F8F6F1]/60">
                                  <td className="py-3.5 px-4 font-medium text-[#252525]">
                                    {sem.semester}
                                  </td>
                                  <td className="py-3.5 px-4 font-mono text-xs text-[#777777]">
                                    {sem.status}
                                  </td>
                                  <td className="py-3.5 px-4 font-mono text-sm font-semibold text-[#B39458] text-right tabular-nums">
                                    {sem.sgpa}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-mono text-xs text-[#777777]">Qualification</p>
                      <p className="mt-1 text-sm font-medium text-[#252525]">{entry.degree}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-[#777777]">Institution</p>
                      <p className="mt-1 text-sm font-medium text-[#252525]">{entry.institution}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Navigation Action */}
      <div className="mt-12 pt-8 border-t border-[#E8D9B9] flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#777777]">
          Next Section: Core Technical Skills &amp; Languages
        </p>
        <button
          type="button"
          onClick={() => onNavigate('skills')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B39458] hover:bg-[#9E8047] text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Continue to Skills</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
