import type { AuthError, Session } from "@supabase/supabase-js";
import {
    createContext,
    type Dispatch,
    type SetStateAction,
    useContext,
} from "react";
import type {
    User,
    WeddingData,
    WeddingWish,
    WeddingWishType,
} from "../types/wedding";
import { WebEntry } from "../types/wedding";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useWeddingAuth } from "./WeddingAuthContext";

export interface WeddingContextType {
    weddingData: WeddingData;
    weddingWishes: WeddingWishType;
    setWeddingWishes: Dispatch<SetStateAction<WeddingWishType>>;
    user: User | null;
    session: Session | null;
    isLoggedIn: boolean;
    globalIsLoading: boolean;
    editable: boolean; // true if owner, false if guest
    updateWeddingData: (data: Partial<WeddingData>) => Promise<boolean>;
    updateGalleryImage: (
        file: File | null,
        imageCaption: string | null,
        index: number,
    ) => Promise<void>;
    loadAllWeddingWishes: () => Promise<void>;
    saveData: (data: WeddingData) => Promise<boolean>;
    addWish: (data: WeddingWish) => Promise<void>;
    userId: string | null;
    setUserId: (id: string | null) => void;
    userWebEntry: WebEntry | null;
    fetchUserWebEntry: (userId: string) => Promise<void>;
    loadWeddingData: (userId: string) => Promise<void>;
}

export const WeddingContext = createContext<WeddingContextType | undefined>(
    undefined,
);

export const useWedding = () => {
    const context = useContext(WeddingContext);
    if (context === undefined) {
        throw new Error("useWedding must be used within a WeddingProvider");
    }
    return context;
};
