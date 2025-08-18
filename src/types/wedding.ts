export interface AuthUser {
  id: string;
  email: string;
  isAuthenticated: boolean;
  bride_name?: string;
  groom_name?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  access_token?: string;
  refresh_token?: string;
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
  disabled?: boolean;
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
  disabled?: boolean;
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
  disabled?: boolean;
}

export interface WeddingContact {
  phone: string;
  email: string;
  address: string;
  addressMapLink: string;
  disabled?: boolean;
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
  colorScheme?: string;
  fontFamily?: string;
  template_id?: string; // Add this line
}

export interface WeddingWish {
  id: string;
  name: string;
  message: string;
}
