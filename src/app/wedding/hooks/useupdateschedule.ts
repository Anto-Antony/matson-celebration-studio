import { useState, Dispatch, SetStateAction } from "react";
import type { ScheduleItem } from "@/types/wedding";
import messageOnUpdate, { useCase } from "@/utils/messageOnUpdate";
import useWedding from "@/hooks/useWedding";

interface UseUpdateSchedule {
  addScheduleItem: () => void;
  updateScheduleItem: (id: string, field: keyof ScheduleItem, value: string) => Promise<void>;
  saveScheduleItem: (id: string, field: keyof ScheduleItem, value: string) => Promise<void>;
  removeScheduleItem: (id: string) => Promise<void>;
  isAddingItem: boolean;
  setIsAddingItem: Dispatch<SetStateAction<boolean>>;
  newItem: Omit<ScheduleItem, "id">;
  setNewItem: Dispatch<SetStateAction<Omit<ScheduleItem, "id">>>;
}

const useUpdateSchedule = (): UseUpdateSchedule => {
  const { weddingData, updateWeddingData } = useWedding();
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Omit<ScheduleItem, "id">>({
    time: "",
    event: "",
    description: "",
  });

  const updateScheduleItem = async (
    id: string,
    field: keyof ScheduleItem,
    value: string
  ): Promise<void> => {
    const schedule = weddingData.schedule || [];
    const updatedSchedule = schedule.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    const isUpdated = await updateWeddingData({
      schedule: updatedSchedule,
    });
    messageOnUpdate(isUpdated, field);
  };

  const saveScheduleItem = async (
    id: string,
    field: keyof ScheduleItem,
    value: string
  ): Promise<void> => {
    await updateScheduleItem(id, field, value);
  };

  const addScheduleItem = (): void => {
    const newScheduleItem: ScheduleItem = {
      ...newItem,
      id: `${Date.now()}-${crypto.randomUUID()}`,
    };
    updateWeddingData({
      schedule: [...(weddingData.schedule || []), newScheduleItem],
    });
    setNewItem({ time: "", event: "", description: "" });
    setIsAddingItem(false);
  };

  const removeScheduleItem = async (id: string): Promise<void> => {
    const schedule = weddingData.schedule || [];
    const updatedSchedule = schedule.filter((item) => item.id !== id);
    const isDeleted: boolean = await updateWeddingData({
      schedule: updatedSchedule,
    });
    messageOnUpdate(isDeleted, "schedule", useCase.Delete);
  };

  return {
    addScheduleItem,
    updateScheduleItem,
    saveScheduleItem,
    removeScheduleItem,
    isAddingItem,
    setIsAddingItem,
    newItem,
    setNewItem,
  };
};

export default useUpdateSchedule;
