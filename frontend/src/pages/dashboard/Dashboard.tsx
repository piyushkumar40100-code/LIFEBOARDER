import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  FireIcon,
  CheckCircleIcon,
  HeartIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  goals: number;
  tasks: number;
  habits: number;
  finances: number;
  health: number;
  bucketList: number;
}

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = {
    goals: 3,
    tasks: 8,
    habits: 5,
    finances: 12,
    health: 6,
    bucketList: 15,
  };

  const moduleCards: ModuleCard[] = [
    {
      title: 'Goals',
      description: 'Track and achieve your life goals',
      href: '/dashboard/goals',
      icon: TrophyIcon,
      color: 'bg-purple-500',
      count: stats.goals,
    },
    {
      title: 'Finances',
      description: 'Manage income, expenses, and budgets',
      href: '/dashboard/finances',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      count: stats.finances,
    },
    {
      title: 'Habits',
      description: 'Build and maintain daily habits',
      href: '/dashboard/habits',
      icon: FireIcon,
      color: 'bg-orange-500',
      count: stats.habits,
    },
    {
      title: 'Tasks',
      description: 'Organize and complete daily tasks',
      href: '/dashboard/todos',
      icon: CheckCircleIcon,
      color: 'bg-blue-500',
      count: stats.tasks,
    },
    {
      title: 'Health',
      description: 'Track health metrics and wellness',
      href: '/dashboard/health',
      icon: HeartIcon,
      color: 'bg-red-500',
      count: stats.health,
    },
    {
      title: 'Bucket List',
      description: 'Life experiences you want to achieve',
      href: '/dashboard/bucketlist',
      icon: MapPinIcon,
      color: 'bg-indigo-500',
      count: stats.bucketList,
    },
  ];

  return (
    <DashboardShell
      title={`Welcome back, ${user?.email?.split('@')[0] || 'User'}!`}
      subtitle="Here's what's happening with your life today."
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <TrophyIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Goals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.goals}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tasks Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.tasks}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Habits
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.habits}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Explore Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleCards.map((module) => (
              <Link
                key={module.title}
                to={module.href}
                className="group block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${module.color} rounded-lg p-3`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {module.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {module.count} items
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Completed task: "Review project proposal"
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrophyIcon className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Created new goal: "Learn TypeScript"
                  </p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <FireIcon className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Completed habit: "Morning meditation"
                  </p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;