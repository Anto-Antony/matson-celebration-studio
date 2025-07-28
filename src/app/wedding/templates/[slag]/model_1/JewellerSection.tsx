import { ExternalLink, Gem } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";

const JewellerSection = () => {
    const { weddingData } = useWedding();

    return (
        <section id="jeweller" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl py-12 px-4 md:p-12 border border-white/20 shadow-xl">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Gem className="text-purple-600" size={32} />
                            <h2 className="text-xl md:text-3xl font-bold text-gray-800 font-Faculty-Glyphic">
                                {weddingData.jeweller.title}
                            </h2>
                        </div>

                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl py-8 md:p-8 border border-white/20">
                            <p className="text-gray-700 text-lg mb-6">
                                {weddingData.jeweller.description}
                            </p>

                            <div className="backdrop-blur-sm bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-xl border border-purple-200/30 overflow-hidden">
                                <img
                                    src="/jewellery/ad-1.jpg"
                                    alt="Edimannickal Gold and Diamonds ad"
                                />
                                <div className="p-4">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 font-Faculty-Glyphic">
                                        {weddingData.jeweller.shopName}
                                    </h3>
                                    <a
                                        href={weddingData.jeweller.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        Visit Our Jeweller
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JewellerSection;
