import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import NotFoundImage from '../assets/notfound.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#e3fff1] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Image Section */}
        <div className="flex justify-center relative overflow-hidden group">
          <div className="absolute -inset-x-2 rounded-lg"></div>
          <img
            src={NotFoundImage}
            alt="Page not found"
            className="relative z-10 max-w-md md:max-w-lg w-full object-cover transition-transform duration-300 scale-100 hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="text-center md:text-left">
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
            404
          </h1>

          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            Page not found
          </h2>

          <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            The page you’re looking for doesn’t exist or may have been moved.
            Let’s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm"
            >
              <HomeIcon className="w-4 h-4" />
              Go to home
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
