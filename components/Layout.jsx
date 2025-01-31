import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalculator, 
  FaDollarSign,
  FaGlobe,
} from 'react-icons/fa';
import { FiActivity, FiPrinter, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { PiGraphicsCard } from "react-icons/pi";


const modes = [
  { id: 'basic', name: 'Standard', icon: <FaCalculator /> },
  { id: 'scientific', name: 'Scientific', icon: <FiActivity /> },
  { id: 'financial', name: 'Financial', icon: <FaDollarSign /> },
  { id: 'currency', name: 'Currency', icon: <FaGlobe /> },
  { id: 'printing', name: 'Printing', icon: <FiPrinter /> },
  { id: 'graphing', name: 'Graphing', icon: <PiGraphicsCard /> },
];

const Layout = ({ children, activeMode, setActiveMode }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex flex-col w-64 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold dark:text-white">SuperCalc Pro</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5 dark:text-white" />}
          </button>
        </div>
        
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`flex items-center p-3 mb-2 rounded-lg transition-colors ${
              activeMode === mode.id 
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
            }`}
          >
            {mode.icon}
            <span className="ml-3">{mode.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around p-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-3 rounded-full ${
                activeMode === mode.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {mode.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
};

export default Layout;