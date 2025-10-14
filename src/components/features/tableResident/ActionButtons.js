"use client";
import { CheckCircleIcon, EllipsisHorizontalCircleIcon, FolderOpenIcon, FolderPlusIcon, XCircleIcon } from "@heroicons/react/24/outline";

const ActionButtons = ({
  resident,
  index,
  went_out_to_eat,
  isComplete,
  onComplete,
  onOpenInfo,
  onChangeSelection,
}) => {
  return (
    <>
      <td className="whitespace-nowrap py-5">
        <div className="flex justify-center">
          <FolderOpenIcon
            disabled={went_out_to_eat}
            className="h-8 w-8"
            onClick={() => onOpenInfo(resident, index)}
          />
        </div>
      </td>
      <td className="whitespace-nowrap py-5 px-3">
        <div className="flex justify-center">
          {went_out_to_eat ? (
            <XCircleIcon
              className="h-8 w-8 text-red-500"
            />
          ) : (
            isComplete ? (
              <CheckCircleIcon
                className="h-8 w-8 text-green-500"
                onClick={onComplete}
              />
            ) : (
              <EllipsisHorizontalCircleIcon
                className="h-8 w-8 text-gray-400"
                onClick={onComplete}
              />
            ))}
        </div>
      </td>
      <td className="whitespace-nowrap py-5">
        <div className="flex justify-center">
          <FolderPlusIcon
            disabled={went_out_to_eat}
            className="h-8 w-8"
            onClick={() => onChangeSelection(resident, index)}
          />
        </div>
      </td>
    </>
  );
};

export default ActionButtons;
