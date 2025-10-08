"use client";
import { useState, useEffect } from "react";
import { getWeeklyMenu } from "@/strapi/menuSchedule/getWeeklyMenu";
import WeeklyMenuGrid from "@/components/features/weeklyMenu/WeeklyMenuGrid";
import { Wraper } from "@/components/ui/Wraper";


export default function WeeklyMenuPage() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      
      try {
        setLoading(true);
        setError(null);
        const data = await getWeeklyMenu();
        setMenuData(data);
      } catch (err) {
        console.error("Error fetching weekly menu:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <Wraper>
        <h1>Weekly Menu</h1>
        <div className="flex h-full flex-col">September 2025</div>
        <WeeklyMenuGrid 
          menuData={menuData}
          loading={loading}
          error={error}
        />
    </Wraper>
  );
}