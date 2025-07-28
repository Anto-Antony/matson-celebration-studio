import { Calendar, Clock, MapPin } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";
import messageOnUpdate from "./utils/messageOnUpdate";
import EditableLink from "./Editable/EditableLink";
import EditableText from "./EditableText";

const WeddingDetailsSection = () => {
    const { weddingData, updateWeddingData } = useWedding();

    const updateEventDetails = async (
        event: "event1" | "event2" | "toKnow1" | "toKnow2" | "toKnow3",
        field: string,
        value: string,
    ) => {
        const isUpdated: boolean = await updateWeddingData({
            weddingDetails: {
                ...weddingData.weddingDetails,
                [event]: {
                    ...(weddingData.weddingDetails[event] || {}),
                    [field]: value,
                },
            },
        });
        messageOnUpdate(isUpdated, field);
    };

    return (
        <section id="details" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl py-12 p-3 md:p-12 border border-white/20 shadow-xl">
                    <div className="font-bold text-center text-gray-800 mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-Faculty-Glyphic">
                            Wedding Details
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Everything you need to know about our special day
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Event 1 */}
                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20">
                            <EditableText
                                value={weddingData.weddingDetails.event1.title}
                                onSave={(value) =>
                                    updateEventDetails("event1", "title", value)
                                }
                                className="text-2xl font-bold text-gray-800 mb-4 block"
                            />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar
                                        className="text-purple-600"
                                        size={20}
                                    />
                                    <EditableText
                                        value={
                                            weddingData.weddingDetails.event1
                                                .date
                                        }
                                        onSave={(value) =>
                                            updateEventDetails(
                                                "event1",
                                                "date",
                                                value,
                                            )
                                        }
                                        className="text-gray-700"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock
                                        className="text-purple-600"
                                        size={20}
                                    />
                                    <EditableText
                                        value={
                                            weddingData.weddingDetails.event1
                                                .time
                                        }
                                        onSave={(value) =>
                                            updateEventDetails(
                                                "event1",
                                                "time",
                                                value,
                                            )
                                        }
                                        className="text-gray-700"
                                    />
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin
                                        className="text-purple-600 mt-1"
                                        size={20}
                                    />
                                    <div>
                                        <EditableText
                                            value={
                                                weddingData.weddingDetails
                                                    .event1.venue
                                            }
                                            onSave={(value) =>
                                                updateEventDetails(
                                                    "event1",
                                                    "venue",
                                                    value,
                                                )
                                            }
                                            className="text-gray-700 font-medium"
                                        />
                                        <br />
                                        <EditableLink
                                            text={
                                                weddingData.weddingDetails
                                                    .event1.address
                                            }
                                            link={
                                                weddingData.weddingDetails
                                                    .event1.addressMapLink
                                            }
                                            onSave={(value) =>
                                                updateEventDetails(
                                                    "event1",
                                                    "address",
                                                    value,
                                                )
                                            }
                                            className="text-gray-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event 2 */}
                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20">
                            <EditableText
                                value={weddingData.weddingDetails.event2.title}
                                onSave={(value) =>
                                    updateEventDetails("event2", "title", value)
                                }
                                className="text-2xl font-bold text-gray-800 mb-4 block"
                            />

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar
                                        className="text-purple-600"
                                        size={20}
                                    />
                                    <EditableText
                                        value={
                                            weddingData.weddingDetails.event2
                                                .date
                                        }
                                        onSave={(value) =>
                                            updateEventDetails(
                                                "event2",
                                                "date",
                                                value,
                                            )
                                        }
                                        className="text-gray-700"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock
                                        className="text-purple-600"
                                        size={20}
                                    />
                                    <EditableText
                                        value={
                                            weddingData.weddingDetails.event2
                                                .time
                                        }
                                        onSave={(value) =>
                                            updateEventDetails(
                                                "event2",
                                                "time",
                                                value,
                                            )
                                        }
                                        className="text-gray-700"
                                    />
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin
                                        className="text-purple-600 mt-1"
                                        size={20}
                                    />
                                    <div>
                                        <EditableText
                                            value={
                                                weddingData.weddingDetails
                                                    .event2.venue
                                            }
                                            onSave={(value) =>
                                                updateEventDetails(
                                                    "event2",
                                                    "venue",
                                                    value,
                                                )
                                            }
                                            className="text-gray-700 font-medium"
                                        />
                                        <br />
                                        <EditableLink
                                            text={
                                                weddingData.weddingDetails
                                                    .event2.address
                                            }
                                            link={
                                                weddingData.weddingDetails
                                                    .event2.addressMapLink
                                            }
                                            onSave={(value) =>
                                                updateEventDetails(
                                                    "event2",
                                                    "address",
                                                    value,
                                                )
                                            }
                                            className="text-gray-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 border border-white/20">
                            <EditableText
                                value={weddingData.weddingDetails.toKnow1.title}
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow1",
                                        "title",
                                        value,
                                    )
                                }
                                className="text-lg font-semibold text-gray-800 mb-3 block"
                            />
                            <EditableText
                                value={
                                    weddingData.weddingDetails.toKnow1
                                        .description
                                }
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow1",
                                        "description",
                                        value,
                                    )
                                }
                                className="text-gray-600 text-sm block"
                                multiline
                            />
                        </div>

                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 border border-white/20">
                            <EditableText
                                value={weddingData.weddingDetails.toKnow2.title}
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow2",
                                        "title",
                                        value,
                                    )
                                }
                                className="text-lg font-semibold text-gray-800 mb-3 block"
                            />
                            <EditableText
                                value={
                                    weddingData.weddingDetails.toKnow2
                                        .description
                                }
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow2",
                                        "description",
                                        value,
                                    )
                                }
                                className="text-gray-600 text-sm block"
                                multiline
                            />
                        </div>

                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 border border-white/20">
                            <EditableText
                                value={weddingData.weddingDetails.toKnow3.title}
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow3",
                                        "title",
                                        value,
                                    )
                                }
                                className="text-lg font-semibold text-gray-800 mb-3 block"
                            />
                            <EditableText
                                value={
                                    weddingData.weddingDetails.toKnow3
                                        .description
                                }
                                onSave={(value) =>
                                    updateEventDetails(
                                        "toKnow3",
                                        "description",
                                        value,
                                    )
                                }
                                className="text-gray-600 text-sm block"
                                multiline
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeddingDetailsSection;
