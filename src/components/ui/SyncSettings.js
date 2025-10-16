"use client";
import { useState, Fragment } from 'react';
import { useSyncContext } from '@/components/providers/SyncProvider';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  ArrowPathIcon,
  BellIcon,
  BellSlashIcon
} from '@heroicons/react/24/outline';

/**
 * SyncSettings - Modal for configuring sync settings
 */
export const SyncSettings = ({ isOpen, onClose }) => {
  const { 
    syncEnabled, 
    enableSync, 
    disableSync,
    showSyncNotifications,
    setShowSyncNotifications,
    forceSync,
  } = useSyncContext();

  const handleToggleSync = () => {
    if (syncEnabled) {
      disableSync();
    } else {
      enableSync();
    }
  };

  const handleToggleNotifications = () => {
    setShowSyncNotifications(!showSyncNotifications);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Sync Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close settings"
                    tabIndex={0}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  {/* Enable/Disable Auto-Sync */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Auto-Sync
                      </h4>
                      <p className="text-sm text-gray-500">
                        Automatically sync data with backend
                      </p>
                    </div>
                    <button
                      onClick={handleToggleSync}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        syncEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      role="switch"
                      aria-checked={syncEnabled}
                      tabIndex={0}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          syncEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Enable/Disable Notifications */}
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Sync Notifications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Show toast notifications when data syncs
                      </p>
                    </div>
                    <button
                      onClick={handleToggleNotifications}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        showSyncNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      role="switch"
                      aria-checked={showSyncNotifications}
                      tabIndex={0}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showSyncNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Manual Sync Button */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      forceSync();
                      onClose();
                    }}
                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    tabIndex={0}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    <span>Sync Now</span>
                  </button>
                </div>

                {/* Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 Auto-sync keeps your data updated across all devices. Data is checked every 30-45 seconds when enabled.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

