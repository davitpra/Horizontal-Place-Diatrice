import { getAllResidents} from "@/lib/get-all-residents";
import { MealBar } from "../components/MealBar";
import { Modal } from "../components/Modal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import { TableModal } from "../components/TableModal";
import Title from "../components/Title";
import {residents} from '../data/residents';
import { useSeatingConfigure } from "./hooks/useSeatingConfigure";

export default async function Home() {

  const residentOnSetting = await getAllResidents();
  console.log(residentOnSetting);

  const observations =[
    "The chair positions may not be correct",
  ]

  return (
  <>
    <TableModal residents={residentOnSetting} />
    {/* <Modal residents={residentOnSetting}/> */}
    <MealBar />
    <TableMap residents={residentOnSetting} />
    <Title observations={observations} className="mb-4"/>
  </>
  );
}
