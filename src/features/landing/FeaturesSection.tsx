import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Layers,
  Sliders,
  Bell,
  Eye,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Cutaway & Floor Isolation',
    description:
      'Instantly hide upper floors or render exterior walls semi-translucent (22% opacity) to reveal complex multi-room interiors while maintaining structural context.',
  },
  {
    icon: Sliders,
    title: 'Capability-Based Device Controls',
    description:
      'Control switchable, dimmable, temperature-controlled, and lockable fixtures with state-driven visual feedback in 3D.',
  },
  {
    icon: Bell,
    title: 'Automated Telemetry & Alerts',
    description:
      'Smart sensor monitoring with color-coded warning chips and real-time banner alerts when environmental thresholds are exceeded.',
  },
  {
    icon: Eye,
    title: 'Spatial Selection & Camera Focus',
    description:
      'Click any room or device in the 3D scene or from the directory list to smoothly transition the camera and open contextual action panels.',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Role Governance',
    description:
      'Granular permissions for Viewers (read-only monitoring), Operators (device management), and Admins (full user and audit administration).',
  },
  {
    icon: Cpu,
    title: 'High-Performance Procedural Engine',
    description:
      'Shared material singletons and procedural geometry generation with strict draw call budgeting for 60 FPS performance.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F7F8FA]" id="capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            Platform Capabilities
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Engineered for modern facility operations.
          </p>
          <p className="mt-3 text-base text-slate-600">
            A comprehensive suite of digital twin features built directly on WebGL and Three.js.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                className="p-6 bg-white border-slate-200/90 flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
