"use client";
import { useRouter } from "next/navigation";
import { Wraper } from "./Wraper";
import {
  UserIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useTrays } from "../app/hooks/useTrays";
import { useState, useEffect } from "react";

export function Table({ residents }) {
  const router = useRouter();
  const trays = useTrays();

  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedResidents, setSortedResidents] = useState(residents);

  const [traysRooms, setTraysRooms] = useState([]);
  const [isOnTrays, setIsOnTrays] = useState(() => () => false);

  useEffect(() => {
    setSortedResidents(sortedResidents);
  }, [sortedResidents]);

  
  useEffect(() => {
    const ids = trays.trays.map((tray) => tray.roomId);
    setTraysRooms(ids);
    setIsOnTrays(() => (roomId) => ids.includes(roomId));
  }, [trays.trays]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortResidents = (criteria) => {
    const sorted = [...sortedResidents].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[criteria] > b[criteria] ? 1 : -1;
      } else {
        return a[criteria] < b[criteria] ? 1 : -1;
      }
    });
    setSortedResidents(sorted);
  };

  const direction = (criteria) => {
    if (sortDirection === "asc") {
      return <ChevronDownIcon className="h-4 w-4 text-gray-500" onClick={() => {
        toggleSortDirection()
        sortResidents(criteria)
      } }
      />;
    } else {
      return <ChevronUpIcon className="h-4 w-4 text-gray-500" onClick={() => {
        toggleSortDirection()
        sortResidents(criteria)
      } }
      />;;
    }
  }
  

  return (
    <Wraper>
      <div className="flow-root">
        <div className="-mx-4 -my-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    <div className="flex justify-evenly">
                      Name
                      {direction("name")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left font-semibold text-gray-900"
                  >
                    <div className="flex justify-evenly">
                      Room
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:inline px-3 py-3.5 text-left font-semibold text-gray-900"
                  >
                    <div className="flex justify-evenly">
                      Seating
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left font-semibold text-gray-900"
                  >
                    Observation
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedResidents.map((person) => (
                  <tr key={person.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    <div className="sm:hidden">
                      {person.name} {person.lastName.charAt(0)}.
                      </div>
                      <div className="hidden sm:inline">
                      {person.name} {person.lastName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                      {person.roomId}
                    </td>
                    <td className="hidden sm:inline whitespace-nowrap px-3 py-4 text-gray-500">
                      {person.seating}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                      {person.importantObservation}
                    </td>
                    <td className={`relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8 ${isOnTrays(person.roomId) ? "text-green-600 hover:text-green-900" : "text-indigo-600 hover:text-indigo-900"}`}>
                      <a
                        onClick={() => router.push(`./room/${person.roomId}`)}
                        className="hidden sm:inline "
                      >
                        Details <span className="sr-only">details</span>
                      </a>
                      <UserIcon
                        className="sm:hidden h-4 w-4"
                        onClick={() => router.push(`./room/${person.roomId}`)}
                      />
                    </td>
                    <td className={`relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-medium sm:pr-6 lg:pr-8 ${isOnTrays(person.roomId) ? "text-green-600 hover:text-green-900" : "text-indigo-600 hover:text-indigo-900"}`}>
                      <a
                        onClick={() => trays.addToTrays(person.roomId)}
                        className="hidden sm:inline"
                      >
                        Add to trays{" "}
                        <span className="sr-only">add to trays</span>
                      </a>
                      <PlusCircleIcon
                        onClick={() => trays.addToTrays(person.roomId)}
                        className="sm:hidden h-4 w-4"
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
