"use client";
import { UserIcon } from "@heroicons/react/24/outline";

const ResidentInfo = ({ resident, mealInfo }) => {
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
  return (
    <div className="flex items-center">
      <div className="size-11 shrink-0">
        {resident.Picture?.url ? (
          <img
            alt={`${resident.full_name} image`}
            src={`${host}${resident.Picture.url}`}
            className="size-11 rounded-full"
          />
        ) : (
          <UserIcon className="size-11 rounded-full" strokeWidth={0.2} />
        )}
      </div>
      <div className="ml-4">
        <div className="font-medium text-gray-900">{resident.full_name}</div>
        <div className="mt-1 text-gray-500">Room {resident.roomId}
          {mealInfo?.onTray && <span className="ml-2 rounded-md bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-800 inset-ring inset-ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:inset-ring-yellow-400/20">
            on tray
          </span>}
        </div>
      </div>
    </div>
  );
};

export default ResidentInfo;
