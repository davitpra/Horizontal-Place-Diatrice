import { changeBreakfast } from "@/lib/changeBreakfast";

export const useChangeBreakfast = async (resident, change) => {
  const { documentId } = resident;

  if (!documentId) {
    console.error("No documentId found for resident:", resident);
    return;
  }
  await changeBreakfast({documentId, options: change });
};
