import { useState, useEffect } from 'react';
import type {
  WeddingData,
  WeddingCouple,
  WeddingStory,
  WeddingContact,
  WeddingMoreInfo,
  WeddingDetails,
  ScheduleItem,
  GalleryImage
} from "@/types/wedding";

// Interface for the form data we want to edit
export interface FormData {
  couple: WeddingCouple;
  story: WeddingStory & { disabled?: boolean };
  contact: WeddingContact & { disabled?: boolean };
  moreInfo: WeddingMoreInfo & { disabled?: boolean };
  weddingDetails: WeddingDetails & { disabled?: boolean };
  schedule: ScheduleItem[];
  gallery: GalleryImage[];
  galleryDisabled?: boolean;
  colorScheme: string;
  fontFamily: string;
  template: string;
}

export const useSidebarForm = (
  weddingData: WeddingData & { colorScheme?: string; fontFamily?: string },
  selected: string,
  pendingChanges: Partial<WeddingData>
) => {
  // Initialize form data from wedding data only
  const getInitialFormData = (): FormData => {
    const couple = weddingData?.couple || {} as WeddingCouple;
    const story = weddingData?.story || {} as WeddingStory;
    const contact = weddingData?.contact || {} as WeddingContact;
    const moreInfo = weddingData?.moreInfo || {} as WeddingMoreInfo;
    const weddingDetails = weddingData?.weddingDetails || {} as WeddingDetails;

    return {
      couple: {
        groomName: couple.groomName || '',
        brideName: couple.brideName || '',
        weddingQuote: couple.weddingQuote || '',
        image: couple.image || ''
      },
      story: {
        title: story.title || '',
        content: story.content || '',
        image: story.image || '',
        disabled: story.disabled || false
      },
      contact: {
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || '',
        addressMapLink: contact.addressMapLink || '',
        disabled: contact.disabled || false
      },
      moreInfo: {
        title: moreInfo.title || '',
        content: moreInfo.content || '',
        disabled: moreInfo.disabled || false
      },
      weddingDetails: {
        event1: weddingDetails.event1 || {
          date: '',
          time: '',
          title: '',
          venue: '',
          address: '',
          addressMapLink: ''
        },
        event2: weddingDetails.event2 || {
          date: '',
          time: '',
          title: '',
          venue: '',
          address: '',
          addressMapLink: ''
        },
        toKnow1: weddingDetails.toKnow1 || {
          title: '',
          description: ''
        },
        toKnow2: weddingDetails.toKnow2 || {
          title: '',
          description: ''
        },
        toKnow3: weddingDetails.toKnow3 || {
          title: '',
          description: ''
        },
        disabled: weddingDetails.disabled || false
      },
      schedule: Array.isArray(weddingData?.schedule) ? weddingData.schedule : [],
      gallery: weddingData?.gallery || [],
      galleryDisabled: false,
      colorScheme: weddingData?.colorScheme || 'classic',
      fontFamily: weddingData?.fontFamily || 'playfair',
      template: selected
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  // Initialize form data with pending changes on mount
  useEffect(() => {
    if (pendingChanges && Object.keys(pendingChanges).length > 0) {
      setFormData(prev => {
        const updated = { ...prev };
        Object.entries(pendingChanges).forEach(([section, changes]) => {
          if (changes && typeof changes === 'object') {
            const sectionKey = section as keyof FormData;
            if (Array.isArray(changes)) {
              // Handle array properties (schedule, gallery)
              (updated as any)[sectionKey] = changes;
            } else {
              // Handle object properties
              (updated as any)[sectionKey] = {
                ...(updated[sectionKey] as any),
                ...changes
              };
            }
          }
        });
        return updated;
      });
    }
  }, []); // Only run on mount

  // Update form data when wedding data or selected template changes (but not pendingChanges)
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [weddingData]);

  return { formData, setFormData };
};