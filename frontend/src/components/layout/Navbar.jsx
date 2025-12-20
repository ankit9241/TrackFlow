import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiLogIn,
  FiUserPlus,
  FiInfo,
  FiMail,
  FiStar,
  FiMenu
} from 'react-icons/fi';
import Logo from '../../assets/trackflow-logo.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-emerald-50 text-emerald-700'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16 px-8 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full shadow-sm">

          {/* ===== Left Side ===== */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center h-12 w-auto"
            >
              <img
                src={Logo}
                alt="TrackFlow Logo"
                className="h-full w-auto object-contain"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {currentUser && (
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(
                    '/dashboard'
                  )}`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/features"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(
                  '/features'
                )}`}
              >
                Features
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(
                  '/about'
                )}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(
                  '/contact'
                )}`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* ===== Right Side ===== */}
          <div className="flex items-center gap-3">
            {/* Public Links */}
            <div className="hidden sm:flex items-center gap-2">
              {!currentUser && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 rounded-full hover:bg-slate-100 transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none">
                  <FiMenu className="w-6 h-6" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 z-50">
                    <div className="py-1 space-y-1">
                      {currentUser ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={`${active ? 'bg-slate-100' : ''
                                  } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                              >
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <div className="border-t border-slate-100 my-1"></div>
                        </>
                      ) : (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/login"
                                className={`${active ? 'bg-slate-100' : ''
                                  } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                              >
                                <div className="flex items-center gap-3">
                                  <FiLogIn className="w-4 h-4" />
                                  Log In
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/register"
                                className={`${active ? 'bg-slate-100' : ''
                                  } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                              >
                                <div className="flex items-center gap-3">
                                  <FiUserPlus className="w-4 h-4" />
                                  Sign Up
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                          <div className="border-t border-slate-100 my-1"></div>
                        </>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/features"
                            className={`${active ? 'bg-slate-100' : ''
                              } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                          >
                            <div className="flex items-center gap-3">
                              <FiStar className="w-4 h-4" />
                              Features
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/about"
                            className={`${active ? 'bg-slate-100' : ''
                              } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                          >
                            <div className="flex items-center gap-3">
                              <FiInfo className="w-4 h-4" />
                              About
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/contact"
                            className={`${active ? 'bg-slate-100' : ''
                              } block px-4 py-2 text-sm text-slate-700 rounded-lg`}
                          >
                            <div className="flex items-center gap-3">
                              <FiMail className="w-4 h-4" />
                              Contact Us
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            {currentUser && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <FiUser className="w-5 h-5" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 scale-95 translate-y-1"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-3 w-52 origin-top-right rounded-2xl bg-white border border-slate-200 shadow-xl focus:outline-none overflow-hidden">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/settings')}
                          className={`${active ? 'bg-slate-100' : ''
                            } flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700`}
                        >
                          <FiSettings className="w-4 h-4 text-slate-400" />
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active ? 'bg-slate-100' : ''
                            } flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700`}
                        >
                          <FiLogOut className="w-4 h-4 text-slate-400" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
