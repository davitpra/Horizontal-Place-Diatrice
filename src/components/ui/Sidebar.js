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
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useSeatingConfigure } from "../../hooks/useSeatingConfigure";
import { ORDERSEATINGS } from "../../constants/orderseatings";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  { name: "Serving", href: "/" },
  { name: "By Room", href: "/room" },
  { name: "Trays", href: "/trays" },
  { name: "Analisis", href: "#" },
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
  const pathname = usePathname();

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

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50"
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
                      <a
                        href="#"
                        className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        <img
                          alt=""
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="size-8 rounded-full bg-gray-50"
                        />
                        <span className="sr-only">Your profile</span>
                        <span aria-hidden="true">Tom Cook</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Menu Icon */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 "
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {showSeating && (
            <>
              {/* Seating label */}
              <Popover className="relative">
                <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                  <span>{seatingLabel}</span>
                  <ChevronDownIcon aria-hidden="true" className="size-5" />
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
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
            </>
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
              {/* Notification button */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
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
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-50"
                  />
                </MenuButton>
              </Menu>
            </div>
          </div>
        </div>
        {/* Main content */}
        {/* <main className={`${showSeating ? 'lg:pl-[480px]' : ''}`}> */}
        <main>
          <div className="px-4 py-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* {showSeating && (
      <aside className="fixed bottom-0 left-20 top-16 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 lg:block">
        aqui va el submenu en el sidebar
      </aside>
      )} */}
    </>
  );
}
