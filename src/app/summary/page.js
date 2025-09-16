"use client";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { getDayLunchs } from "@/strapi/meals/lunch/getDayLunchs";
import { date } from "@/constants/date";
import { useEffect, useState } from "react";
import { getMenuSchedule } from "@/strapi/menuSchedule/getMenuSchedule";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { MEAL_OPTIONS } from "@/constants/mealOption";

export default function Summary() {
  const [meals, setMeals] = useState([]);
  const [menuOptions, setMenuOptions] = useState({});
   const LUNCH = MEAL_OPTIONS[1] // LUNCH es el segundo elemento del array

  const [rawMeals, setRawMeals] = useState([]);

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    async function fetchData() {
      // Fetch meals
      const fetchedMeals = await getDayLunchs(date);
      const meals = fetchedMeals.map((meal) =>meal.meals).flat();
      setRawMeals(meals || []);

      // Fetch menu options
      const fetchedMenuOptions = await getMenuSchedule(date);
      const menuData = fetchedMenuOptions[0]?.data || {};
      setMenuOptions(menuData);
    }

    fetchData();
  }, []);

  // Efecto para calcular las estadísticas cuando cambian los datos
  useEffect(() => {
    if (rawMeals.length > 0 && Object.keys(menuOptions).length > 0) {
      const stats = calculateMealStats(rawMeals);
      setMeals(stats);
    }
  }, [rawMeals, menuOptions]);

  // Filter out drink options from LUNCH for meal preference statistics
  const LUNCH_WITHOUT_DRINKS = LUNCH.filter(
    (item) =>
      ![
        "water",
        "Hotdrink",
        "Juice",
        "Milk",
        "additionals",
        "Comment",
      ].includes(item.key)
  );
   
   const combinedMenu = LUNCH_WITHOUT_DRINKS.map(item => {
     console.log(`Processing ${item.key}:`, menuOptions[item.key]);
     return {
       key: item.key,
       description: menuOptions[item.key] || "No option available"
     };
   });

  // Function to calculate meal preference statistics
  const calculateMealStats = (meals) => {
    if (!meals?.length) return [];

    // Initialize statistics object based on LUNCH array
    const mealPreferences = {};

    combinedMenu.forEach(({ key, description }) => {
      // Initialize the preference counter for this key
      mealPreferences[key] = {
        description: description,
        completed: 0,
        total: 0,
      };
    });

    // Count preferences
    meals.forEach((meal) => {
      combinedMenu.forEach(({ key }) => {
        const value = meal[key];
        if (value && value !== "none") {
          mealPreferences[key].total += 1;
          // A meal is completed if it has a specific option selected
          if (value !== "") {
            mealPreferences[key].completed += 1;
          }
        }
      });
    });

    // Convert to array format for table
    return Object.entries(mealPreferences).map(([preference, stats]) => ({
      preference,
      description: stats.description,
      totalAmount: stats.total,
      completed: stats.completed,
      toComplete: stats.total - stats.completed,
    }));
  };

  const observations = [
    "Overview of the meals being served, meal preferences and dietary needs.",
  ];

  return (
    <>
      <Title title={"Summary"} observations={observations} />
      <MealBar />
      <Wraper>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 text-center text-sm font-semibold text-gray-900 "
                    >
                      Serve
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Total amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Completed
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      To complete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {meals.length > 0 ? (
                    meals.map((stat) => (
                      <tr key={stat.preference}>
                        <td className="py-3.5 pr-3 text-center text-sm font-medium text-gray-900">
                          {stat.preference}
                        </td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                          {stat.description}
                        </td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                          {stat.totalAmount}
                        </td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                          {stat.completed}
                        </td>
                        <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                          {stat.toComplete}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-3.5 text-center text-sm text-gray-900"
                      >
                        No meal data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Wraper>
    </>
  );
}
