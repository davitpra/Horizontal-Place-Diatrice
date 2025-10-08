"use client";
import { useEffect, useState } from "react";
import { getAllResidents } from "@/strapi/residents/getAllResidents";
import { residents as rawData } from "@/data/residents";
import { useCreateMenus } from "@/hooks/meals/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/meals/useCreateBreakfast";
import { useCreateLunch } from "@/hooks/meals/useCreateLunch";
import { useCreateSupper } from "@/hooks/meals/useCreateSupper";
import { date } from "@/constants/date";
import { getMenuSchedule } from "@/strapi/menuSchedule/getMenuSchedule";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { Loading } from "@/components/ui/Loading";

// Helper function to add delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function InitialDataProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Get store setters
  const setMeal = useMealsStore((state) => state.setMeal);
  const setResidents = useResidentsStore((state) => state.setResidents);
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);
  const setMenuSchedule = useMenuScheduleStore((state) => state.setMenuSchedule);

  useEffect(() => {
    let isMounted = true;
    
    async function loadInitialData() {
      try {
        console.log(`[InitialDataProvider] 🚀 Starting data load for date: ${date}`);
        
        // Step 1: Get residents (20% progress)
        setLoadingProgress(10);
        const residents = await getAllResidents();
        if (!isMounted) return;
        setResidents(residents);
        setLoadingProgress(20);
        console.log(`[InitialDataProvider] ✅ Residents loaded: ${residents.length}`);
        
        // Step 2: Create/get menus (40% progress)
        const menus = await useCreateMenus(residents, date);
        if (!isMounted) return;
        setDayMenus(menus);
        setLoadingProgress(40);
        console.log(`[InitialDataProvider] ✅ Menus ready: ${menus.length}`);
        
        // Step 3: Get menu schedule (50% progress) - can run in parallel with meals
        const menuSchedulePromise = getMenuSchedule(date).then(schedule => {
          if (isMounted) {
            setMenuSchedule(schedule);
            console.log(`[InitialDataProvider] ✅ Menu schedule loaded`);
          }
          return schedule;
        });
        
        // Step 4: Create meals in parallel (50-90% progress)
        setLoadingProgress(50);
        const [breakFast, lunch, supper] = await Promise.all([
          useCreateBreakfast(residents, date, menus),
          useCreateLunch(residents, date, menus),
          useCreateSupper(residents, date, menus)
        ]);

        if (!isMounted) return;
        
        // Update meal stores
        setMeal('breakfast', breakFast);
        setMeal('lunch', lunch);
        setMeal('supper', supper);
        setLoadingProgress(90);
        console.log(`[InitialDataProvider] ✅ Meals loaded - B:${breakFast.length} L:${lunch.length} S:${supper.length}`);
        
        // Wait for menu schedule if not done
        await menuSchedulePromise;
        
        setLoadingProgress(100);
        console.log(`[InitialDataProvider] 🎉 All data loaded successfully`);

      } catch (error) {
        console.error("[InitialDataProvider] ❌ Error loading initial data:", error);
        // Set fallback data if available
        if (isMounted) {
          setResidents(rawData);
        }
      } finally {
        if (isMounted) {
          // Small delay to show 100% before hiding loading
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 150);
        }
      }
    }

    loadInitialData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [date, setResidents, setDayMenus, setMenuSchedule, setMeal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md w-full px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-base mb-4">Loading data...</p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return children;
}
