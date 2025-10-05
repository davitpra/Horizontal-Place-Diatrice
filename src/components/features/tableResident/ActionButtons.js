"use client";
import { CheckCircleIcon, CheckIcon, EllipsisHorizontalCircleIcon, FolderOpenIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

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
      {onOpenInfo && (
        <>
          <td className=" hidden sm:block whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
            <button
              onClick={() => onOpenInfo(resident, index)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              View all..
            </button>
          </td>
          <td className="sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center">
            <FolderOpenIcon
              className="h-6 w-6 mx-auto cursor-pointer"
              onClick={() => onOpenInfo(resident, index)}
            />
          </td>
        </>
      )}
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center">
        <button
          type="button"
          onClick={onComplete}
          className={`hidden sm:inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${isComplete
            ? "bg-green-50 text-green-700 ring-green-600/20"
            : "bg-gray-50 text-gray-700 ring-gray-600/20"
            }`}
        >
          {isComplete ? "Complete" : "No Complete"}
        </button>
        <div className="sm:hidden flex justify-center">
          {isComplete ? (
            <CheckCircleIcon
              className="h-6 w-6 text-green-500"
              onClick={onComplete}
            />
          ) : (
            <EllipsisHorizontalCircleIcon
              className="h-6 w-6 text-gray-400"
              onClick={onComplete}
            />
          )}
        </div>
      </td>
      <td className="relative whitespace-nowrap py-5 pl-3 pr-2 text-right text-sm font-medium sm:pr-0">
        <button
          type="button"
          className="hidden sm:block text-indigo-600 hover:text-indigo-900"
          onClick={() => onChangeSelection(resident, index)}
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
