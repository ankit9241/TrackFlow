import React from 'react';
import {
  LinkIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-teal-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            These terms govern your use of TrackFlow. By accessing or using the
            service, you agree to be bound by them.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-10">

          {/* Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <LinkIcon className="w-4 h-4" />
              Acceptance of Terms
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              By accessing and using TrackFlow, you agree to comply with and be
              legally bound by these Terms of Service. If you do not agree, you
              must discontinue use of the service.
            </p>
          </section>

          {/* Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <ScaleIcon className="w-4 h-4" />
              Use License
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              TrackFlow grants you a limited, non-transferable, non-commercial
              license to use the platform for personal habit tracking only.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>You may not copy or redistribute the service</li>
              <li>You may not use TrackFlow for commercial purposes</li>
              <li>You may not reverse engineer or exploit the platform</li>
            </ul>
          </section>

          {/* Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <ExclamationTriangleIcon className="w-4 h-4" />
              Disclaimer
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              TrackFlow is provided on an “as-is” basis. We make no guarantees
              regarding uptime, accuracy of data, or uninterrupted availability.
            </p>
          </section>

          {/* Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <GlobeAltIcon className="w-4 h-4" />
              Governing Law
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              These terms are governed by applicable local laws, and any disputes
              shall be resolved exclusively within the appropriate jurisdiction.
            </p>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-8 text-center">

            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Need clarification?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Contact our support team if you have any legal questions.
            </p>

            <Link
              to="/contact"
              className="inline-block px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
