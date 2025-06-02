
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Users, Image, NotebookIcon, Ribbon, Shield, ShieldAlertIcon, ShieldCheck } from 'lucide-react';
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
    Acquisition: <NotebookIcon size={20} className="mr-2" />,
    Awareness: <Ribbon size={20} className="mr-2" />,
    Activation: <Shield size={20} className="mr-2" />,
    Retention: <ShieldAlertIcon size={20} className="mr-2" />,
    Revenue: <ShieldCheck size={20} className="mr-2" />,

    'Fleets Management': <Image size={20} className="mr-2" />
  };

  const routes = {
    'Dashboard': '/dashboard',
    'Users': '/users',
    'Acquisition': '/acquisition',
    'Awareness': '/awareness',
    'Activation': '/activation',
    'Retention': '/retention',
    'Revenue': '/revenue',
    'Post': '/posts',
    'Fleets Management': '/fleetmangement',
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
      {!isMobile ? <aside className="w-64 bg-gray-900 text-white overflow-y-auto flex flex-col h-screen">
        <div className="px-6 pt-2 flex-grow">
          <img
            src="/zoaverWhiteIcon.png"
            alt="Logo"
            className="h-12 w-auto "
          />
          <nav className="space-y-2 mt-5">
            {Object.entries(routes).map(([section, route]) => (
                <Link
                  href={route}
                  key={section}
                className={`flex items-center w-full text-left py-3 px-4 rounded-lg transition-all text-white  mb-2 ${activeSection === section
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
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            <div className="relative mr-2 w-6 h-6 flex items-center justify-center">
      <span className={`absolute transition-all duration-500 ${
        theme === 'light' 
                  ? 'opacity-100 transform rotate-0'
                  : 'opacity-0 transform -rotate-90 scale-0'
                }`}>
                🌙
              </span>
      <span className={`absolute transition-all duration-500 ${
        theme === 'light' 
                  ? 'opacity-0 transform rotate-90 scale-0'
                  : 'opacity-100 transform rotate-0'
                }`}>
                ☀️
              </span>
            </div>
            <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside> : null}</>)

}
export default sideBar;