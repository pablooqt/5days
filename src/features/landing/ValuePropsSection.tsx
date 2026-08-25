import React from 'react';
import { Card } from '@/components/ui/Card';
import { Box, Zap, RefreshCw, CheckCircle } from 'lucide-react';

const valueProps = [
  {
    icon: Box,
    iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    title: 'See Everything in 3D',
    description:
      'Explore your entire facility in an interactive isometric digital twin. Isolate floors, enable transparent cutaways, and inspect rooms with zero guesswork.',
    bullets: ['Instant floor cutaway views', 'Procedural multi-level layout', 'Spatial room occupancy'],
  },
  {
    icon: Zap,
    iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
    title: 'Control in Seconds',
    description:
      'Adjust climate setpoints, toggle zone lighting, lock/unlock smart doors, and dispatch elevators with sub-second response times.',
    bullets: ['Multi-capability device engine', 'Direct spatial interaction', 'Role-based control governance'],
  },
  {
    icon: RefreshCw,
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    title: 'Live, Always in Sync',
    description:
      'One unified management workspace keeps floors, rooms, devices, telemetry, and controls visible in one clear spatial interface.',
    bullets: ['Sub-second realtime sync', 'Single source of truth', 'Audit logged state transitions'],
  },
];

export const ValuePropsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-200/80" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
             Why OmniTwin Digital Twin
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Built for total operational clarity.
          </p>
          <p className="mt-3 text-base text-slate-600">
            Eliminate traditional flat dashboards. Experience your facility as an active, unified 3D environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                className="p-8 flex flex-col justify-between border-slate-200"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 shadow-xs ${item.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                  {item.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
