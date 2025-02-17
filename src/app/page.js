import { getAllResidents } from "@/lib/getAllResidents";
import { MealBar } from "../components/MealBar";
import { ServingModal } from "../components/ServingModal";
import { Sidebar } from "../components/Sidebar";
import { TableMap } from "../components/TableMap";
import Title from "../components/Title";
import { residents as rawData } from "../data/residents";
import { useCreateMenus } from "@/hooks/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/useCreateBreakfast";

export default async function Home() {
  let residents = [];

    // let date = useGetFormattedDate();
  let date = "2025-02-15";

  try {
    residents = await getAllResidents();
    const menus = await useCreateMenus(residents, date);
    await useCreateBreakfast(residents, date, menus);
  } catch (error) {
    residents = rawData;
    console.log("Error", error);
  }

  const observations = ["The chair positions may not be correct"];

  return (
    <>
      <ServingModal residents={residents} />
      <MealBar />
      <TableMap residents={residents} />
      <Title observations={observations} className="mb-4" />
    </>
  );
}
