'use client'
import { useRouter } from "next/navigation"
import { Wraper } from "./Wraper"
  
  export function Table({residents, description}) {
    const router = useRouter()
    return (
      <Wraper>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Residents</h1>
            <p className="mt-2 text-sm text-gray-700">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Room
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Seating
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Observation
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {residents.map((person) => (
                    <tr key={person.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {person.name} {person.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.roomId}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.seating}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.importantObservation}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <a onClick={()=> router.push(`./room/${person.roomId}`)} className="text-indigo-600 hover:text-indigo-900">
                          Details <span className="sr-only">details</span>
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <a onClick={()=> router.push(`./room/${person.roomId}`)} className="text-indigo-600 hover:text-indigo-900">
                          Add to trays <span className="sr-only">add to trays</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Wraper>
    )
  }
  