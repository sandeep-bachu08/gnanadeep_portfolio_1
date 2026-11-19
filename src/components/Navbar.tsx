import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId, PORTFOLIO_DATA } from '../data/portfolioData';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'python', label: 'Python' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectPage = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8D9B9] bg-[#FFFFFF]/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleSelectPage('home')}
          className="font-display text-lg font-bold tracking-tight text-[#252525] hover:text-[#B39458] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B39458]"
        >
          {PORTFOLIO_DATA.name}
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPage(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B39458] ${
                  isActive
                    ? 'text-[#252525] font-semibold'
                    : 'text-[#777777] hover:text-[#252525]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[#B39458] transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelectPage('contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-[#B39458] hover:bg-[#9E8047] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B39458]"
          >
            Contact Me
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E8D9B9] bg-[#FFFFFF] text-[#252525] hover:text-[#B39458] hover:border-[#B39458] transition-colors cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8D9B9] bg-[#FFFFFF] px-6 py-4 shadow-lg">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPage(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F8F6F1] text-[#252525] font-semibold'
                      : 'text-[#777777] hover:bg-[#F8F6F1] hover:text-[#252525]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="font-mono text-xs text-[#B39458]">Active</span>}
                </button>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#E8D9B9]">
              <button
                type="button"
                onClick={() => handleSelectPage('contact')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#B39458] hover:bg-[#9E8047] rounded-lg transition-colors cursor-pointer"
              >
                Contact Me
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
