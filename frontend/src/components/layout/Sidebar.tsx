import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  FireIcon,
  CheckCircleIcon,
  HeartIcon,
  MapPinIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      description: 'Overview of all modules',
    },
    {
      name: 'Goals',
      href: '/dashboard/goals',
      icon: TrophyIcon,
      description: 'Track your life goals',
    },
    {
      name: 'Finances',
      href: '/dashboard/finances',
      icon: CurrencyDollarIcon,
      description: 'Manage income and expenses',
    },
    {
      name: 'Habits',
      href: '/dashboard/habits',
      icon: FireIcon,
      description: 'Build and track habits',
    },
    {
      name: 'Tasks',
      href: '/dashboard/todos',
      icon: CheckCircleIcon,
      description: 'Daily tasks and to-dos',
    },
    {
      name: 'Health',
      href: '/dashboard/health',
      icon: HeartIcon,
      description: 'Health metrics tracking',
    },
    {
      name: 'Bucket List',
      href: '/dashboard/bucketlist',
      icon: MapIcon,
      description: 'Life experiences to achieve',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex flex-col flex-grow pt-5 bg-gray-50 overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">Modules</span>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 transition-colors duration-150`}
              title={item.description}
            >
              <item.icon
                className={`${
                  isActive(item.href)
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-6 w-6`}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Quick Stats</p>
              <p className="text-xs text-gray-500">Track your progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;