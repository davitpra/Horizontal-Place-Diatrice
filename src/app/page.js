'use client'
import { TableMap } from "./components/TableMap";
import { TableModal } from "./components/TableModal";
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

  
  return (
  <>
    <h1 className="text-center pb-2 font-medium">{seatingMessage}</h1>
    <TableModal residents={residentOnSetting} />
    <Wraper>
      <p className="pb-4 2xl:pl-24 xl:pl-0 lg:pl-8 md:pl-4 text-gray-600"><span className="font-semibold">Note: </span> The chair position may not be correct.</p>
    </Wraper>
    <TableMap residents={residentOnSetting} />
  </>
  );
}
