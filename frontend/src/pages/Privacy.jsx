import React, { useEffect } from 'react';
import {
  EyeIcon,
  LockClosedIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      icon: <EyeIcon className="w-5 h-5 text-emerald-600" />,
      title: "Information We Collect",
      description: "We collect information you provide directly to us in order to operate and improve TrackFlow.",
      points: [
        "Account details such as name and email",
        "Habit tracking and completion logs",
        "Usage analytics and performance data",
        "Preferences and application settings"
      ]
    },
    {
      icon: <ChartBarIcon className="w-5 h-5 text-emerald-600" />,
      title: "How We Use Your Data",
      description: "Your data is used to provide core features, personalize your experience, improve reliability, and generate habit insights and consistency metrics.",
      points: [
        "Personalize your habit tracking experience",
        "Provide actionable insights and analytics",
        "Improve service reliability and performance",
        "Develop new features and functionality"
      ]
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />,
      title: "Data Security",
      description: "We implement enterprise-grade security measures to protect your information.",
      points: [
        "End-to-end encryption for all data in transit",
        "Regular security audits and penetration testing",
        "Strict access controls and monitoring",
        "GDPR and CCPA compliance"
      ]
    },
    {
      icon: <UserCircleIcon className="w-5 h-5 text-emerald-600" />,
      title: "Your Rights",
      description: "You have full control over your personal data.",
      points: [
        "Access and download your data anytime",
        "Request data deletion",
        "Update or correct your information",
        "Opt-out of data collection"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white pb-20 text-slate-800">
      {/* Header */}
      <header className="pt-24 pb-16 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to protecting your privacy and being transparent about how we handle your data.
            This policy explains what information we collect, how we use it, and your rights.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 -mt-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Last Updated */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <p className="text-sm font-medium text-emerald-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content Sections */}
          <div className="divide-y divide-slate-100">
            {sections.map((section, index) => (
              <section 
                key={index} 
                className="p-8 hover:bg-slate-50/50 transition-colors duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-[60px_1fr] gap-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {section.description}
                    </p>
                    {section.points && (
                      <ul className="space-y-2.5">
                        {section.points.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-emerald-500 mr-2.5 mt-1">•</span>
                            <span className="text-slate-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-10 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-5 shadow-lg">
                <EnvelopeIcon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Questions about your data?
              </h3>
              <p className="text-slate-600 mb-7 max-w-lg mx-auto leading-relaxed">
                Our dedicated support team is here to help with any questions about our privacy practices or your personal data.
              </p>
              <div className="flex flex-col sm:flex-row justify-center">
                <Link
                  to="/contact"
                  className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
