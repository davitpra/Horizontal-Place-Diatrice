import React from "react";
import { residents } from "../../data/residents";
import { Wraper } from "@/app/components/Wraper";
import { useCallback } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { UserIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const product = {
  name: "Zip Tote Basket",
  price: "$140",
  rating: 4,
  images: [
    {
      id: 1,
      name: "Angled view",
      src: "https://tailwindui.com/plus/img/ecommerce-images/product-page-03-product-01.jpg",
      alt: "Angled front view with bag zipped and handles upright.",
    },
    // More images...
  ],
  colors: [
    {
      name: "Washed Black",
      bgColor: "bg-gray-700",
      selectedColor: "ring-gray-700",
    },
    { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
    {
      name: "Washed Gray",
      bgColor: "bg-gray-500",
      selectedColor: "ring-gray-500",
    },
  ],
  description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
  details: [
    {
      name: "Features",
      items: [
        "Multiple strap configurations",
        "Spacious interior with top zip",
        "Leather handle and tabs",
        "Interior dividers",
        "Stainless strap loops",
        "Double stitched construction",
        "Water-resistant",
      ],
    },
    // More sections...
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

async function roomId({ params }) {
  const { roomId } = await params;
  const resident = residents.filter(
    (resident) => resident.roomId === Number(roomId)
  );

  const fullName = `${resident[0].name} ${resident[0].lastName}`;

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
              <div className="flex justify-evenly">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {fullName}
                </h1>
                <p className="text-3xl font-bold tracking-tight text-gray-900">
                  -
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
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
                  {resident[0].meals.map((meal, key) => (
                    <Disclosure key={key} as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                            {meal.name}
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
                              {Object.entries(meal).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                                >
                                  <dt className="text-sm/6 font-medium text-gray-900">
                                    {key}
                                  </dt>
                                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
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
