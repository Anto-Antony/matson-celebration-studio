import { useWedding } from "../contexts/WeddingContext";
import messageOnUpdate from "./utils/messageOnUpdate";
import uploadImage from "./utils/UploadImage";
import EditableImage from "./Editable/EditableImage";
import EditableText from "./EditableText";

const StorySection = () => {
    const { weddingData, updateWeddingData, user } = useWedding();

    const updateStoryContent = async (newContent: string) => {
        const isUpdated = await updateWeddingData({
            story: { ...weddingData.story, content: newContent },
        });
        messageOnUpdate(isUpdated, "Story content");
    };

    const updateStoryTitle = async (newTitle: string) => {
        const isUpdated = await updateWeddingData({
            story: { ...weddingData.story, title: newTitle },
        });
        messageOnUpdate(isUpdated, "Story Content");
    };

    const updateStoryImage = async (file: File) => {
        const imageUrl = await uploadImage(file, user, "story_image");
        updateWeddingData({
            story: { ...weddingData.story, image: imageUrl },
        });
    };

    return (
        <section id="story" className="py-20 px-2 md:px-4 relative">
            {/* Section-specific floating elements */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-br from-pink-200/50 to-rose-200/50 rounded-full blur-xl animate-pulse delay-300"></div>
                <div className="absolute bottom-20 left-16 w-32 h-32 bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-2xl floating-animation"></div>
            </div>

            <div className="md:container px-1 mx-auto relative z-10">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl py-12 p-2 md:p-12 border border-white/20 shadow-xl">
                    {/* Inner gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-50/20 rounded-3xl"></div>

                    <div className="relative z-10 space-y-3">
                        {/* Title with glass effect */}
                        <div className="font-bold text-center text-gray-800 mb-12">
                            <p className="text-xs text-muted-foreground">
                                Our Story
                            </p>
                            <EditableText
                                value={weddingData.story.title}
                                onSave={(value) => updateStoryTitle(value)}
                                className="text-3xl font-bold text-center text-gray-800 font-Faculty-Glyphic"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Image with enhanced glass container */}
                            <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-4 border border-white/20 relative">
                                {/* Decorative corner elements */}
                                <div className="absolute top-2 left-2 w-3 h-3 bg-gradient-to-br from-purple-300/60 to-pink-300/60 rounded-full blur-sm"></div>
                                <div className="absolute bottom-2 right-2 w-3 h-3 bg-gradient-to-br from-blue-300/60 to-purple-300/60 rounded-full blur-sm"></div>

                                <div className="relative overflow-hidden rounded-xl">
                                    <EditableImage
                                        label="Update cover Image"
                                        onUpdate={updateStoryImage}
                                    >
                                        <img
                                            src={weddingData.story.image}
                                            alt="Our Story"
                                            className="w-full h-80 object-cover shadow-lg transition-transform hover:scale-105 duration-300"
                                        />
                                    </EditableImage>
                                    {/* Image glass overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-100/10 rounded-xl"></div>
                                </div>
                            </div>

                            {/* Content with glass effect */}
                            <div className="backdrop-blur-md bg-white/10 rounded-2xl px-6 py-6 border border-white/35 text-justify">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-30">
                                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-lg"></div>
                                    <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-md"></div>
                                </div>

                                <div className="relative z-10">
                                    <EditableText
                                        value={weddingData.story.content}
                                        onSave={(value) =>
                                            updateStoryContent(value)
                                        }
                                        className="text-gray-600  block"
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
