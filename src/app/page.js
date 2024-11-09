'use client'
import { TableMap } from "./components/TableMap";
import { TableModal } from "./components/TableModal";
import {residents} from './data/residents';
import { useSeatingConfigure } from "./hooks/useSeatingConfigure";

export default function Home() {
  
  const seating = useSeatingConfigure((state) => state.seating);

  let seatingMessage;
  switch (seating) {
    case 0:
      seatingMessage = "Set up Tables";
      break;
    case 1:
      seatingMessage = "First Seating";
      break;
    case 2:
      seatingMessage = "Second Seating";
      break;
    default:
      seatingMessage = "Unknown Seating";
  }

  return (
  <>
    <h1 className="text-center pb-2 font-medium">{seatingMessage}</h1>
    <TableModal residents={residents} />
    <TableMap residents={residents} />
  </>
  );
}
