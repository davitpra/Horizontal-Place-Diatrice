"use client";

import { useWeeklyMenuModal } from "@/store/modals/useWeeklyMenuModal";
import { Modal } from "@/components/ui/Modal";
import WeeklyMenuGrid from "./WeeklyMenuGrid";

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
      <div className="flex h-full flex-col">September 2025</div>
      <WeeklyMenuGrid />
    </Modal>
  );
}