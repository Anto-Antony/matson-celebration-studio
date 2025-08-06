export interface AuthUser {
  id: string;
  email: string;
  isAuthenticated: boolean;
  bride_name?: string;
  groom_name?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
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
  caption: string | null;
  name: string;
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
  template: string;
  // Design settings
  colorScheme?: string;
  fontFamily?: string;
  [key: string]: any; // Allow additional properties
}

export interface WeddingWish {
  id: string;
  name: string;
  message: string;
}
