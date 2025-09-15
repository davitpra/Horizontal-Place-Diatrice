import { getAllResidents } from "@/lib/getAllResidents";
import { residents as rawData } from "../data/residents";
import { useCreateMenus } from "@/hooks/useCreateMenus";
import { useCreateBreakfast } from "@/hooks/useCreateBreakfast";
import { Serving } from "@/components/features/serving/Serving";
import { useCreateLunch } from "@/hooks/useCreateLunch";
import { useCreateSupper } from "@/hooks/useCreateSupper";
import { date } from "@/constants/date";
import { getMenuSchedule } from "@/lib/getMenuSchedule";

export default async function Home() {
  let residents = [];
  let breakFast = [];
  let lunch = [];
  let supper = [];
  let menus = [];
  let menuSchedule = [];
  // let date = useGetFormattedDate();

  try {
    residents = await getAllResidents();
    menus = await useCreateMenus(residents, date);
    breakFast = await useCreateBreakfast(residents, date, menus);
    menuSchedule = await getMenuSchedule(date)
    lunch = await useCreateLunch(residents, date, menus);
    supper = await useCreateSupper(residents, date, menus);

    // actualizar el menu para que tenga los desayunos, almuerzos y cenas creados
    menus = await useCreateMenus(residents, date);
  } catch (error) {
    residents = rawData;
    breakFast = [];
    console.log("Error", error);
  }

  return <Serving residents={residents} date={date} breakFast={breakFast} menus={menus} lunch={lunch} supper={supper} menuSchedule={menuSchedule} />
}
