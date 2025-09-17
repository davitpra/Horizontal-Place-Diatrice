"use client";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { getDayLunchs } from "@/strapi/meals/lunch/getDayLunchs";
import { date } from "@/constants/date";
import { useEffect, useState } from "react";
import { getMenuSchedule } from "@/strapi/menuSchedule/getMenuSchedule";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useCalculateMealStats } from "@/hooks/utils/useCalculateMealStats";
import { useMealsStore } from "@/store/meals/useMealsStore";

export default function Summary() {
  const [meals, setMeals] = useState([]); // Estado para almacenar las estadísticas de las comidas
  const [menuOptions, setMenuOptions] = useState({}); // Estado para almacenar las opciones del menu
  const [rawMeals, setRawMeals] = useState([]);

  const mealStore = useMealsStore(state => state.meals);
  const { breakfast, lunch, supper } = mealStore;

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    async function fetchData() {
      // Fetch meals
      const fetchedMeals = await getDayLunchs(date);
      const meal = fetchedMeals.map((meal) => 
        meal.meals.map(mealItem => ({
          ...mealItem,
          complete: meal.complete,
        }))
      ).flat();
      setRawMeals(meal || []);

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
      const stats = useCalculateMealStats(rawMeals, menuOptions);
      setMeals(stats);
    }
  }, [rawMeals, menuOptions]);

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
