"use client";
import { useEffect, useState, useRef } from "react";
import { getAllResidents } from "@/strapi/residents/getAllResidents";
import { residents as rawData } from "@/data/residents";
import { menus as getMenus } from "@/services/meals/menu";
import { breakfasts } from "@/services/meals/breakfast";
import { lunches } from "@/services/meals/lunch";
import { suppers } from "@/services/meals/supper";
import { date } from "@/constants/date";
import { getMenuSchedule } from "@/strapi/menuSchedule/getMenuSchedule";
import { getWeeklyMenu } from "@/strapi/menuSchedule/getWeeklyMenu";
import { useMealsStore } from "@/store/meals/useMealsStore";
import { useResidentsStore } from "@/store/residents/useResidentsStore";
import { useDayMenusStore } from "@/store/meals/useDayMenusStore";
import { useMenuScheduleStore } from "@/store/meals/useMenuScheduleStore";
import { useWeeklyMenuStore } from "@/store/meals/useWeeklyMenuStore";

export function InitialDataProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const hasLoadedOnce = useRef(false);
  
  // Get store setters
  const setMeal = useMealsStore((state) => state.setMeal);
  const setResidents = useResidentsStore((state) => state.setResidents);
  const setDayMenus = useDayMenusStore((state) => state.setDayMenus);
  const setMenuSchedule = useMenuScheduleStore((state) => state.setMenuSchedule);
  const setWeeklyMenu = useWeeklyMenuStore((state) => state.setWeeklyMenu);
  
  // Get store data to check if we already have data
  const existingMeals = useMealsStore((state) => state.meals);
  const existingResidents = useResidentsStore((state) => state.residents);

  useEffect(() => {
    let isMounted = true;
    
    // Check if we already have valid data in stores (from sessionStorage)
    const hasValidData = 
      existingResidents.length > 0 && 
      (existingMeals.breakfast.length > 0 || 
       existingMeals.lunch.length > 0 || 
       existingMeals.supper.length > 0);
    
    // Skip loading if we already loaded once and have valid data
    if (hasLoadedOnce.current && hasValidData) {
      console.log('[InitialDataProvider] ✅ Using cached data from stores');
      setIsLoading(false);
      return;
    }
    
    async function loadInitialData() {
      try {
        console.log(`[InitialDataProvider] 🚀 Starting data load for date: ${date}`);
        setError(null);
        
        // Step 1: Get residents (20% progress)
        setLoadingProgress(10);
        const residents = await getAllResidents();
        if (!isMounted) return;
        
        // Validate residents data
        if (!Array.isArray(residents) || residents.length === 0) {
          throw new Error('No residents data received from API');
        }
        
        setResidents(residents);
        setLoadingProgress(20);
        console.log(`[InitialDataProvider] ✅ Residents loaded: ${residents.length}`);
        
        // Step 2: Create/get menus (40% progress)
        const menus = await getMenus(residents, date);
        if (!isMounted) return;
        
        // Validate menus data
        if (!Array.isArray(menus)) {
          throw new Error('Invalid menus data received');
        }
        
        setDayMenus(menus);
        setLoadingProgress(40);
        console.log(`[InitialDataProvider] ✅ Menus ready: ${menus.length}`);
        
        // Step 3: Get menu schedule and weekly menu (50% progress) - can run in parallel with meals
        const menuSchedulePromise = getMenuSchedule(date).then(schedule => {
          if (isMounted) {
            setMenuSchedule(schedule);
            console.log(`[InitialDataProvider] ✅ Menu schedule loaded`);
          }
          return schedule;
        });

        const weeklyMenuPromise = getWeeklyMenu().then(weeklyMenu => {
          if (isMounted) {
            setWeeklyMenu(weeklyMenu);
            console.log(`[InitialDataProvider] ✅ Weekly menu loaded: ${weeklyMenu.length} items`);
          }
          return weeklyMenu;
        });
        
        // Step 4: Create meals in parallel (50-90% progress)
        setLoadingProgress(50);
        const [breakFast, lunch, supper] = await Promise.all([
          breakfasts(residents, date, menus),
          lunches(residents, date, menus),
          suppers(residents, date, menus)
        ]);

        if (!isMounted) return;
        
        // Validate meals data
        if (!Array.isArray(breakFast) || !Array.isArray(lunch) || !Array.isArray(supper)) {
          throw new Error('Invalid meals data structure received');
        }
        
        // Update meal stores
        setMeal('breakfast', breakFast);
        setMeal('lunch', lunch);
        setMeal('supper', supper);
        setLoadingProgress(90);
        console.log(`[InitialDataProvider] ✅ Meals loaded - B:${breakFast.length} L:${lunch.length} S:${supper.length}`);
        
        // Wait for menu schedule and weekly menu if not done
        await Promise.all([menuSchedulePromise, weeklyMenuPromise]);
        
        setLoadingProgress(100);
        console.log(`[InitialDataProvider] 🎉 All data loaded successfully`);
        
        // Mark that we've successfully loaded once
        hasLoadedOnce.current = true;

      } catch (error) {
        console.error("[InitialDataProvider] ❌ Error loading initial data:", error);
        
        // Set error state for UI feedback
        if (isMounted) {
          setError(error.message || 'Failed to load initial data');
          
          // Set fallback data if available
          if (rawData && Array.isArray(rawData) && rawData.length > 0) {
            console.log('[InitialDataProvider] 📦 Using fallback data');
            setResidents(rawData);
          }
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
    // Remove 'date' from dependencies as it's a constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResidents, setDayMenus, setMenuSchedule, setWeeklyMenu, setMeal]);

  // Show error state with option to retry
  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md w-full px-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
