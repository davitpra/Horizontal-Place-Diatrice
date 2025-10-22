"use client";
import { UserIcon } from "@heroicons/react/24/outline";

const ResidentInfo = ({ resident, mealInfo }) => {
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const guidelines = resident.Guidelines?.split('\n').map(guideline => guideline.trim()) || [];
  return (
    <div className="flex">
      <div className="size-11 shrink-0">
        {resident.Picture?.url ? (
          <img
            alt={`${resident.full_name} image`}
            src={`${host}${resident.Picture.formats.thumbnail.url}`}
            className="size-11 rounded-full"
          />
        ) : (
          <UserIcon className="size-11 rounded-full" strokeWidth={0.2} />
        )}
      </div>
      <div className="ml-4">
        <div className="font-medium text-gray-900">{resident.full_name}</div>
        <div className="mt-1 text-gray-500">Room {resident.roomId}
          {mealInfo?.onTray && !mealInfo?.went_out_to_eat &&<span className="ml-2 rounded-md bg-yellow-400/10 px-1.5 py-0.5 text-xs font-medium text-yellow-500 inset-ring inset-ring-yellow-400/20">
            on tray
          </span>}
          {mealInfo?.went_out_to_eat && <span className="ml-2 rounded-md bg-red-400/10 px-1.5 py-0.5 text-xs font-medium text-red-500 inset-ring inset-ring-red-400/20">
            Out 
          </span>}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
        {resident.Guidelines &&
          guidelines.map((guideline, index) => (
            <div key={index} className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-800 inset-ring inset-ring-blue-600/20">
              {guideline}
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};

export default ResidentInfo;
