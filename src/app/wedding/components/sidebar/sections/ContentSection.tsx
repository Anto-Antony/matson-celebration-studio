import React from 'react';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { TextInput, TextArea, ToggleSwitch, ImageUpload } from '../components/FormComponents';
import { Plus, Trash2 } from 'lucide-react';
import useUpdateSchedule from '@/app/wedding/hooks/useupdateschedule';
import useUpdateCouple from '@/app/wedding/hooks/useUpdateCouple';
import useUpdateStory from '@/app/wedding/hooks/useUpdateStory';
import useUpdateContacts from '@/app/wedding/hooks/useUpdateContacts';
import useUpdateMoreInfo from '@/app/wedding/hooks/useUpdateMoreInfo';
import type { FormData } from '../hooks/useSidebarForm';

// Custom hook for binding input fields to form data and update functions
const useBoundField = (setFormData, updateFn, section, field, onPendingChange?) => ({
  onChange: (val: string) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: val } }));
    // Track pending changes for non-Enter key changes
    if (onPendingChange) {
      onPendingChange(section, field, val);
    }
  },
  onKeyDown: (e: React.KeyboardEvent) => {
    const isTextArea = e.currentTarget instanceof HTMLTextAreaElement;
    if (e.key === 'Enter' && (!isTextArea || !e.shiftKey)) {
      if (isTextArea) e.preventDefault();
      updateFn((e.target as HTMLInputElement | HTMLTextAreaElement).value);
    }
  }
});

// Reusable toggle switch for enabling/disabling sections
const SectionToggle = ({ label, section, formData, setFormData, onFieldChange }) => (
  <ToggleSwitch
    label={label}
    checked={!formData[section].disabled}
    onChange={checked => {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], disabled: !checked }
      }));
      onFieldChange(section, 'disabled', !checked);
    }}
  />
);

// Reusable nested event component for Wedding Details events
const EventSection = ({ label, data, onChange }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center space-x-2 mb-3">
      <div className="w-2 h-2 bg-purple-500 rounded-full" />
      <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
    </div>
    <div className="space-y-2">
      <TextInput
        label="Title"
        value={data?.title || ''}
        onChange={v => onChange('title', v)}
        placeholder="Enter event title"
      />
      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Date"
          value={data?.date || ''}
          onChange={v => onChange('date', v)}
          placeholder="e.g., June 10, 2020"
        />
        <TextInput
          label="Time"
          value={data?.time || ''}
          onChange={v => onChange('time', v)}
          placeholder="e.g., 5:00 PM"
        />
      </div>
      <TextInput
        label="Venue"
        value={data?.venue || ''}
        onChange={v => onChange('venue', v)}
        placeholder="Enter venue name"
      />
      <TextArea
        label="Address"
        value={data?.address || ''}
        onChange={v => onChange('address', v)}
        rows={2}
        placeholder="Enter address"
      />
      <TextInput
        label="Address Map Link"
        type="url"
        value={data?.addressMapLink || ''}
        onChange={v => onChange('addressMapLink', v)}
        placeholder="Enter map link URL"
      />
    </div>
  </div>
);

// Reusable component for "To Know" items
const ToKnowSection = ({ label, data, onChange }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center space-x-2 mb-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
    </div>
    <div className="space-y-2">
      <TextInput
        label="Title"
        value={data?.title || ''}
        onChange={v => onChange('title', v)}
        placeholder="Enter title"
      />
      <TextArea
        label="Description"
        value={data?.description || ''}
        onChange={v => onChange('description', v)}
        rows={2}
        placeholder="Enter description"
      />
    </div>
  </div>
);

