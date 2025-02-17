import { getAllResidents} from "@/lib/getAllResidents";
import { MealBar } from "../components/MealBar";
import { ServingModal } from "../components/ServingModal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import Title from "../components/Title";
import {residents as rawData} from '../data/residents';
import { useCreateMenus } from "@/hooks/useCreateMenus";

export default async function Home() {

  let residents = [];
  try {
    residents = await getAllResidents();
    useCreateMenus(residents);

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
