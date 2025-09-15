"use client";
import { useRouter } from "next/navigation";
import { Wraper } from "@/components/ui/Wraper";
import { UserIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useTrays } from "@/hooks/useTrays";
import { useEffect, useState } from "react";

export function TableForTrays({ residents }) {
  const router = useRouter();
  const trays = useTrays();

  const [ontrays, setOntrays] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);

  // dDefinir los residentes que están en las bandejas
  useEffect(() => {
    const roomIds = trays.trays.map((tray) => tray.roomId);
    setOntrays(roomIds);
    setFilteredResidents(
      residents.filter((resident) => roomIds.includes(resident.roomId))
    );
  }, [trays.trays, residents]);

  //Actualizar la lista  de residentes en las bandejas
  const onSelection = (roomId, wing) => {
    trays.addToTrays(roomId, wing);
  };

  const getDefaultWing = (roomId) => {
    const tray = trays.trays.find(tray => tray.roomId === roomId);
    return tray ? tray.wing : "East wing";
  }

  return (
    <Wraper>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-2 pr-2 text-left font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900"
                  >
                    Wing
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900"
                  >
                    Observation
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-2 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredResidents.map((person) => (
                  <tr key={person.id}>
                    <td className="whitespace-nowrap py-4 pl-2 pr-2 font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      <div className="sm:hidden">
                      {person.name} {person.lastName.charAt(0)}.
                      </div>
                      <div className="hidden sm:inline">
                      {person.name} {person.lastName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-4 text-gray-500">
                      {person.roomId}
                    </td>
                    <td className="whitespace-nowrap px-2 py-4 text-gray-500">
                      <select
                        id="location"
                        name="location"
                        defaultValue={getDefaultWing(person.roomId)}
                        onChange={(e) => onSelection(person.roomId, e.target.value)}
                        className="hidden mt-2 sm:block w-full rounded-md border-0 py-1.5 pl-2 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                      >
                        <option value="West wing">West wing</option>
                        <option value="East wing">East wing</option>
                      </select>
                      <select
                        id="location"
                        name="location"
                        defaultValue={getDefaultWing(person.roomId)}
                        onChange={(e) => onSelection(person.roomId, e.target.value)}
                        className="sm:hidden  w-full rounded-md border-0 py-1.5 pl-2 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                      >
                        <option value="West wing">Wst</option>
                        <option value="East wing">Est</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-2 py-4 text-gray-500">
                      {person.importantObservation}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
                      <a
                        onClick={() => router.push(`./room/${person.roomId}`)}
                        className="hidden sm:inline text-indigo-600 hover:text-indigo-900"
                      >
                        Details <span className="sr-only">details</span>
                      </a>
                      <UserIcon
                        className="sm:hidden h-4 w-4 text-indigo-600 hover:text-indigo-900"
                        onClick={() => router.push(`./room/${person.roomId}`)}
                      />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right font-medium sm:pr-6 lg:pr-8">
                      <a
                        onClick={() => trays.removeFromTrays(person.roomId)}
                        className="hidden sm:inline text-indigo-600 hover:text-indigo-900"
                      >
                        Remove
                        <span className="sr-only">remove to trays</span>
                      </a>
                      <MinusCircleIcon
                        onClick={() => trays.removeFromTrays(person.roomId)}
                        className="sm:hidden h-4 w-4 text-indigo-600 hover:text-indigo-900"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wraper>
  );
}
