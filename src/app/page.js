'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  TableCellsIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useAuth } from '@/hooks/auth/useAuth'
import { useEffect } from 'react'

const features = [
  {
    name: 'Resident Management',
    description:
      'Complete list of residents with name, room, and personalized dietary preferences.',
    icon: UserGroupIcon,
  },
  {
    name: 'Meal System',
    description:
      'Complete management of breakfasts, lunches, and dinners with personalized preferences for each resident.',
    icon: TableCellsIcon,
  },
  {
    name: 'Tray Control',
    description:
      'Tracking and management of meals served on trays with detailed control per resident.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Weekly Menu',
    description:
      'Creation and management of weekly menus planned by week with automatic generation based on preferences.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Service Summary',
    description:
      'Daily summary of meals served, residents attended, and preferences fulfilled.',
    icon: ChartBarIcon,
  },
]
const steps = [
  { id: 'Step 1', name: 'Access the System', href: '#', description: 'Access the system with your username and password' },
  { id: 'Step 2', name: 'Manage Residents', href: '#', description: 'Manage residents with their name, room, and dietary preferences' },
  { id: 'Step 3', name: 'Organize Menus', href: '#', description: 'Organize menus with ingredients and quantities' },

]

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter()

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
  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                  Resident Management System
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                  A complete resident management system for care centers. Manage residents, dietary preferences, daily menus, and meal service efficiently.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => router.push('/login')}
                  >
                    Log in
                  </a>
                  <a href="#features" className="text-sm/6 font-semibold text-gray-900">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    alt="App screenshot"
                    src="/hero/home.png"
                    width={2432}
                    height={1442}
                    className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            />
          </div>
        </div>
        {/* Feature section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8" id="features">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-600">Better Management</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
              System Features
            </p>
            <p className="mt-6 text-lg/8 text-gray-700">
              Access all the necessary tools to manage meal service efficiently
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                      <feature.icon aria-hidden="true" className="size-6 text-white" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/*Steps section*/}
        <div className="mx-auto max-w-7xl px-6 sm:mt-56 lg:px-8">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
              {steps.map((step) => (
                <li key={step.name} className="md:flex-1">
                  <a
                    href={step.href}
                    className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
                  >
                    <span className="text-md font-medium text-indigo-600 group-hover:text-indigo-800">
                      {step.id}
                    </span>
                    <span className="text-md font-medium text-gray-900">{step.name}</span>
                  </a>
                  <p className="text-md text-gray-500 mt-2">{step.description}</p>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="mt-16">
          .
        </div>
      </main>
    </div>
  )
}
