'use client'
import { useEffect, useState } from "react";
import { usePreferenceStore } from "@/hooks/usePreferenceStore";
import { ServingModal } from "./ServingModal";
import { MealBar } from "./MealBar";
import { TableMap } from "./TableMap";
import Title from "./Title";

export function Serving({residents}) {

  const date = "2025-02-15";
  const setStorePreferences = usePreferenceStore((state) => state.setPreferences);
  const [preferences, setPreferences] = useState(residents);

  useEffect(() => {
    async function fetchData() {
      try {
        setPreferences(residents);
        setStorePreferences(residents);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, [date, residents]);
    
  const observations = ["The chair positions may not be correct"];
  return (
    <>
      <ServingModal residents={preferences} />
      <MealBar />
      <TableMap residents={preferences} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}

