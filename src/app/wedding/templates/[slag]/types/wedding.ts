export interface User {
    id: string;
    email: string;
    isAuthenticated: boolean;
    bride_name?: string;
    groom_name?: string;
    phone_number?: string;
}

// user_profile table type
export interface UserProfile {
    user_id: string;
    email: string;
    bride_name: string;
    groom_name: string;
    phone_number: string;
    password?: string; // Only for dev/testing, not for production
}

// web_entries table type
export interface WebEntry {
    id: string;
    user_id: string;
    web_data: any; // or a more specific type if you know the structure
    created_at: string;
    updated_at: string | null;
    wishes: any; // or a more specific type
}

export interface WeddingCouple {
    groomName: string;
    brideName: string;
    weddingQuote: string;
    image: string;
}

export interface WeddingStory {
    title: string;
    content: string;
    image: string;
}

export interface WeddingEvent {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    addressMapLink: string;
}

export interface WeddingToKnow {
    title: string;
    description: string;
}

export interface WeddingDetails {
    event1: WeddingEvent;
    event2: WeddingEvent;
    toKnow1: WeddingToKnow;
    toKnow2: WeddingToKnow;
    toKnow3: WeddingToKnow;
}

export interface ScheduleItem {
    id: string;
    time: string;
    event: string;
    description: string;
}

export interface GalleryImage {
    id: string;
    url: string;
    name: string;
    caption: string | null;
}

export interface WeddingMoreInfo {
    title: string;
    content: string;
}

export interface WeddingContact {
    phone: string;
    email: string;
    address: string;
    addressMapLink: string;
}

export interface WeddingJeweller {
    title: string;
    description: string;
    shopName: string;
    website: string;
}

export interface WeddingData {
    couple: WeddingCouple;
    story: WeddingStory;
    weddingDetails: WeddingDetails;
    schedule: ScheduleItem[];
    gallery: GalleryImage[];
    moreInfo: WeddingMoreInfo;
    contact: WeddingContact;
    jeweller: WeddingJeweller;
    template?: string; // Add this line to store the selected template
}

export interface WeddingWish {
    id: string;
    name: string;
    message: string;
}

export type WeddingWishType = WeddingWish[];
