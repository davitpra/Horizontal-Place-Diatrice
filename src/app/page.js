'use client'
import { MealBar } from "../components/MealBar";
import { Modal } from "../components/Modal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import { TableModal } from "../components/TableModal";
import Title from "../components/Title";
import {residents} from '../data/residents';
import { useSeatingConfigure } from "./hooks/useSeatingConfigure";

export default function Home() {
  
  const seating = useSeatingConfigure((state) => state.seating);

  let seatingMessage = "";
  let residentOnSetting = [];

  if (seating === 1) {
    residentOnSetting = residents.filter((resident) => resident.seating === 1);
  }

  if (seating === 2) {  
    residentOnSetting = residents.filter((resident) => resident.seating === 2);
  }

  const observations =[
    "The chair positions may not be correct",
  ]

  return (
  <>
    {/* <TableModal residents={residentOnSetting} /> */}
    <Modal residents={residentOnSetting}/>
    <MealBar />
    <TableMap residents={residentOnSetting} />
    <Title observations={observations} className="mb-4"/>
  </>
  );
}
