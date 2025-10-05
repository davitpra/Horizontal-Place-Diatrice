"use client";

import { useWeeklyMenuModal } from "@/store/modals/useWeeklyMenuModal";
import { Modal } from "@/components/ui/Modal";
import WeekCalendar from "./weekCalendar";

export default function WeeklyMenuModal() {
  const WeeklyMenuModal = useWeeklyMenuModal();
  return (
    <Modal
      isOpen={WeeklyMenuModal.isOpen}
      close={WeeklyMenuModal.onClose}
      title="Weekly Menu"
      button="Save"
      buttonAction={() => {}}
      buttonDisabled={false}
    >
      <WeekCalendar />
    </Modal>
  );
}