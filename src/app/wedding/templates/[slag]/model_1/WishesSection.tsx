import { Heart, Send } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWedding } from "../contexts/WeddingContext";
import { useToast } from "@/hooks/use-toast";
import type { WeddingWish } from "../types/wedding";

const WishesSection = () => {
    const [guestName, setGuestName] = useState("");
    const [wishMessage, setWishMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const { weddingWishes, addWish, setWeddingWishes } = useWedding();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const newWish: WeddingWish = {
            id: `${Date.now()}-${crypto.randomUUID()}`,
            name: guestName,
            message: wishMessage,
        };

        const originalWishes = structuredClone(weddingWishes);

        const tempWeddingWishes = structuredClone(weddingWishes);
        tempWeddingWishes.splice(0, 0, newWish);

        setWeddingWishes(tempWeddingWishes);
        try {
            await addWish(newWish);
        } catch (error) {
            setWeddingWishes(originalWishes);
        }

        toast({
            title: "Successfully added your message",
        });

        setWishMessage("");
        setIsLoading(false);
    };

    return (
        <section id="wishes" className="py-20 px-4">
            <div className="md:container mx-auto">
                <div className="backdrop-blur-md bg-white/30 rounded-3xl px-2 py-12 md:p-12 border border-white/20 shadow-xl">
                    <div className="font-bold text-center text-gray-800 mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-Faculty-Glyphic">
                            Guest Wishes
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Beautiful messages from our loved ones
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Wishes Form */}
                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Heart className="text-red-500" size={20} />
                                Leave a Wish
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="wishName">Your Name</Label>
                                    <Input
                                        id="wishName"
                                        value={guestName}
                                        onChange={(e) =>
                                            setGuestName(e.target.value)
                                        }
                                        className="backdrop-blur-sm bg-white/50 border-white/30 focus-visible:ring-purple-600"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="wishMessage">
                                        Your Message
                                    </Label>
                                    <textarea
                                        id="wishMessage"
                                        value={wishMessage}
                                        onChange={(e) =>
                                            setWishMessage(e.target.value)
                                        }
                                        className="w-full p-3 border rounded-lg resize-none h-32 backdrop-blur-sm bg-white/50 border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-600"
                                        placeholder="Share your wishes for the happy couple..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                    {isLoading ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Send size={16} className="mr-2" />
                                            Send Wish
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Recent Wishes */}
                        <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Recent Wishes
                                </h3>
                                <Link to="/wishes">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="backdrop-blur-sm bg-white/50"
                                    >
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {weddingWishes.length === 0 ? (
                                    <p className="text-center text-gray-600 py-8">
                                        No wishes yet. Be the first to leave a
                                        wish!
                                    </p>
                                ) : (
                                    weddingWishes.slice(0, 3).map((wish) => (
                                        <div
                                            key={wish.id}
                                            className="backdrop-blur-sm bg-white/30 rounded-xl p-4 border border-white/20"
                                        >
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                {wish.name}
                                            </h4>
                                            <p className="text-gray-700 text-sm">
                                                {wish.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WishesSection;
