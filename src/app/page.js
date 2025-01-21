import { getAllResidents} from "@/lib/get-all-residents";
import { MealBar } from "../components/MealBar";
import { ServingModal } from "../components/ServingModal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import Title from "../components/Title";
import {residents} from '../data/residents';

export default async function Home() {

  const residents = await getAllResidents();

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
