import type { AuthError, Session } from "@supabase/supabase-js";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { WeddingData, WeddingWish } from "@/types/wedding";

export interface AuthUser {
    id: string;
    email: string;
    isAuthenticated: boolean;
    bride_name?: string;
    groom_name?: string;
    phone_number?: string;
    access_token?: string;
    refresh_token?: string;
}

export interface WeddingContextType {
    weddingData: WeddingData;
    weddingWishes: WeddingWish[];
    setWeddingWishes: Dispatch<SetStateAction<WeddingWish[]>>;
    user: AuthUser | null;
    session: Session | null;
    isLoggedIn: boolean;
    isAuthInitialized: boolean;
    globalIsLoading: boolean;
    updateWeddingData: (data: Partial<WeddingData>) => Promise<boolean>;
    updateGalleryImage: (
        file: File | null,
        imageCaption: string | null,
        index: number,
    ) => Promise<void>;
    loadAllWeddingWishes: () => Promise<void>;
    saveData: (data: WeddingData) => Promise<boolean>;
    addWish: (wish: Omit<WeddingWish, "id">) => void;
    login: (
        email: string,
        password: string,
    ) => Promise<{ error: string | null; user: AuthUser | null }>;
    logout: () => Promise<void>;
    register: (
        email: string,
        password: string,
        userData?: Partial<AuthUser>
    ) => Promise<{ user: AuthUser | null; error: any }>;
    setIsAuthInitialized: (value: boolean) => void;
}

export const WeddingContext = createContext<WeddingContextType | undefined>(
    undefined,
);

export const useWedding = (): WeddingContextType => {
    const context = useContext(WeddingContext);
    if (context === undefined) {
        throw new Error('useWedding must be used within a WeddingProvider');
    }
    return context;
};
