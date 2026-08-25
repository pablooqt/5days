import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Building2 } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-slate-200/80" id="architecture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-[#1E2B68] to-slate-900 rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-xl">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#4F6BED]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center border border-white/20">
              <Building2 className="w-6 h-6 text-indigo-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to experience your building in 3D?
            </h2>

            <p className="text-base text-slate-300">
              Launch the Interactive Digital Twin management interface now. No 3D software or model setup required — everything is procedural and browser-native.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/app">
                <Button
                  size="lg"
                  className="bg-[#4F6BED] hover:bg-[#3E58D6] text-white font-semibold gap-2 shadow-lg shadow-indigo-500/30"
                >
                  <span>Launch Management Mode</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
