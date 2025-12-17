import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-3 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go back home
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Or try these pages:
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/settings"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
