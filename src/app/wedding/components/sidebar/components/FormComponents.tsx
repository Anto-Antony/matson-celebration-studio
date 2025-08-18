import React from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

// Helper component for text inputs
export const TextInput = ({ label, value, onChange, onKeyDown, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white hover:border-gray-400"
    />
  </div>
);

// Helper component for textareas
export const TextArea = ({ label, value, onChange, onKeyDown, placeholder, rows = 3 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white hover:border-gray-400 resize-vertical"
    />
  </div>
);

// Helper component for toggle switches
export const ToggleSwitch = ({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full transition-colors ${
        checked ? 'bg-purple-500' : 'bg-gray-400'
      }`} />
      <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={() => onChange(!checked)}>{label}</label>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 shadow-sm",
        checked ? "bg-purple-600 shadow-purple-200" : "bg-gray-300 hover:bg-gray-400"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

// Helper component for image upload
export const ImageUpload = ({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-200">
      {value ? (
        <div className="space-y-2">
          <img src={value} alt="Preview" className="w-full h-24 object-cover rounded-lg shadow-sm" />
          <button
            onClick={() => onChange('')}
            className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-6 h-6 text-gray-400 mx-auto" />
          <p className="text-xs text-gray-500">Click to upload image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // In a real app, you'd upload this to a server
                const url = URL.createObjectURL(file);
                onChange(url);
              }
            }}
            className="hidden"
            id={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="cursor-pointer text-purple-600 hover:text-purple-800 text-xs font-medium transition-colors"
          >
            Choose File
          </label>
        </div>
      )}
    </div>
  </div>
);