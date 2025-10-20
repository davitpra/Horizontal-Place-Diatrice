"use client";
import { useSyncContext } from '@/components/providers/SyncProvider';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * SyncIndicator - Shows sync status and provides manual sync button
 */
export const SyncIndicator = ({ className = '' }) => {
  const { isSyncing, forceSync } = useSyncContext();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sync Status */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        {isSyncing && (
          <>
            <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-600">Syncing...</span>
          </>
        ) }
      </div>

      {/* Manual Sync Button */}
      <button
        onClick={forceSync}
        disabled={isSyncing}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Sync data manually"
        tabIndex={0}
      >
        <ArrowPathIcon className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>Sync</span>
      </button>
    </div>
  );
};

