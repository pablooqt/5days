'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/stores/useUIStore';
import { Button } from '../ui/Button';
import {
  Building2,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F7F8FA]/80 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-[#4F6BED] flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              OmniTwin
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 mt-0.5">
              3D Digital Twin
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="#features"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/70 transition-colors"
          >
            Capabilities
          </Link>
          <Link
            href="#devices"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/70 transition-colors"
          >
            Device Telemetry
          </Link>
          <Link
            href="#architecture"
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/70 transition-colors"
          >
            Architecture
          </Link>
        </nav>

        {/* Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/app">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Explore Building</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/app">
            <Button variant="primary" size="sm" className="h-8 px-3 text-xs">
              Explore
            </Button>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Capabilities
            </Link>
            <Link
              href="#devices"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Device Telemetry
            </Link>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Architecture
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/app" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center gap-1.5">
                <span>Explore Building</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
