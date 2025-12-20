import React from "react";
import {
  EnvelopeIcon,
  LinkIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-5xl mx-auto space-y-20">
        <section className="text-center">
          <p className="text-sm uppercase tracking-widest text-emerald-600 font-semibold mb-3">
            About the Developer
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Building products with purpose & precision
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            I design and build modern web applications with a focus on clarity,
            performance, and real-world usability.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
            Full Stack Developer
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Ankit Kumar
          </h2>

          <p className="mt-5 text-slate-600 leading-relaxed max-w-3xl">
            I specialize in building scalable, intuitive web applications
            using modern JavaScript frameworks and clean backend
            architectures. I care deeply about UX, performance, and
            maintainability.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <EnvelopeIcon className="w-5 h-5 text-slate-400" />
              ankitkumar.iitp09@gmail.com
            </div>
            <div className="flex items-center gap-3">
              <CodeBracketIcon className="w-5 h-5 text-slate-400" />
              <a
                href="https://github.com/ankit9241"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:underline"
              >
                github.com/ankit9241
              </a>
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-slate-400" />
              <a
                href="https://linkedin.com/in/ankitkumar1109"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:underline"
              >
                linkedin.com/in/ankitkumar1109
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            About This Project
          </h3>

          <div className="max-w-3xl text-slate-700 space-y-5 leading-relaxed">
            <p>
              <strong>TrackFlow</strong> is a modern habit-tracking platform
              designed to help users build consistency through clean UX,
              insightful analytics, and frictionless daily interactions.
            </p>

            <p>
              The product focuses on long-term behavioral change rather than
              short-term motivation, combining streak logic, visual progress,
              and performance insights in a calm, distraction-free interface.
            </p>

            <p className="text-sm text-slate-600">
              Built with <span className="font-medium">React</span>,{" "}
              <span className="font-medium">Tailwind CSS</span>,{" "}
              <span className="font-medium">Node.js</span>,{" "}
              <span className="font-medium">Express</span>, and{" "}
              <span className="font-medium">MongoDB</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutMe;
