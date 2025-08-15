import React, { useState, useCallback } from 'react';
import { useWedding } from '@/app/wedding/contexts/WeddingContext';
import { useToast } from '@/components/ui/use-toast';
import type { WeddingData } from '@/types/wedding';

interface FloatingSaveButtonProps {
  weddingData: WeddingData | null;
  pendingChanges: Partial<WeddingData>;
  previewTemplateId: string | null;   // New
  onSaveComplete?: () => void;
  setPendingChanges: React.Dispatch<React.SetStateAction<Partial<WeddingData>>>;
}

export default function FloatingSaveButton({
  weddingData,
  pendingChanges,
  previewTemplateId,
  onSaveComplete,
  setPendingChanges
}: FloatingSaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { updateWeddingData } = useWedding();
  const { toast } = useToast();
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const hasTemplatePreview = previewTemplateId && previewTemplateId !== weddingData?.template_id;
  const shouldShowButton = hasPendingChanges || hasTemplatePreview;

  const handleSaveTemplate = useCallback(async () => {
    if (!weddingData) return;
    setIsSaving(true);

    try {
      let savePayload = buildSavePayload(weddingData, pendingChanges);
      
      // Add template_id if there's a preview
      if (previewTemplateId && previewTemplateId !== weddingData.template_id) {
        savePayload = { ...savePayload, template_id: previewTemplateId };
      }

      const success = await updateWeddingData(savePayload);
      if (!success) {
        toast({ title: "Error", description: "Failed to save changes. Please try again.", variant: "destructive" });
        return;
      }
      setPendingChanges({});
      toast({ title: "Success", description: "Your changes have been saved successfully.", variant: "default" });
      onSaveComplete?.();
    } catch (error) {
      console.error("Failed to save wedding data:", error);
      toast({ title: "Error", description: "An unexpected error occurred while saving.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }, [weddingData, pendingChanges, previewTemplateId, updateWeddingData, toast, setPendingChanges, onSaveComplete]);

  // if (!shouldShowButton && !isSaving) return null;

  return (
    <div className="sticky bottom-4 left-0 w-full flex justify-center z-50 bg-transparent">
      <button
        className="px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
        onClick={handleSaveTemplate}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{hasTemplatePreview ? 'Save Template' : 'Save Changes'}</span>
          </>
        )}
      </button>
    </div>
  );
}

// Merge current wedding data with pending changes
const buildSavePayload = (weddingData: WeddingData, pending: Partial<WeddingData>) => {
  const payload = { ...weddingData };
  Object.entries(pending).forEach(([section, changes]) => {
    if (Array.isArray(changes)) {
      payload[section as keyof WeddingData] = changes as any;
    } else if (changes && typeof changes === 'object') {
      const currentValue = payload[section as keyof WeddingData];
      const currentObject = (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) ? currentValue : {};
      payload[section as keyof WeddingData] = {
        ...currentObject,
        ...changes,
      } as any;
    }
  });
  return payload;
};
