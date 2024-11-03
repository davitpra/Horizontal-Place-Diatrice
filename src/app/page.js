import Image from "next/image";
import { TableMap } from "./components/TableMap";
import { TableModal } from "./components/TableModal";

export default function Home() {
  const residents = [
    {
      name: "Juan",
      table: 1,
    },
    {
      name: "Angelica",
      table: 1,
    },
    {
      name: "David",
      table: 1,
    },
    {
      name: "Juan",
      table: 1,
    },
    {
      name: "Otro Pedro",
      table: 2,
    },
    {
      name: "Pedro",
      table: 2,
    }, 
    {
      name: "Maria",
      table: 3,
    },
    {
      name: "Maria",
      table: 3,
    },
    {
      name: "Maria",
      table: 3,
    },
    {
      name: "Maria",
      table: 12,
    }
  ]
  

  return (
  <>
    <TableModal />
    <TableMap residents={residents} />
  </>
  );
}
