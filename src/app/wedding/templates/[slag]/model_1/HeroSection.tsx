import { useWedding } from "../contexts/WeddingContext";
import messageOnUpdate from "./utils/messageOnUpdate";
import uploadImage from "./utils/UploadImage";
import EditableImage from "./Editable/EditableImage";
import EditableText from "./EditableText";

const HeroSection = () => {
    const { weddingData, updateWeddingData, user } = useWedding();

    const updateHeroImage = async (file: File) => {
        const imageUrl = await uploadImage(file, user, "hero_image");
        updateWeddingData({
            couple: { ...weddingData.couple, image: imageUrl },
        });
    };

    const updateWeddingQuote = async (newQuote: string) => {
        const isUpdated = await updateWeddingData({
            couple: {
                ...weddingData.couple,
                weddingQuote: newQuote,
            },
        });
        messageOnUpdate(isUpdated, "wedding quote");
    };

    const updateGroomName = async (newName: string) => {
        const isUpdated = await updateWeddingData({
            couple: {
                ...weddingData.couple,
                groomName: newName,
            },
        });
        messageOnUpdate(isUpdated, "groom name");
    };

    const updateBrideName = async (newName: string) => {
        const isUpdated = await updateWeddingData({
            couple: {
                ...weddingData.couple,
                brideName: newName,
            },
        });
        messageOnUpdate(isUpdated, "bride name");
    };

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center pt-20 px-2 md:px-4 relative"
        >
            <EditableImage
                onUpdate={updateHeroImage}
                label="Update Cover Image"
            >
                <div className="absolute w-full h-full inset-0 z-0 pointer-events-none object-cover overflow-hidden">
                    <img
                        src={weddingData.couple.image}
                        alt="Wedding Background"
                        className="w-full h-full object-cover blur-sm"
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            </EditableImage>

            {/* Additional floating elements specific to hero */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-32 left-1/4 w-20 h-20 bg-gradient-to-br from-rose-300/60 to-pink-300/60 rounded-full blur-md animate-bounce delay-200"></div>
                <div className="absolute bottom-32 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-300/60 to-indigo-300/60 rounded-full blur-lg animate-pulse delay-1500"></div>
            </div>

            <div className="text-center w-full md:max-w-fit mx-auto relative z-10 bg-transparent">
                {/* Enhanced Glass Card Container with stronger effect */}
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-6 md:p-12 border border-white/40 shadow-2xl relative">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-purple-100/30 rounded-3xl"></div>

                    <div className="relative z-10">
                        {/* Wedding Quote with glass background */}
                        <div className="mb-8">
                            <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border border-white/30 mb-4">
                                <EditableText
                                    value={weddingData.couple.weddingQuote}
                                    onSave={(value) =>
                                        updateWeddingQuote(value)
                                    }
                                    className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-light italic leading-relaxed"
                                    multiline
                                />
                            </div>
                        </div>

                        {/* Couple Names with enhanced glass effect */}
                        <div className="space-y-4">
                            <div className="backdrop-blur-md bg-white/35 rounded-2xl p-8 border border-white/35 shadow-lg">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                                    <div className="backdrop-blur-sm bg-gradient-to-r from-white/40 to-purple-100/40 rounded-xl p-4 border border-white/30">
                                        <EditableText
                                            value={weddingData.couple.groomName}
                                            onSave={(value) =>
                                                updateGroomName(value)
                                            }
                                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-Faculty-Glyphic"
                                        />
                                    </div>

                                    <div className="backdrop-blur-sm bg-gradient-to-br from-white/50 to-pink-200/50 rounded-3xl p-6 border border-purple-200/30">
                                        <div className="text-3xl md:text-4xl text-white font-light">
                                            &
                                        </div>
                                    </div>

                                    <div className="backdrop-blur-sm bg-gradient-to-l from-white/40 to-pink-100/40 rounded-xl p-4 border border-white/30">
                                        <EditableText
                                            value={weddingData.couple.brideName}
                                            onSave={(value) =>
                                                updateBrideName(value)
                                            }
                                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-Faculty-Glyphic"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
