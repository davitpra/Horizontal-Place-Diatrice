"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function Modal({ isOpen, close, title, button, children, buttonAction, button2, button2Action }) {
  const [open, setOpen] = useState(isOpen);

  // Close modal when the TableModal state changes
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Close modal when pick out of the modal
  useEffect(() => {
    if (!open) {
      close();
    }
  }, [open, close]);

  return (
    <Dialog open={open} onClose={close} className="">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="w-10/12 flex flex-col items-center">
          <DialogPanel className="bg-white p-6 rounded overflow-auto max-h-screen md:min-w-[800px]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
              <div className="flex space-x-10 ">
                <div className="ml-4 mt-2 shrink-0 flex space-x-4">
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      buttonAction();
                      setOpen(false);
                    }
                    }
                  >
                    {button}
                  </button>
                  {button2 && <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      button2Action();
                      setOpen(false);
                    }
                    }
                  >
                    {button2}
                  </button>}
                </div>
                <div className="pr-0 pt-4 sm:block">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </div>
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
