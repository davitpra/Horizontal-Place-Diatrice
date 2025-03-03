import { getAllResidents } from "@/lib/getAllResidents";
import { residents as rawData } from "../data/residents";
import { useCreateMenus } from "@/hooks/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/useCreateBreakfast";
import { Serving } from "@/components/Serving";

export default async function Home() {
  let residents = [];
  let breakFast = [];

    // let date = useGetFormattedDate();
  let date = "2025-02-15";

  try {
    residents = await getAllResidents();
    const menus = await useCreateMenus(residents, date);
    breakFast = await useCreateBreakfast(residents, date, menus);
  } catch (error) {
    residents = rawData;
    breakFast = [];
    console.log("Error", error);
  }

  return <Serving residents={residents} date ={date} breakFast={breakFast}/>
}
