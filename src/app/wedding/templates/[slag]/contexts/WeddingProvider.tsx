import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type {
    WeddingData,
    WeddingWish,
    WeddingWishType,
    WebEntry,
    User,
} from "../types/wedding";
import uploadImage from "../model_1/utils/UploadImage";
import { WeddingContext } from "./WeddingContext";
import { useWeddingAuth } from "./WeddingAuthContext";

// --- Default Data ---
const defaultWeddingData: WeddingData = {
    couple: {
        groomName: "Nithin",
        brideName: "Nithya",
        weddingQuote:
            "Together We Journey – Two souls, one path, endless love.",
        image: "/couple/white.png",
    },
    story: {
        title: "Brewing Love",
        content:
            "We met on a beautiful autumn day in the local coffee shop. What started as a chance encounter over spilled coffee became the beginning of our forever love story. After three wonderful years together, Nithin proposed during a romantic sunset at our favorite beach, and Nithya said yes with tears of joy.",
        image: "/couple/white.png",
    },
    weddingDetails: {
        event1: {
            title: "Ceremony",
            date: "June 15, 2024",
            time: "4:00 PM",
            venue: "St. Mary's Cathedral",
            address: "123 Cathedral Street, City, State 12345",
            addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
        },
        event2: {
            title: "Reception",
            date: "June 15, 2024",
            time: "6:30 PM",
            venue: "Grand Ballroom",
            address: "456 Reception Avenue, City, State 12345",
            addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
        },
        toKnow1: {
            title: "Getting There",
            description:
                "The venue is easily accessible by car or public transport. Free shuttle service will be provided from the ceremony to reception venue.",
        },
        toKnow2: {
            title: "What to wear",
            description:
                "Semi-formal attire requested. Ladies: cocktail dresses or elegant separates. Gentlemen: suit and tie or dress shirt with slacks.",
        },
        toKnow3: {
            title: "Parking",
            description:
                "Complimentary valet parking available at both venues. Street parking is also available on surrounding streets.",
        },
    },
    schedule: [
        {
            id: "1",
            time: "3:30 PM",
            event: "Guest Arrival",
            description: "Welcome drinks and mingling",
        },
        {
            id: "2",
            time: "4:00 PM",
            event: "Ceremony",
            description: "Wedding ceremony begins",
        },
        {
            id: "3",
            time: "5:00 PM",
            event: "Cocktail Hour",
            description: "Photos and cocktails",
        },
        {
            id: "4",
            time: "6:30 PM",
            event: "Reception",
            description: "Dinner and dancing",
        },
    ],
    gallery: [
        {
            id: "0",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
        {
            id: "1",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
        {
            id: "2",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
    ],
    moreInfo: {
        title: "Additional Information",
        content:
            "For dietary restrictions, please contact us at least one week before the wedding. We will have vegetarian and gluten-free options available. Children are welcome at both the ceremony and reception.",
    },
    contact: {
        phone: "+91 956 5858 855",
        email: "wedding@nithin_nithya.com",
        address: "123 Main Street, City, State 12345",
        addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
    },
    jeweller: {
        title: "Our Wedding Jeweller",
        description:
            "Discover exquisite wedding rings and jewellery collections from our trusted partner.",
        shopName: "Edimannickal Gold and Diamonds",
        website:
            "https://www.instagram.com/edimannickalgoldanddiamonds?igsh=czd3ZzV3bjNvMQ==",
    },
};

// Define a default wedding wish for fallback values
const defaultWeddingWish: WeddingWish = {
    id: "default-id",
    name: "Anonymous",
    message: "Best wishes!",
};

export { defaultWeddingData, defaultWeddingWish };

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- Auth State from Auth Context ---
    const { user, isLoggedIn, userId, setUserId, globalIsLoading } = useWeddingAuth();

    // --- Wedding State ---
    const [weddingData, setWeddingData] = useState<WeddingData>(defaultWeddingData);
    const [weddingWishes, setWeddingWishes] = useState<WeddingWishType>([]);
    const [editable, setEditable] = useState(false);
    const [userWebEntry, setUserWebEntry] = useState<WebEntry | null>(null);

    // --- Effects ---
    useEffect(() => {
        if (userId) {
            loadWeddingData(userId);
            fetchUserWebEntry(userId);
        }
    }, [userId]);

    useEffect(() => {
        // editable if logged in and the logged-in user is the owner of the page
        setEditable(!!user && !!userId && user.id === userId);
    }, [user, userId]);

    // --- Data Loaders ---
    const loadWeddingData = useCallback(async (userId: string): Promise<void> => {
        try {
            const { data, error } = await supabase
                .from("web_entries")
                .select("web_data, wishes")
                .eq("user_id", userId)
                .maybeSingle();

            if (error || !data || !data.web_data) {
                setWeddingData(defaultWeddingData);
                setWeddingWishes([]);
                return;
            }

            setWeddingData({ ...defaultWeddingData, ...data.web_data });
            const mergedWishes = (data.wishes || []).map((wish: any) =>
                ({ ...defaultWeddingWish, ...wish })
            );
            setWeddingWishes(mergedWishes);
        } catch (error) {
            setWeddingData(defaultWeddingData);
            setWeddingWishes([]);
            // Optionally log error
            // console.error(error);
        }
    }, []);

    const fetchUserWebEntry = useCallback(async (userId: string): Promise<void> => {
        try {
        const { data, error } = await supabase
            .from("web_entries")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (!error && data) setUserWebEntry(data);
        } catch (error) {
            // Optionally log error
            // console.error(error);
        }
    }, []);

    const loadAllWeddingWishes = useCallback(async (): Promise<void> => {
        if (!user?.id) return;
        try {
            const { data: wishData, error: wishError } = await supabase
                .from("web_entries")
                .select("wishes")
                .eq("user_id", user.id)
                .maybeSingle();

            if (wishError) return;

            if (wishData) {
                const mergedWishes = (wishData.wishes || []).map((wish: any) => ({
                    ...defaultWeddingWish,
                    ...wish,
                }));
                setWeddingWishes(mergedWishes);
            }
        } catch (error) {
            // Optionally log error
            // console.error(error);
        }
    }, [user]);

    // --- Data Updaters ---
    const saveData = useCallback(async (data: WeddingData): Promise<boolean> => {
        if (!user?.id) return false;
        try {
            const { error } = await supabase.from("web_entries").upsert(
                {
                    user_id: user.id,
                    web_data: data,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id" }
            );
            if (error) return false;
        } catch (error) {
            // Optionally log error
            // console.error(error);
            return false;
        }
        return true;
    }, [user]);

    const updateWeddingData = useCallback(async (data: Partial<WeddingData>): Promise<boolean> => {
        const prev = structuredClone(weddingData);
        const updated = { ...weddingData, ...data };

        setWeddingData(updated);

        const success = await saveData(updated);

        if (!success) setWeddingData(prev);

        return success;
    }, [weddingData, saveData]);

    const updateGalleryImage = useCallback(async (
        file: File | null,
        imageCaption: string | null,
        index: number,
    ): Promise<void> => {
        const image_id = `${Date.now()}-${crypto.randomUUID()}`;
        const image_name = `gallery_image_${image_id}`;
        const updatedGallery = [...weddingData.gallery];

        if (index >= updatedGallery.length) {
            updatedGallery.push({
                id: image_id,
                url: "",
                caption: imageCaption,
                name: image_name,
            });
        }

        if (file) {
            const imageUrl = await uploadImage(file, user, image_name);
            if (!imageUrl) return;
            updatedGallery[index].url = imageUrl;
        }

        updatedGallery[index].caption = imageCaption;
        updateWeddingData({ gallery: updatedGallery });
    }, [weddingData, user, updateWeddingData]);

    const addWish = useCallback(async (wish: WeddingWish): Promise<void> => {
        if (!user?.id) return;
        try {
            const { data, error } = await supabase
                .from("web_entries")
                .select("wishes")
                .eq("user_id", user.id)
                .maybeSingle();

            let wishes: WeddingWishType = [];
            if (data && data.wishes) wishes = data.wishes;
            wishes.push(wish);

            await supabase
                .from("web_entries")
                .update({ wishes, updated_at: new Date().toISOString() })
                .eq("user_id", user.id);
    
        } catch (error) {
            // Optionally log error
            // console.error(error);
        }
    }, [user]);

    // --- Provider Value ---
    const providerValue = {
                weddingData,
                weddingWishes,
                setWeddingWishes,
                loadAllWeddingWishes,
                user,
                session: null,
                isLoggedIn,
                globalIsLoading,
                editable,
                updateWeddingData,
                updateGalleryImage,
                saveData,
                addWish,
                userId,
                setUserId,
                userWebEntry,
                fetchUserWebEntry,
                loadWeddingData,
    };

    return (
        <WeddingContext.Provider value={providerValue}>
            {children}
        </WeddingContext.Provider>
    );
};
