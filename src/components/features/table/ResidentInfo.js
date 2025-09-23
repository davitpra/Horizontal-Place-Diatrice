"use client";
import { UserIcon } from "@heroicons/react/24/outline";

const ResidentInfo = ({ resident }) => {
  return (
    <div className="flex items-center">
      <div className="size-11 shrink-0">
        {resident.Picture?.url ? (
          <img
            alt={`${resident.full_name} image`}
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${resident.Picture.url}`}
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
