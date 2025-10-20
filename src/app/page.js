"use client";

import {
  UserGroupIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  HomeIcon,
  TableCellsIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";

const features = [
  {
    name: "Serving Management",
    description: "Manage meal serving for different seating areas with real-time resident information and meal preferences.",
    icon: MapIcon,
    href: "/serving",
    color: "bg-blue-50 text-blue-600"
  },
  {
    name: "Resident Directory",
    description: "View all residents by room with their seating arrangements and dietary observations.",
    icon: UserGroupIcon,
    href: "/room",
    color: "bg-green-50 text-green-600"
  },
  {
    name: "Table Management",
    description: "Organize and manage table arrangements for efficient meal service.",
    icon: TableCellsIcon,
    href: "/table",
    color: "bg-purple-50 text-purple-600"
  },
  {
    name: "Tray Management",
    description: "Track and manage meal trays for organized service delivery.",
    icon: ClipboardDocumentListIcon,
    href: "/trays",
    color: "bg-orange-50 text-orange-600"
  },
  {
    name: "Dashboard",
    description: "Overview and analytics of meal service operations and resident preferences.",
    icon: ChartBarIcon,
    href: "/",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    name: "Summary Reports",
    description: "Generate comprehensive reports on meal service and resident satisfaction.",
    icon: ClipboardDocumentListIcon,
    href: "/summary",
    color: "bg-pink-50 text-pink-600"
  }
];

// Component for authenticated users (Dashboard)
const DashboardContent = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Horizontal Place
            </h1>
            <p className="text-gray-600">
              Resident Management System
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || user?.email}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role?.name || 'User'}
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to the Dashboard!
            </h2>
            <p className="text-gray-600 mb-8">
              You have successfully logged in. Here you can access all the system functionalities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Navigation Cards */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resident Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Manage resident information and their preferences.
                </p>
                <Link
                  href="/room"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Residents
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Meal Service
                </h3>
                <p className="text-gray-600 mb-4">
                  Manage breakfast, lunch and dinner service.
                </p>
                <Link
                  href="/serving"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Meals
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Summary
                </h3>
                <p className="text-gray-600 mb-4">
                  Review system reports and statistics.
                </p>
                <Link
                  href="/summary"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Summary
                </Link>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">ID:</p>
                  <p className="font-medium text-gray-900">{user?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User:</p>
                  <p className="font-medium text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email:</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role:</p>
                  <p className="font-medium text-gray-900">
                    {user?.role?.name || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// Component for non-authenticated users (Welcome page)
const WelcomeContent = () => (
  <div className="min-h-screen bg-gray-50 absolute left-0 top-0 w-full z-51">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                alt="Horizon Place"
                src="https://levanteliving.com/wp-content/uploads/2023/08/Horizon-Place-color-8.png"
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Dietitian Guide
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              A comprehensive guide to help you get familiar with the residents and their meal preferences.
              Streamline meal service management with real-time information and organized workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Application Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Access all the tools you need to manage meal service efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <IconComponent className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Quick Start Guide
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started with these essential steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Seating Area
              </h3>
              <p className="text-gray-600">
                Choose between different seating areas using the dropdown in the top navigation bar.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Access Serving Tools
              </h3>
              <p className="text-gray-600">
                Navigate to the Serving page to manage meals, view resident information, and organize table maps.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Review Resident Info
              </h3>
              <p className="text-gray-600">
                Check resident preferences and dietary requirements in the Room directory or Dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Horizon Place - Dietitian Guide Application
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Designed to streamline meal service management and enhance resident care
            </p>
          </div>
        </div>
      </div>
    </div>
);

export default function HomePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // If user is authenticated, show the dashboard
  if (user) {
    return <DashboardContent user={user} handleLogout={handleLogout} />;
  }

  // If not authenticated, show the welcome page
  return <WelcomeContent />;
}