// Schedule item component
const ScheduleItem = ({ item, index, handleArrayUpdate, handleArrayRemove, saveScheduleItem, removeScheduleItem }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <h4 className="text-sm font-semibold text-gray-700">Schedule Item {index + 1}</h4>
      </div>
      <button
        onClick={() => item.id ? removeScheduleItem(item.id) : handleArrayRemove('schedule', index)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all duration-200"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Time"
          value={item.time}
          onChange={v => handleArrayUpdate('schedule', index, 'time', v)}
          onKeyDown={e => e.key === 'Enter' && item.id && saveScheduleItem(item.id, 'time', (e.target as HTMLInputElement).value)}
          placeholder="e.g., 2:00 PM"
        />
        <TextInput
          label="Event"
          value={item.event}
          onChange={v => handleArrayUpdate('schedule', index, 'event', v)}
          onKeyDown={e => e.key === 'Enter' && item.id && saveScheduleItem(item.id, 'event', (e.target as HTMLInputElement).value)}
          placeholder="e.g., Ceremony"
        />
      </div>
      <TextArea
        label="Description"
        value={item.description}
        onChange={v => handleArrayUpdate('schedule', index, 'description', v)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && item.id && (e.preventDefault(), saveScheduleItem(item.id, 'description', (e.target as HTMLTextAreaElement).value))}
        rows={2}
        placeholder="Event description"
      />
    </div>
  </div>
);

// Gallery item component
const GalleryItem = ({ item, index, handleArrayUpdate, handleArrayRemove }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-pink-500 rounded-full" />
        <h4 className="text-sm font-semibold text-gray-700">Gallery Item {index + 1}</h4>
      </div>
      <button 
        onClick={() => handleArrayRemove('gallery', index)} 
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all duration-200"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <div className="space-y-2">
      <TextInput label="Image URL" value={item.url || ''} onChange={v => handleArrayUpdate('gallery', index, 'url', v)} placeholder="Enter image URL" />
      <TextInput label="Caption" value={item.caption || ''} onChange={v => handleArrayUpdate('gallery', index, 'caption', v)} placeholder="Enter image caption" />
    </div>
  </div>
);

export const ContentSection: React.FC<{
  formData: FormData;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  onFieldChange: (section: string, field: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (section: string, field: string, value: any, event?: React.KeyboardEvent) => void;
  handleArrayUpdate: (section: string, index: number, field: string, value: any) => void;
  handleArrayAdd: (section: string) => void;
  handleArrayRemove: (section: string, index: number) => void;
  onPendingChange?: (section: string, field: string, value: any) => void;
}> = ({
  formData,
  expandedSections,
  toggleSection,
  onFieldChange,
  setFormData,
  handleInputChange,
  handleArrayUpdate,
  handleArrayAdd,
  handleArrayRemove,
  onPendingChange
}) => {
  const { saveScheduleItem, addScheduleItem, removeScheduleItem } = useUpdateSchedule();
  const { updateGroomName, updateBrideName, updateWeddingQuote } = useUpdateCouple();
  const { updateStoryTitle, updateStoryContent } = useUpdateStory();
  const { updateContact } = useUpdateContacts();
  const { updateTitle: updateMoreInfoTitle, updateContent: updateMoreInfoContent } = useUpdateMoreInfo();

  // Helper to update event or toKnow fields in weddingDetails
  const updateWeddingDetailsField = (key: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      weddingDetails: {
        ...prev.weddingDetails,
        [key]: { ...prev.weddingDetails[key], [field]: value }
      }
    }));
    // Trigger pending changes tracking
    onPendingChange?.('weddingDetails', `${key}.${field}`, value);
  };

  return (
    <>
      {/* Couple Section */}
      <CollapsibleSection title="Couple Information" isExpanded={expandedSections.couple} onToggle={() => toggleSection('couple')}>
        <div className="space-y-4">
          <TextInput label="Groom's Name" value={formData.couple.groomName} {...useBoundField(setFormData, updateGroomName, 'couple', 'groomName', onPendingChange)} placeholder="Enter groom's name" />
          <TextInput label="Bride's Name" value={formData.couple.brideName} {...useBoundField(setFormData, updateBrideName, 'couple', 'brideName', onPendingChange)} placeholder="Enter bride's name" />
          <TextArea label="Wedding Quote" value={formData.couple.weddingQuote} {...useBoundField(setFormData, updateWeddingQuote, 'couple', 'weddingQuote', onPendingChange)} rows={3} placeholder="Enter wedding quote" />
          <ImageUpload label="Couple Image" value={formData.couple.image} onChange={val => setFormData(prev => ({ ...prev, couple: { ...prev.couple, image: val } }))} />
        </div>
      </CollapsibleSection>

      {/* Story Section */}
      <CollapsibleSection title="Story Section" isExpanded={expandedSections.story} onToggle={() => toggleSection('story')}>
        <div className="space-y-4">
          <SectionToggle label="Enable Story Section" section="story" {...{ formData, setFormData, onFieldChange }} />
          <TextInput label="Story Title" value={formData.story.title} {...useBoundField(setFormData, updateStoryTitle, 'story', 'title', onPendingChange)} placeholder="Enter story title" />
          <TextArea label="Story Content" value={formData.story.content} {...useBoundField(setFormData, updateStoryContent, 'story', 'content', onPendingChange)} rows={4} placeholder="Tell your love story" />
          <ImageUpload label="Story Image" value={formData.story.image} onChange={val => setFormData(prev => ({ ...prev, story: { ...prev.story, image: val } }))} />
        </div>
      </CollapsibleSection>

      {/* Wedding Details Section */}
      <CollapsibleSection title="Wedding Details" isExpanded={expandedSections.weddingDetails} onToggle={() => toggleSection('weddingDetails')}>
        <div className="space-y-4">
          <SectionToggle label="Enable Wedding Details Section" section="weddingDetails" {...{ formData, setFormData, onFieldChange }} />

          {/* Render Events dynamically */}
          {['event1', 'event2'].map(key => (
            <EventSection
              key={key}
              label={`Event ${key === 'event1' ? 1 : 2}`}
              data={formData.weddingDetails[key]}
              onChange={(field, value) => updateWeddingDetailsField(key, field, value)}
            />
          ))}

          {/* Render To Know dynamically */}
          {[1, 2, 3].map(num => (
            <ToKnowSection
              key={num}
              label={`To Know ${num}`}
              data={formData.weddingDetails[`toKnow${num}`]}
              onChange={(field, value) => updateWeddingDetailsField(`toKnow${num}`, field, value)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Schedule Section */}
      <CollapsibleSection title="Schedule" isExpanded={expandedSections.schedule} onToggle={() => toggleSection('schedule')}>
        <div className="space-y-4">
          {(formData.schedule || []).map((item, index) => (
            <ScheduleItem
              key={item.id || index}
              {...{ item, index, handleArrayUpdate, handleArrayRemove, saveScheduleItem, removeScheduleItem }}
            />
          ))}
          <button
            onClick={() => {
              try {
                addScheduleItem();
              } catch {
                handleArrayAdd('schedule');
              }
            }}
            className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-2 transition-all duration-200 font-semibold text-sm bg-white shadow-sm hover:shadow-md"
          >
            <Plus size={16} /> Add Schedule Item
          </button>
        </div>
      </CollapsibleSection>

      {/* Gallery Section */}
      <CollapsibleSection title="Gallery" isExpanded={expandedSections.gallery} onToggle={() => toggleSection('gallery')}>
        <div className="space-y-4">
          <SectionToggle label="Enable Gallery Section" section="gallery" {...{ formData, setFormData, onFieldChange }} />
          {(formData.gallery || []).map((item, index) => (
            <GalleryItem key={index} {...{ item, index, handleArrayUpdate, handleArrayRemove }} />
          ))}
          <button
            onClick={() => handleArrayAdd('gallery')}
            className="w-full py-3 border-2 border-dashed border-pink-300 rounded-xl text-pink-600 hover:border-pink-400 hover:text-pink-700 hover:bg-pink-50 flex items-center justify-center gap-2 transition-all duration-200 font-semibold text-sm bg-white shadow-sm hover:shadow-md"
          >
            <Plus size={16} /> Add Gallery Item
          </button>
        </div>
      </CollapsibleSection>

      {/* More Info Section */}
      <CollapsibleSection title="More Info Section" isExpanded={expandedSections.moreInfo} onToggle={() => toggleSection('moreInfo')}>
        <div className="space-y-4">
          <SectionToggle label="Enable More Info Section" section="moreInfo" {...{ formData, setFormData, onFieldChange }} />
          <TextInput label="Title" value={formData.moreInfo.title} {...useBoundField(setFormData, updateMoreInfoTitle, 'moreInfo', 'title', onPendingChange)} placeholder="Enter more info title" />
          <TextArea label="Content" value={formData.moreInfo.content} {...useBoundField(setFormData, updateMoreInfoContent, 'moreInfo', 'content', onPendingChange)} rows={4} placeholder="Enter more info content" />
        </div>
      </CollapsibleSection>

      {/* Contact Section */}
      <CollapsibleSection title="Contact Information" isExpanded={expandedSections.contact} onToggle={() => toggleSection('contact')}>
        <div className="space-y-4">
          <SectionToggle label="Enable Contact Section" section="contact" {...{ formData, setFormData, onFieldChange }} />
          <TextInput label="Email" type="email" value={formData.contact.email} {...useBoundField(setFormData, v => updateContact('email', v), 'contact', 'email', onPendingChange)} placeholder="Enter email address" />
          <TextInput label="Phone" type="tel" value={formData.contact.phone} {...useBoundField(setFormData, v => updateContact('phone', v), 'contact', 'phone', onPendingChange)} placeholder="Enter phone number" />
          <TextArea label="Address" value={formData.contact.address} {...useBoundField(setFormData, v => updateContact('address', v), 'contact', 'address', onPendingChange)} rows={2} placeholder="Enter address" />
          <TextInput label="Address Map Link" type="url" value={formData.contact.addressMapLink} onChange={v => handleInputChange('contact', 'addressMapLink', v)} onKeyDown={e => handleInputChange('contact', 'addressMapLink', (e.target as HTMLInputElement).value, e)} placeholder="Enter map link URL" />
        </div>
      </CollapsibleSection>
    </>
  );
};
