import { getAllResidents} from "@/lib/getAllResidents";
import { MealBar } from "../components/MealBar";
import { ServingModal } from "../components/ServingModal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import Title from "../components/Title";
import {residents as rawData} from '../data/residents';
import { useGetFormattedDate } from "@/hooks/useGetFormattedDate";
import { getDayMenus } from "@/lib/getDayMenus";
import { createMenus } from "@/lib/createMenus";

export default async function Home() {

  // let date = useGetFormattedDate();
  const date = "2025-02-15";
  let residents = [];
  try {
    residents = await getAllResidents();

    // Check if the menus for the day have been created for each resident and create them if they don't exist
    for (const resident of residents) {
      const dayMenus = await getDayMenus(date);
      const menuExists = dayMenus.data.some(menu => menu.slug.includes(resident.slug));
      if (!menuExists) {
        await createMenus({ date, full_name: resident.full_name, documentId: resident.documentId });
        console.log(`Menus created for ${resident.full_name}`);
      }
    }

    
  } catch (error) {
    residents = rawData;
  }


  const observations =[
    "The chair positions may not be correct",
  ]

  return (
  <>
    <ServingModal residents={residents}/>
    <MealBar />
    <TableMap residents={residents} />
    <Title observations={observations} className="mb-4"/>
  </>
  );
}
