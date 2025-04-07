import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const NavBar = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = {
    'Dashboard': '/DashBoard',
    'Users': '/users',
    'Post': '/posts',
    'Fleets Management': '/fleetMangement',
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="flex items-center">
            {isMobile ? (
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none mr-4"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            ) : (
              <img
              src="/zoaverWhiteIcon.png"
              alt="Logo"
              className="h-12 w-auto "
            />
              // <h2 className="text-xl text-white font-bold">Zoaverse Analytics Dashboard</h2>
            )}
          </div>

          <Link
            href={'/'}
            onClick={() => Cookies.remove("token")}
            className="px-4 py-2 border border-white text-white rounded-lg transition-colors hover:bg-white hover:bg-opacity-10"
          >
            Log Out
          </Link>
        </div>
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 mt-16">
            <div className="relative">
              <div
                className="bg-black bg-opacity-70 backdrop-blur-sm"
                onClick={toggleMobileMenu}
              >
                <div className="container mx-auto px-4 py-3">
                  <div className="flex flex-col space-y-3">
                    {Object.entries(routes).map(([name, path]) => (
                      <Link
                        key={name}
                        href={path}
                        className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${router.pathname === path
                            ? 'bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 shadow-2xl text-white'
                            : 'bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900 shadow-2xl text-white hover:bg-gray-700 hover:bg-opacity-50 hover:text-white'
                          }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        {!isMobile && (
          <div className="hidden md:flex space-x-1 pb-2 px-4">
            {Object.entries(routes).map(([name, path]) => (
              <Link
                key={name}
                href={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${router.pathname === path
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;