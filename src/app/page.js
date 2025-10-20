"use client";

import {
  UserGroupIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  TableCellsIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  // If user is authenticated, redirect to table page
  if (user) {
    // Option 1: Redirect using Next.js router
    const router = useRouter();
    useEffect(() => {
      router.push('/table');
    }, [router]);
    return null; // or a loading spinner
    
    // Option 2: Import and render the table component directly
    // return <TablesPage user={user} handleLogout={handleLogout} />;
  }

  // If not authenticated, show the welcome page
  return <WelcomeContent />;
}
