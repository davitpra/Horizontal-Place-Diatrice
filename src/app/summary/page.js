"use client";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { useEffect, useState } from "react";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { useCalculateMealStats } from "@/hooks/utils/useCalculateMealStats";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";

export default function Summary() {
  const [meals, setMeals] = useState([]); // Estado para almacenar las estadísticas de las comidas
  const [menuOptions, setMenuOptions] = useState({}); // Estado para almacenar las opciones del menu
  const [rawMeals, setRawMeals] = useState([]);

  const mealStore = useMealsStore(state => state.meals);
  const { breakfast, lunch, supper } = mealStore;
  const menuSchedule = useMenuScheduleStore(state => state.menuSchedule);

  const mealNumber = useMealBar(state => state.mealNumber);


  // Efecto para cargar las comidas del storage según el número de comida seleccionado
  useEffect(() => {
    const meals = mealNumber === 0? breakfast : mealNumber === 1? lunch : supper;
    const mealsWithComplete = meals.map(meal => 
      meal.meals.map(mealItem => ({
        ...mealItem,
        complete: meal.complete,
      }))
    ).flat();
    setRawMeals(mealsWithComplete || []);

    if (mealNumber > 0) {
      const menuOptions = menuSchedule[mealNumber - 1]?.data || {};
      setMenuOptions(menuOptions);
    } else {
      setMenuOptions({});
    }
  }, [mealNumber]);

  // Efecto para calcular las estadísticas cuando cambian los datos
  useEffect(() => {
    if (rawMeals.length > 0 && Object.keys(menuOptions).length > 0) {
      const stats = useCalculateMealStats(rawMeals, menuOptions, mealNumber);
      setMeals(stats);
    }
  }, [mealNumber, rawMeals, menuOptions]);

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
