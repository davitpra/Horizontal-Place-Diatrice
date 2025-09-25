"use client";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { Wraper } from "@/components/ui/Wraper";
import { Table, TableHead, TableBody, EmptyRow } from "@/components/features/tableInfo/Table";
import { useEffect, useMemo, useState } from "react";
import { useMealBar } from "@/store/mealBar/useMealBar";
import { calculateMealStats } from "@/hooks/utils/calculateMealStats";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";
import { useSeatingConfigure } from "@/store/seating/useSeatingConfigure";

export default function Summary() {
  // Store para obtener las comidas y el menu schedule
  const mealStore = useMealsStore(state => state.meals);
  const { breakfast, lunch, supper } = mealStore;
  const dayMenusStore = useDayMenusStore(state => state.dayMenus);
  const menuSchedule = useMenuScheduleStore(state => state.menuSchedule);

  const [meals, setMeals] = useState([]); // Estado para almacenar las estadísticas de las comidas
  const [menuOptions, setMenuOptions] = useState({}); // Estado para almacenar las opciones del menu
  const [rawMeals, setRawMeals] = useState([]); // Estado para calcular las comidas completadas. 

  // Store para obtener el número de comida seleccionado 
  const mealNumber = useMealBar(state => state.mealNumber);
  const selectedSeating = useSeatingConfigure((state) => state.seating);

  const menusInSeating = useMemo(() => {
    return dayMenusStore.filter(menu => menu.Seating === selectedSeating);
  }, [dayMenusStore, selectedSeating]);

  const mealsInSeating = useMemo(() => {
    return menusInSeating.map(menu =>{
      if (mealNumber === 0) {
        return menu.breakfast;
      } else if (mealNumber === 1) {
        return menu.lunch;
      } else {
        return menu.supper;
      }
    });
  }, [menusInSeating, mealNumber]);

  // Efecto para cargar las comidas del storage según el número de comida seleccionado
  useEffect(() => {
    // Obtener las comidas del store del menú seleccionado
    const meals = mealNumber === 0 ? breakfast : mealNumber === 1 ? lunch : supper;

    // Encontrar las comidas que coinciden con los documentIds de las comidas en el seating
    const matchingMeals = meals.filter(meal => 
      mealsInSeating.some(seatingMeal => seatingMeal.documentId === meal.documentId)
    );

    const mealsWithComplete = matchingMeals.map(meal =>
      meal.meals.map(mealItem => ({
        ...mealItem,
        complete: meal.complete,
      }))
    ).flat();
    // Setear las comidas con el estado de complete.
    setRawMeals(mealsWithComplete || []);

    // Configurar menuOptions basado en el mealNumber
    if (mealNumber > 0) {
      const menuOptions = menuSchedule[mealNumber - 1]?.data || {};
      setMenuOptions(menuOptions);
    } else {
      // Para breakfast (mealNumber === 0), usar el primer elemento del menuSchedule
      const breakfastOptions = menuSchedule[0]?.data || {};
      setMenuOptions(breakfastOptions);
    }
  }, [mealNumber, breakfast, lunch, supper, menuSchedule, dayMenusStore, selectedSeating]);

  // Efecto para calcular las estadísticas cuando cambian los datos
  useEffect(() => {
    if (rawMeals.length > 0 && Object.keys(menuOptions).length > 0) {
      const stats = calculateMealStats(rawMeals, menuOptions, mealNumber);
      setMeals(stats);
    } else {
      setMeals([]);
    }
    console.log("meals", meals);
  }, [mealNumber, rawMeals, menuOptions]);

  const observations = [
    "Overview of the meals being served, meal preferences and dietary needs.",
  ];

  return (
    <>
      <Title title={"Summary"} observations={observations} />
      <MealBar />
      <Wraper>
        <Table>
          <TableHead
            columns={[
              "Serve",
              "Description",
              "Total amount",
              "Completed",
              "To complete",
            ]}
          />
          <TableBody>
            {meals.length > 0 ? (
              meals.map((stat) => (
                <tr key={stat.id}>
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
              <EmptyRow colSpan={5} message="No meal data available" />
            )}
          </TableBody>
        </Table>
      </Wraper>
    </>
  );
}
