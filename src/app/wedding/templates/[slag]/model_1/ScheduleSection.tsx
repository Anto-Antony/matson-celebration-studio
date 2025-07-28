import { Clock, PlusIcon } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";
import type { ScheduleItem } from "../types/wedding";
import messageOnUpdate from "./utils/messageOnUpdate";
import DeletableItem from "./Editable/DeleteableItem";
import EditableText from "./EditableText";

const ScheduleSection = () => {
    const { weddingData, isLoggedIn, updateWeddingData } = useWedding();

    const updateScheduleItem = async (
        id: string,
        field: keyof ScheduleItem,
        value: string,
    ) => {
        const updatedSchedule = weddingData.schedule.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
        );
        const isUpdated = await updateWeddingData({
            schedule: updatedSchedule,
        });
        messageOnUpdate(isUpdated, field);
    };

    const addScheduleItem = () => {
        const newItem: ScheduleItem = {
            id: Date.now().toString(),
            time: "1:00 PM",
            event: "Dinner",
            description: "Food and Drinks",
        };
        updateWeddingData({
            schedule: [...weddingData.schedule, newItem],
        });
    };

    const removeScheduleItem = (id: string) => {
        const updatedSchedule = weddingData.schedule.filter(
            (item) => item.id !== id,
        );
        updateWeddingData({ schedule: updatedSchedule });
    };

    return (
        <section id="schedule" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl py-12 px-2 md:p-12 border border-white/20 shadow-xl">
                    <div className="font-bold text-center text-gray-800 mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-Faculty-Glyphic">
                            Wedding Schedule
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Here's how our special day will unfold
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {weddingData.schedule.map((item) => (
                            <DeletableItem
                                onDelete={() => removeScheduleItem(item.id)}
                                key={`delete-${item.id}`}
                                label={`Sure you want to delete ${item.event} schedule?`}
                            >
                                <div
                                    key={item.id}
                                    className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 border border-white/20 mb-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="backdrop-blur-sm bg-purple-100/50 rounded-full p-3 border border-purple-200/30">
                                            <Clock
                                                className="text-purple-600"
                                                size={20}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                                <EditableText
                                                    value={item.time}
                                                    onSave={(value) =>
                                                        updateScheduleItem(
                                                            item.id,
                                                            "time",
                                                            value,
                                                        )
                                                    }
                                                    label="Edit Time"
                                                    className="text-lg font-semibold text-purple-600"
                                                />

                                                <EditableText
                                                    value={item.event}
                                                    onSave={(value) =>
                                                        updateScheduleItem(
                                                            item.id,
                                                            "event",
                                                            value,
                                                        )
                                                    }
                                                    label="Edit Event name"
                                                    className="text-xl font-bold text-gray-800 font-Faculty-Glyphic"
                                                />
                                            </div>

                                            <EditableText
                                                value={item.description}
                                                onSave={(value) =>
                                                    updateScheduleItem(
                                                        item.id,
                                                        "description",
                                                        value,
                                                    )
                                                }
                                                label="Edit description"
                                                className="text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DeletableItem>
                        ))}
                        {isLoggedIn && (
                            <div className="backdrop-blur-sm bg-purple-100/50 rounded-2xl p-8 border border-purple-200/30 flex items-center justify-center hover:bg-purple-100 transition-colors duration-200 cursor-pointer">
                                <PlusIcon
                                    className="text-purple-600"
                                    size={25}
                                    type="button"
                                    onClick={addScheduleItem}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScheduleSection;
