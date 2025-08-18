import type { WeddingData, ScheduleItem, GalleryImage } from "@/types/wedding";
import type { FormData } from '../hooks/useSidebarForm';

// Helper function to get color value for design options
export const getColorValue = (colorScheme: string): string => {
  const colorMap: Record<string, string> = {
    classic: '#8B5A3C',
    romantic: '#D4A574',
    modern: '#2C3E50',
    vintage: '#A0522D'
  };
  return colorMap[colorScheme] || '#8B5A3C';
};

// Create form handlers factory
export const createFormHandlers = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  onFieldChange: (section: keyof WeddingData, field: string, value: string | boolean) => void,
  onPendingChange: (section: keyof WeddingData, field: string, value: string | boolean) => void
) => {
  // Handle input changes with pending state and Enter key detection
  const handleInputChange = (
    section: keyof FormData, 
    field: string, 
    value: string | boolean, 
    event?: React.KeyboardEvent, 
    nestedField?: string
  ) => {
    // Update local state
    if (nestedField) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] && typeof prev[section] === 'object' ? prev[section] : {}),
          [field]: {
            ...((prev[section] as any)?.[field] && typeof (prev[section] as any)?.[field] === 'object' ? (prev[section] as any)[field] : {}),
            [nestedField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] && typeof prev[section] === 'object' ? prev[section] : {}),
          [field]: value
        }
      }));
    }

    // Save vs pending based on Enter key
    if (event?.key === "Enter") {
      if (nestedField) {
        onFieldChange(section as keyof WeddingData, `${field}.${nestedField}`, value);
      } else {
        onFieldChange(section as keyof WeddingData, field, value);
      }
    } else {
      if (nestedField) {
        onPendingChange(section as keyof WeddingData, `${field}.${nestedField}`, value);
      } else {
        onPendingChange(section as keyof WeddingData, field, value);
      }
    }
  };

  // Handle array updates (for schedule and gallery)
  const handleArrayUpdate = (section: 'schedule' | 'gallery', index: number, field: string, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: newArray
      };
    });
    onPendingChange(section as keyof WeddingData, `${index}.${field}`, value);
  };

  // Add new item to array
  const handleArrayAdd = (section: 'schedule' | 'gallery') => {
    const newItem = section === 'schedule' 
      ? { time: '', event: '', description: '' }
      : { url: '', name: '', caption: '' };
    
    setFormData(prev => {
      const newArray = [...prev[section], newItem];
      // Update pending changes with the entire new array
      onPendingChange(section as keyof WeddingData, 'array_update', JSON.stringify(newArray));
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  // Remove item from array
  const handleArrayRemove = (section: 'schedule' | 'gallery', index: number) => {
    setFormData(prev => {
      const newArray = prev[section].filter((_, i) => i !== index);
      // Update pending changes with the entire new array
      onPendingChange(section as keyof WeddingData, 'array_update', JSON.stringify(newArray));
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  return {
    handleInputChange,
    handleArrayUpdate,
    handleArrayAdd,
    handleArrayRemove
  };
};