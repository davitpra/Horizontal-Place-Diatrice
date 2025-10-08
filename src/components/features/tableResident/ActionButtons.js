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
      <td className="relative whitespace-nowrap py-5 pl-3 text-center text-sm">
        <FolderOpenIcon
          className="h-8 w-8"
          onClick={() => onOpenInfo(resident, index)}
        />
      </td>
      <td className="relative whitespace-nowrap py-5 px-3 text-center text-sm">
        <div className="flex justify-center">
          {isComplete ? (
            <CheckCircleIcon
              className="h-8 w-8 text-green-500"
              onClick={onComplete}
            />
          ) : (
            <EllipsisHorizontalCircleIcon
              className="h-8 w-8 text-gray-400"
              onClick={onComplete}
            />
          )}
        </div>
      </td>
      <td className="relative whitespace-nowrap py-5 pl-3 text-center text-sm">
        <FolderPlusIcon
          className="h-8 w-8"
          onClick={() => onChangeSelection(resident, index)}
        />
      </td>
    </>
  );
};

export default ActionButtons;
