
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Users, Image } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from "next/link";

interface sideBarProps {
  activeSection?: any;
  setActiveSection?: any;
  fleetManagement?: any
}


const sideBar: React.FC<sideBarProps> = ({ activeSection, fleetManagement }) => {
  const sectionIcons: any = {
    Dashboard: <LayoutDashboard size={20} className="mr-2" />,
    Post: <FileText size={20} className="mr-2" />,
    Users: <Users size={20} className="mr-2" />,
    'Fleets Management': <Image size={20} className="mr-2" />
  };

  const routes = {
    'Dashboard': '/DashBoard',
    'Users': '/users',
    'Post': '/posts',
    'Fleets Management': '/fleetMangement',
  };

  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {!isMobile ? <aside className="w-64 bg-gray-900 text-white overflow-y-auto">
        <div className="px-6 pt-2">
          <img
            src="/zoaverWhiteIcon.png"
            alt="Logo"
            className="h-12 w-auto "
          />
          <nav className="space-y-2 mt-5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {Object.entries(routes).map(([section, route]) => (
              <Link
                href={route}
                key={section}
                className={`flex items-center w-full text-left py-3 px-4 rounded-lg transition-all text-white dark:text-black mb-2 ${activeSection === section
                  ? "bg-blue-600 text-white"
                  : "hover:text-black hover:bg-blue-100"
                  }`}
              >
                {sectionIcons[section]}
                <span className="font-medium">
                  {section}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside> : null}</>)

}
export default sideBar;