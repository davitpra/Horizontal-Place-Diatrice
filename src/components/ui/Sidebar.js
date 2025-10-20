"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  TransitionChild,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ArrowRightEndOnRectangleIcon, Bars3Icon, BellIcon, CalendarDateRangeIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useSeatingConfigure } from "../../store/seating/useSeatingConfigure";
import { ORDERSEATINGS } from "../../constants/orderseatings";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { SyncIndicator } from "@/components/ui/SyncIndicator";
import { SyncSettings } from "@/components/ui/SyncSettings";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { date } from "@/constants/date";
import { getMonthYearFromISO } from "@/utils/date";

const navigation = [
  { name: "Tables", href: "/table" },
  { name: "Trays", href: "/trays" },
  { name: "Summary", href: "/summary" },
  { name: "Weekly Menu", href: "/weekly-menu" },
];

const Serving = [
  { name: ORDERSEATINGS[0].name, seating: ORDERSEATINGS[0].seating },
  { name: ORDERSEATINGS[1].name, seating: ORDERSEATINGS[1].seating },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar({ children }) {
  const seating = useSeatingConfigure();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSeating, setShowSeating] = useState(false);
  const [seatingLabel, setSeatingLabel] = useState(ORDERSEATINGS[0].name);
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Set seating label
  useEffect(() => {
    setSeatingLabel(ORDERSEATINGS[seating.seating - 1].name);
  }, [seating.seating]);

  // Show seating only on the home page
  useEffect(() => {
    setShowSeating(pathname === "/");
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { month, year, day } = getMonthYearFromISO(date);

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          {/* Menu Panel */}
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              {/* Close Button */}
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <div className="flex shrink-0 items-center justify-center">
                  <img
                    alt="Your Company"
                    src="https://levanteliving.com/wp-content/uploads/2023/08/Horizon-Place-color-8.png"
                    className="h-16 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <div key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.href === pathname
                                  ? "bg-gray-50 text-indigo-600"
                                  : "hover:bg-gray-50",
                                "block rounded-md py-2 pl-10 pr-2 text-sm/6 font-semibold text-gray-700"
                              )}
                              onClick={toggleSidebar}
                            >
                              {item.name}
                            </Link>
                          </div>
                        ))}
                      </ul>
                    </li>
                    <li className="-mx-6 mt-auto">
                      <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900">
                        <UserIcon className="size-8" />
                        <span className="sr-only">Your profile</span>
                        <div className="flex-1">
                          <span aria-hidden="true">
                            {user?.username || user?.email || 'Usuario'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {user?.role?.name || 'Usuario'}
                          </div>
                        </div>
                        <button
                          onClick={logout}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Cerrar sesión"
                        >
                         <ArrowRightEndOnRectangleIcon className="size-8" />
                        </button>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 ">
            <div className="flex shrink-0 items-center justify-center">
              <img
                alt="Your Company"
                src="https://levanteliving.com/wp-content/uploads/2023/08/Horizon-Place-color-8.png"
                className="h-16 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.href === pathname
                              ? "bg-gray-50 text-indigo-600"
                              : "hover:bg-gray-50",
                            "block rounded-md py-2 pl-10 pr-2 text-sm/6 font-semibold text-gray-700"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900">
                    <UserIcon className="size-8" />
                    <span className="sr-only">Your profile</span>
                    <div className="flex-1">
                      <span aria-hidden="true">
                        {user?.username || user?.email || 'Usuario'}
                      </span>
                      <div className="text-xs text-gray-500">
                        {user?.role?.name || 'Usuario'}
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Cerrar sesión"
                    >
                      <ArrowRightEndOnRectangleIcon className="size-8" />
                    </button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Menu Icon */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Seating label */}
            {pathname !== "/trays" && (
              <Popover className="relative">
                <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                  <span>{seatingLabel}</span>
                  <ChevronDownIcon aria-hidden="true" className="size-5" />
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute left-28 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="w-56 shrink rounded-xl bg-white p-4 text-sm/6 font-semibold text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                    {Serving.map((item) => (
                      <button
                        key={item.name}
                        href="#"
                        className="block p-2 hover:text-indigo-600"
                        onClick={() => {
                          seating.setSeating(item.seating);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>
            )}
            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              {/* Search */}
              <form action="#" method="GET" className="relative flex flex-1">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="block size-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="flex items-center gap-x-2">
                  <CalendarDateRangeIcon
                    aria-hidden="true"
                    className="size-6"
                  />
                  <p className="text-sm font-medium text-gray-900">{day} {month} {year}</p>
                </div>
                {/* Sync Indicator */}
                <div className="">
                  <SyncIndicator />
                </div>

                {/* Sync Settings button */}
                <button
                  type="button"
                  onClick={() => setShowSyncSettings(true)}
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  title="Sync settings"
                >
                  <span className="sr-only">Sync settings</span>
                  <Cog6ToothIcon aria-hidden="true" className="size-6" />
                </button>
                {/* Notifications button */}
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  title="Notifications"
                >
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block sm:h-6 sm:w-px sm:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">User</span>
                    <UserIcon className="size-8" />
                  </MenuButton>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            {children}
          </main>
        </div>
      </div>

      {/* Sync Settings Modal */}
      <SyncSettings
        isOpen={showSyncSettings}
        onClose={() => setShowSyncSettings(false)}
      />
    </>
  );
}
