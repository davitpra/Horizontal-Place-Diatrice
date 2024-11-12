import React from "react";
import { residents } from "../../data/residents";
import { Wraper } from "@/app/components/Wraper";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TabGroup,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { UserIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";


async function roomId({ params }) {
  const { roomId } = await params;
  const resident = residents.filter(
    (resident) => resident.roomId === Number(roomId)
  );

  const fullName = `${resident[0].name} ${resident[0].lastName}`;
  const Breakfast = resident[0].meals[0];
  const Lunch = resident[0].meals[1];
  const Dinner = resident[0].meals[2];

  return (
    <Wraper>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <TabGroup className="flex flex-col-reverse">
              <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                <TabPanel>
                  {resident[0].image ? (
                    <img
                      alt={`${fullName} image`}
                      src={resident[0].image}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  ) : (
                    <UserIcon
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                      strokeWidth={0.2}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </TabGroup>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="flex flex-col sm:flex-row sm:justify-evenly">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {fullName}
                </h1>
                <p className="hidden sm:inline text-3xl font-bold tracking-tight text-gray-900">
                  -
                </p>
                <h2 className="sm:text-2xl font-bold tracking-tight text-gray-900">
                  Room {roomId}
                </h2>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold pb-4">Observations</h3>

                <div className="space-y-6 text-base text-gray-700">
                  <ul className="space-y-2 list-disc list-inside">
                    {resident[0].observations.map((observation, key) => (
                      <li key={key}>{observation}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Meals details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                    {/* Breakfast */}
                    <Disclosure  as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                            Breakfast
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="prose prose-sm pb-6">
                        <div>
                          <div className="mt-2 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                              {Object.entries(Breakfast).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="py-2 grid grid-cols-3 gap-4 px-0"
                                >
                                  <dt className="text-sm/6 font-medium text-gray-900">
                                    {key}
                                  </dt>
                                  <dd className="text-sm/6 text-gray-700 col-span-2 mt-0">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                    {/* Lunch */}
                    <Disclosure  as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                            Lunch
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="prose prose-sm pb-6">
                        <div>
                          <div className="mt-2 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                              {Object.entries(Lunch).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="py-2 grid grid-cols-3 gap-4 px-0"
                                >
                                  <dt className="text-sm/6 font-medium text-gray-900">
                                    {key}
                                  </dt>
                                  <dd className="text-sm/6 text-gray-700 col-span-2 mt-0">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                    {/* Dinner */}
                    <Disclosure  as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                            Dinner
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="prose prose-sm pb-6">
                        <div>
                          <div className="mt-2 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                              {Object.entries(Dinner).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="py-2 grid grid-cols-3 gap-4 px-0"
                                >
                                  <dt className="text-sm/6 font-medium text-gray-900">
                                    {key}
                                  </dt>
                                  <dd className="text-sm/6 text-gray-700 col-span-2 mt-0">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Wraper>
  );
}

export default roomId;
