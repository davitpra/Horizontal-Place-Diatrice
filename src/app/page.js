'use client'
import { TableMap } from "./components/TableMap";
import { TableModal } from "./components/TableModal";
import Title from "./components/Title";
import { Wraper } from "./components/Wraper";
import {residents} from './data/residents';
import { useSeatingConfigure } from "./hooks/useSeatingConfigure";

export default function Home() {
  
  const seating = useSeatingConfigure((state) => state.seating);

  let seatingMessage;
  let residentOnSetting
  switch (seating) {
    case 1:
      seatingMessage = "First Seating";
      residentOnSetting = residents.filter((resident) => resident.seating === 1);
      break;
    case 2:
      seatingMessage = "Second Seating";
      residentOnSetting = residents.filter((resident) => resident.seating === 2);
      break;
    default:
      seatingMessage = "First Seating";
      residentOnSetting = residents.filter((resident) => resident.seating === 1);
  }

  const observations =[
    "The chair positions may not be correct",
    "The red chairs are for prioritary residents",
  ]

  return (
  <>
    <h1 className="text-center pb-2 font-medium">{seatingMessage}</h1>
    <TableModal residents={residentOnSetting} />
    <Title title={"Notes"} observations={observations} className="mb-4"/>
    <TableMap residents={residentOnSetting} />
  </>
  );
}
