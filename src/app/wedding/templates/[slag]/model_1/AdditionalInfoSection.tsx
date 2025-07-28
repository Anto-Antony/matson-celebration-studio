import { Info } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";
import messageOnUpdate from "./utils/messageOnUpdate";
import EditableText from "./EditableText";

const AdditionalInfoSection = () => {
    const { weddingData, updateWeddingData } = useWedding();

    const updateTitle = async (newTitle: string) => {
        const isUpdated: boolean = await updateWeddingData({
            moreInfo: { ...weddingData.moreInfo, title: newTitle },
        });
        messageOnUpdate(isUpdated, "title");
    };

    const updateContent = async (newContent: string) => {
        const isUpdated: boolean = await updateWeddingData({
            moreInfo: { ...weddingData.moreInfo, content: newContent },
        });
        messageOnUpdate(isUpdated, "content");
    };

    return (
        <section id="info" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl px-2 py-12 md:p-12 border border-white/20 shadow-xl">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-8 gap-3">
                            <Info className="text-purple-600" size={32} />
                            <EditableText
                                value={weddingData.moreInfo.title}
                                onSave={(value) => updateTitle(value)}
                                className="text-xl md:text-3xl font-bold  text-gray-800 font-Faculty-Glyphic"
                            />
                        </div>

                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl py-8 px-4 md:p-8 border border-white/20">
                            <EditableText
                                value={weddingData.moreInfo.content}
                                onSave={(value) => updateContent(value)}
                                className="text-gray-700 leading-relaxed text-lg"
                                multiline
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdditionalInfoSection;
