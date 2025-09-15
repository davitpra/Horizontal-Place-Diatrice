// import { residents } from "../../data/residents";
import { Table } from "../../components/ui/Table";
import Title from "../../components/ui/Title";
import { MealBar } from "../../components/ui/MealBar";
import { getAllResidents } from "@/lib/getAllResidents";

export default async function Room() {
  const observations =[
    "A list of all residents in by the time of made this app including their name, room, seating and observation.",
  ]

  const residents = await getAllResidents();
 
  return (
    <>
      <Title title={"Residents"} observations={observations} />
      <MealBar />
      <Table
        residents={residents}
      />
    </>
  );
}
