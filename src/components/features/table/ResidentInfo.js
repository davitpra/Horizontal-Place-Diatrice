"use client";
import { UserIcon } from "@heroicons/react/24/outline";

const ResidentInfo = ({ resident, host }) => {
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
        <div className="mt-1 text-gray-500">Room {resident.roomId}</div>
      </div>
    </div>
  );
};

export default ResidentInfo;
