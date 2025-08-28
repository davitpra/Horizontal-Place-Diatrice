import { getAllResidents } from "@/lib/getAllResidents";
import { residents as rawData } from "../data/residents";
import { useCreateMenus } from "@/hooks/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/useCreateBreakfast";
import { Serving } from "@/components/Serving";
import { useCreateLunch } from "@/hooks/useCreateLunch";

export default async function Home() {
  let residents = [];
  let breakFast = [];
  let lunch = [];
  let supper = [];
  let menus = [];

    // let date = useGetFormattedDate();
  let date = "2025-02-15";

  try {
    residents = await getAllResidents();
    menus = await useCreateMenus(residents, date);
    breakFast = await useCreateBreakfast(residents, date, menus);
    lunch = await useCreateLunch(residents, date, menus);
  } catch (error) {
    residents = rawData;
    breakFast = [];
    console.log("Error", error);
  }

  return <Serving residents={residents} date ={date} breakFast={breakFast} menus={menus} lunch={lunch}/>
}
