import { useState, useEffect } from 'react';
import type { 
  WeddingData, 
  WeddingCouple, 
  WeddingStory 
} from "../../types/wedding";

// Tab types
type TabType = 'design' | 'content' | 'settings';

// Template data
const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
  { key: "model_3", label: "Template 3", preview: "/placeholder.svg" },
  { key: "model_4", label: "Template 4", preview: "/placeholder.svg" },
];

// Design options
const designOptions = {
  colors: [
    { name: 'Classic', value: 'classic' },
    { name: 'Romantic', value: 'romantic' },
    { name: 'Modern', value: 'modern' },
    { name: 'Vintage', value: 'vintage' },
  ],
  fonts: [
    { name: 'Playfair Display', value: 'playfair' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Great Vibes', value: 'great-vibes' },
    { name: 'Open Sans', value: 'open-sans' },
  ],
  layouts: [
    { name: 'Single Page', value: 'single' },
    { name: 'Multi-Page', value: 'multi' },
  ]
};

interface TemplateSidebarProps {
  selected: string;
  setSelected: (key: string) => void;
  saving: boolean;
  handleSave: (data: Partial<WeddingData>) => void | Promise<void>;
  weddingData: WeddingData & {
    colorScheme?: string;
    fontFamily?: string;
  };
  onClose?: () => void;
}

// Interface for the form data we want to edit
interface FormData {
  couple: {
    groomName: string;
    brideName: string;
    weddingQuote: string;
  };
  story: {
    title: string;
    content: string;
  };
  colorScheme: string;
  fontFamily: string;
  template: string;
}

export default function ResizableTemplateSidebar({ 
  selected, 
  setSelected, 
  saving, 
  handleSave, 
  weddingData,
  onClose 
}: TemplateSidebarProps) {
  // Initialize form data from web_data
  const getInitialFormData = (): FormData => {
    // Safely get values from weddingData with type-safe fallbacks
    const couple = weddingData?.couple || {} as WeddingCouple;
    const story = weddingData?.story || {} as WeddingStory;
    
    return {
      couple: {
        groomName: couple.groomName || '',
        brideName: couple.brideName || '',
        weddingQuote: couple.weddingQuote || ''
      },
      story: {
        title: story.title || '',
        content: story.content || ''
      },
      colorScheme: weddingData?.colorScheme || 'classic',
      fontFamily: weddingData?.fontFamily || 'playfair',
      template: selected
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  
  // Update form data when web_data or selected template changes
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [weddingData, selected]);

  // Update form data and optionally save immediately
  const updateFormData = (updates: Partial<FormData>, saveImmediately = false) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // If saveImmediately is true, save the changes
      if (saveImmediately) {
        // Create a type-safe save data object with all required fields
        const saveData: Partial<WeddingData> = {
          // Preserve existing data
          ...weddingData,
          // Update couple info
          couple: { 
            ...weddingData.couple, 
            ...newData.couple 
          },
          // Update story
          story: { 
            ...weddingData.story, 
            ...newData.story 
          },
          // Add design settings as custom properties
          ...(newData.colorScheme && { colorScheme: newData.colorScheme }),
          ...(newData.fontFamily && { fontFamily: newData.fontFamily })
        };
        
        // Save the changes - handle both Promise and void return types
        const saveResult = handleSave(saveData);
        if (saveResult && typeof saveResult.catch === 'function') {
          saveResult.catch((error: unknown) => {
            console.error('Failed to save changes:', error);
          });
        }
      }
      
      return newData;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updateFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as object),
          [child]: value
        }
      });
    } else {
      updateFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const prepareSaveData = (): Partial<WeddingData> => {
    return {
      ...weddingData,
      couple: {
        ...weddingData.couple,
        ...formData.couple
      },
      story: {
        ...weddingData.story,
        ...formData.story
      },
      colorScheme: formData.colorScheme,
      fontFamily: formData.fontFamily
    } as const;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = prepareSaveData();
      await handleSave(dataToSave);
    } catch (error) {
      console.error('Failed to save wedding data:', error);
    }
  };
  const [activeTab, setActiveTab] = useState<TabType>('design');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    templates: true,
    colors: true,
    typography: false,
    layout: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Website Editor</h2>
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('design')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'design' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'content' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'settings' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="mb-6">
          <button 
            onClick={() => toggleSection('templates')}
            className="w-full flex justify-between items-center text-left text-sm font-medium text-gray-700 mb-2"
          >
            <span>Templates</span>
            <svg 
              className={`h-5 w-5 transform transition-transform ${expandedSections.templates ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedSections.templates && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {templates.map(t => (
                <div
                  key={t.key}
                  onClick={() => setSelected(t.key)}
                  className={`relative rounded-lg overflow-hidden border-2 ${selected === t.key ? 'border-purple-500' : 'border-gray-200'}`}
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-500">{t.label}</span>
                  </div>
                  {selected === t.key && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'design' && (
          <>
            <div className="mt-6">
              <button 
                onClick={() => toggleSection('colors')}
                className="w-full flex justify-between items-center text-left text-sm font-medium text-gray-700 mb-2"
              >
                <span>Color Scheme</span>
                <svg 
                  className={`h-5 w-5 transform transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.colors && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {designOptions.colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        updateFormData({
                          ...formData,
                          colorScheme: color.value
                        }, true); // Save immediately when color changes
                      }}
                      className={`w-8 h-8 rounded-full ${formData.colorScheme === color.value ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                      style={{ backgroundColor: getColorValue(color.value) }}
                      aria-label={`Select ${color.name} color scheme`}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button 
                onClick={() => toggleSection('fonts')}
                className="w-full flex justify-between items-center text-left text-sm font-medium text-gray-700 mb-2"
              >
                <span>Font Style</span>
                <svg 
                  className={`h-5 w-5 transform transition-transform ${expandedSections.fonts ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.fonts && (
                <div className="space-y-2 mt-2">
                  {designOptions.fonts.map((font) => (
                    <button
                      key={font.value}
                      type="button"
                      onClick={() => {
                        updateFormData({
                          ...formData,
                          fontFamily: font.value
                        }, true); // Save immediately when font changes
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        formData.fontFamily === font.value
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ fontFamily: font.name }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Groom's Name</label>
              <input
                type="text"
                name="couple.groomName"
                value={formData.couple.groomName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bride's Name</label>
              <input
                type="text"
                name="couple.brideName"
                value={formData.couple.brideName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Wedding Quote</label>
              <input
                type="text"
                name="couple.weddingQuote"
                value={formData.couple.weddingQuote}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Story Title</label>
              <input
                type="text"
                name="story.title"
                value={formData.story.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Story Content</label>
              <textarea
                name="story.content"
                value={formData.story.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Website Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={weddingData.couple.groomName + " & " + weddingData.couple.brideName}
                readOnly
              />
            </div>
            {/* Add more settings here */}
          </div>
        )}
        
        {/* Form Actions */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              // Create a new object with the updated data
              const previewData: Record<string, any> = {
                ...weddingData,
                couple: {
                  ...weddingData.couple,
                  ...formData.couple
                },
                story: {
                  ...weddingData.story,
                  ...formData.story
                },
                template: selected
              };

              // Add optional fields if they exist
              if (formData.colorScheme) previewData.colorScheme = formData.colorScheme;
              if (formData.fontFamily) previewData.fontFamily = formData.fontFamily;
              
              // This would typically update some preview state
              console.log('Preview data:', previewData);
            }}
            className="mt-2 w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Preview Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper function to get color values
function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    'classic': '#8B5CF6',
    'romantic': '#EC4899',
    'modern': '#3B82F6',
    'vintage': '#F59E0B',
  };
  return colors[color] || '#8B5CF6';
}