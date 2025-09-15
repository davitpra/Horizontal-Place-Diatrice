'use client'

import { useMealBar } from "@/hooks/useMealBar"

const tabs = [
    { name: 'Breakfast', number: 0},
    { name: 'Lunch', number: 1},
    { name: 'Supper', number: 2},
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export function MealBar() {

    const meal = useMealBar()

    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            defaultValue={tabs.find((tab) => tab.number === meal.mealNumber).name}
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => meal.onSelect(tabs.find((tab) => tab.name === e.target.value).number)}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav aria-label="Tabs" className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={classNames(
                    tab.number === meal.mealNumber
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium',
                  )}
                  onClick={() => meal.onSelect(tab.number)}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    )
  }
  