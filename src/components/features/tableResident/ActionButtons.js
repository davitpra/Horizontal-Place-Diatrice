"use client";
import { FolderOpenIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

const ActionButtons = ({
  resident,
  index,
  isComplete,
  onComplete,
  onOpenInfo,
  onChangeSelection,
}) => {
  return (
    <>
      <td className="hidden sm:block whitespace-nowrap px-3 py-2 text-sm text-gray-500">
        <button
          onClick={() => onOpenInfo(resident, index)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          View all..
        </button>
      </td>
      <td className="sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <FolderOpenIcon
          className="h-6 w-6"
          onClick={() => onOpenInfo(resident, index)}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <button
          type="button"
          onClick={onComplete}
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            isComplete
              ? "bg-green-50 text-green-700 ring-green-600/20"
              : "bg-gray-50 text-gray-700 ring-gray-600/20"
          }`}
        >
          {isComplete ? "Complete" : "No Complete"}
        </button>
      </td>
      <td className="relative whitespace-nowrap py-5 pl-3 pr-2 text-right text-sm font-medium sm:pr-0">
        <button
          type="button"
          className="hidden sm:block text-indigo-600 hover:text-indigo-900"
          onClick={() => onChangeSelection(resident,index)}
        >
          Change Selection
          <span className="sr-only">, {resident.full_name}</span>
        </button>
        <FolderPlusIcon
          className="sm:hidden h-6 w-6"
          onClick={() => onChangeSelection(resident, index)}
        />
      </td>
    </>
  );
};

export default ActionButtons;
