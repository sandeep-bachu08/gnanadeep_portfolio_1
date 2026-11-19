import React, { useState, useRef, useEffect } from 'react';
import { Code2, Database, GitBranch, Maximize2, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface Portrait3DCardProps {
  compact?: boolean;
}

export const Portrait3DCard: React.FC<Portrait3DCardProps> = ({ compact = false }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState<{ rx: number; ry: number; glareX: number; glareY: number }>({
    rx: 0,
    ry: 0,
    glareX: 50,
    glareY: 30,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    setRotation({
      rx: -normY * 7,
      ry: normX * 7,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ rx: 0, ry: 0, glareX: 50, glareY: 30 });
  };

  return (
    <>
      <div className="relative perspective-1000 w-full h-full flex items-center justify-center">
        {/* Subtle 3D offset champagne-gold architectural frame behind portrait */}
        <div
          aria-hidden="true"
          className="absolute inset-4 translate-x-3 translate-y-3 rounded-2xl border border-[#B39458]/40 bg-[#F8F6F1] pointer-events-none transition-transform duration-200 ease-out"
          style={{
            transform: isHovered
              ? `translate3d(${-rotation.ry * 0.9}px, ${rotation.rx * 0.9}px, -24px)`
              : 'translate3d(12px, 12px, -20px)',
          }}
        />

        {/* Subtle Floating Technical Icons around the frame (Homepage mode) */}
        {!compact && (
          <>
            <div
              aria-hidden="true"
              className="hidden sm:flex absolute -left-4 top-8 z-20 items-center justify-center w-10 h-10 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_24px_rgba(37,37,37,0.06)] text-[#B39458] transition-transform duration-300"
              style={{
                transform: isHovered ? 'translate3d(-4px, -4px, 20px)' : 'translate3d(0, 0, 10px)',
              }}
            >
              <Code2 className="w-4 h-4" />
            </div>

            <div
              aria-hidden="true"
              className="hidden sm:flex absolute -right-3 top-1/3 z-20 items-center justify-center w-10 h-10 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_24px_rgba(37,37,37,0.06)] text-[#B39458] transition-transform duration-300"
              style={{
                transform: isHovered ? 'translate3d(4px, -3px, 20px)' : 'translate3d(0, 0, 10px)',
              }}
            >
              <Database className="w-4 h-4" />
            </div>

            <div
              aria-hidden="true"
              className="hidden sm:flex absolute -left-3 bottom-16 z-20 items-center justify-center w-10 h-10 rounded-xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-[0_8px_24px_rgba(37,37,37,0.06)] text-[#B39458] transition-transform duration-300"
              style={{
                transform: isHovered ? 'translate3d(-3px, 4px, 20px)' : 'translate3d(0, 0, 10px)',
              }}
            >
              <GitBranch className="w-4 h-4" />
            </div>
          </>
        )}

        {/* Interactive 3D Portrait Container with Subtle Champagne-Gold Detailing */}
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
          aria-label="Inspect portrait of A. Gnanadeep Sai"
          className={`group relative w-full overflow-hidden rounded-2xl border-2 border-[#E8D9B9] hover:border-[#B39458] bg-[#F8F6F1] shadow-[0_20px_50px_rgba(37,37,37,0.08)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B39458] transition-all duration-150 ease-out ${
            compact ? 'aspect-[4/5] max-h-[460px]' : 'aspect-[4/5] lg:h-full max-h-[540px]'
          }`}
          style={{
            transform: `rotateX(${rotation.rx.toFixed(2)}deg) rotateY(${rotation.ry.toFixed(2)}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {!imageError ? (
            <img
              src={PORTFOLIO_DATA.profileImage}
              alt="A. Gnanadeep Sai — B.Tech Artificial Intelligence and Machine Learning Student at Jain University, Bangalore"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F8F6F1] text-center">
              <span className="font-display text-3xl font-bold text-[#252525] tracking-tight">
                {PORTFOLIO_DATA.name}
              </span>
              <span className="mt-2 text-sm text-[#777777]">
                {PORTFOLIO_DATA.degreeShort}
              </span>
            </div>
          )}

          {/* Subtle dynamic warm champagne highlight on 3D tilt */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: isHovered ? 0.22 : 0,
              background: `radial-gradient(circle at ${rotation.glareX}% ${rotation.glareY}%, rgba(232, 217, 185, 0.55), transparent 60%)`,
            }}
          />

          {/* Measured bottom scrim for legibility over photography */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Minimal expand affordance icon top-right */}
          <div className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-lg bg-white/95 border border-[#E8D9B9] text-[#252525] group-hover:text-[#B39458] group-hover:border-[#B39458] shadow-sm transition-colors">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Clean unboxed caption at bottom of portrait */}
          <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-base font-semibold text-white tracking-tight">
                {PORTFOLIO_DATA.name}
              </p>
              <p className="mt-0.5 font-mono text-xs text-[#E8D9B9]">
                B.Tech AIML <span aria-hidden="true">·</span> Jain University, Bangalore
              </p>
            </div>
            <span className="font-mono text-[11px] text-white/90 whitespace-nowrap shrink-0">
              View Portrait
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (White & Champagne Gold Theme) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#252525]/60 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full resolution profile portrait"
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl border border-[#E8D9B9] bg-[#FFFFFF] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8D9B9] bg-[#F8F6F1]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#777777]">
                <span className="text-[#252525] font-semibold">{PORTFOLIO_DATA.name}</span>
                <span aria-hidden="true">·</span>
                <span>{PORTFOLIO_DATA.university}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[#252525] hover:text-[#B39458] bg-white hover:bg-[#F8F6F1] border border-[#E8D9B9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label="Close portrait viewer"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-[#F8F6F1]">
              <img
                src={PORTFOLIO_DATA.profileImage}
                alt={PORTFOLIO_DATA.name}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
