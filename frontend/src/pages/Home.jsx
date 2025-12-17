import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Build Better Habits,
            <br />
            <span className="text-indigo-600">One Day at a Time</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Track your habits, stay consistent, and achieve your goals with our simple and powerful habit tracking app.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to={currentUser ? "/dashboard" : "/register"}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
            >
              {currentUser ? 'Go to Dashboard' : 'Start for Free'}
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Why Choose TrackFlow?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: '📅',
                title: 'Daily Tracking',
                description: 'Easily track your daily habits and build consistency over time.'
              },
              {
                icon: '📊',
                title: 'Visual Progress',
                description: 'See your progress with beautiful charts and statistics.'
              },
              {
                icon: '🔔',
                title: 'Smart Reminders',
                description: 'Get notified to stay on track with your habits.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
