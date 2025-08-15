import React, { useState, useEffect } from 'react';
import { TextInput } from './FormComponents';
import { Button } from '@/components/ui/button';
import { Copy, Check, Globe, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/app/wedding/contexts/WeddingContext';
import { useToast } from '@/hooks/use-toast';

interface CustomUrlInputProps {
  className?: string;
  selectedTemplate?: string; // Add this prop
}

export const CustomUrlInput: React.FC<CustomUrlInputProps> = ({ className, selectedTemplate }) => {
  const { user, weddingData } = useWedding(); // Add weddingData here
  const { toast } = useToast();
  const [urlSlug, setUrlSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [baseDomain, setBaseDomain] = useState('https://your-domain.com'); // Keep this state variable
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Fetch template URL when selectedTemplate changes
  useEffect(() => {
    const fetchTemplateUrl = async () => {
      // Use saved template_id, not preview
      const savedTemplateId = weddingData?.template_id;
      if (!savedTemplateId) {
        setBaseDomain(""); // Remove .com fallback
        return;
      }
      
      setIsLoadingTemplate(true);
      try {
        const { data, error } = await supabase
          .from('wedding_template')
          .select('template_url')
          .eq('template_id', savedTemplateId)
          .single();
          
        if (!error && data?.template_url) {
          const url = new URL(data.template_url);
          setBaseDomain(`${url.protocol}//${url.host}`);
        } else {
          setBaseDomain(""); // Blank if no saved template
        }
      } catch (err) {
        console.error("Error fetching template URL:", err);
        setBaseDomain("");
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    
    fetchTemplateUrl();
  }, [weddingData?.template_id]); // Use saved template_id


  // Load current username on component mount
  useEffect(() => {
    const loadCurrentUsername = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profile')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading username:', error);
          return;
        }
        
        if (data?.username) {
          setCurrentUsername(data.username);
          setUrlSlug(data.username);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };

    loadCurrentUsername();
  }, [user?.id]);

  // Validate slug format
  const validateSlug = (slug: string): string => {
    if (!slug) return 'URL slug is required';
    if (slug.length < 3) return 'URL slug must be at least 3 characters';
    if (slug.length > 50) return 'URL slug must be less than 50 characters';
    if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      return 'URL slug can only contain letters, numbers, hyphens, and underscores';
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return 'URL slug cannot start or end with a hyphen';
    }
    return '';
  };

  // Check if slug is unique
  const checkSlugUniqueness = async (slug: string): Promise<boolean> => {
    if (!user?.id || slug === currentUsername) return true;
    
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('username')
        .eq('username', slug)
        .neq('user_id', user.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // No rows found, slug is unique
        return true;
      }
      
      if (error) {
        console.error('Error checking slug uniqueness:', error);
        return false;
      }
      
      // If data exists, slug is not unique
      return !data;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      return false;
    }
  };

  // Handle slug input change with validation
  const handleSlugChange = async (value: string) => {
    setUrlSlug(value);
    setValidationError('');
    
    if (!value) return;
    
    // Format validation
    const formatError = validateSlug(value);
    if (formatError) {
      setValidationError(formatError);
      return;
    }
    
    // Uniqueness validation (debounced)
    setIsValidating(true);
    setTimeout(async () => {
      const isUnique = await checkSlugUniqueness(value);
      if (!isUnique) {
        setValidationError('This URL slug is already taken');
      }
      setIsValidating(false);
    }, 500);
  };

  // Save the URL slug
  const handleSave = async () => {
    if (!user?.id || !urlSlug) return;
    
    const formatError = validateSlug(urlSlug);
    if (formatError) {
      setValidationError(formatError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check uniqueness one more time before saving
      const isUnique = await checkSlugUniqueness(urlSlug);
      if (!isUnique) {
        setValidationError('This URL slug is already taken');
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from('user_profile')
        .update({ username: urlSlug })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error saving URL slug:', error);
        toast({
          title: 'Error',
          description: 'Failed to save URL slug. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setCurrentUsername(urlSlug);
      toast({
        title: 'Success',
        description: 'URL slug saved successfully!',
      });
    } catch (error) {
      console.error('Error saving URL slug:', error);
      toast({
        title: 'Error',
        description: 'Failed to save URL slug. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy full URL to clipboard
  const handleCopyUrl = async () => {
    if (!urlSlug) {
      toast({
        title: 'Error',
        description: 'Please enter a URL slug first.',
        variant: 'destructive',
      });
      return;
    }
    
    const fullUrl = `${baseDomain}/${urlSlug}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Website URL copied to clipboard.',
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const hasChanges = urlSlug !== currentUsername;
  const canSave = urlSlug && !validationError && !isValidating && hasChanges;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-gray-700">Custom Website URL</h3>
          {isLoadingTemplate && (
            <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-500"></div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <TextInput
              label="URL Slug"
              value={urlSlug}
              onChange={handleSlugChange}
              placeholder="your-custom-slug"
            />
            
            {/* URL Preview */}
            <div className="text-xs text-gray-500">
              <span className="font-medium">Your website will be:</span>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-700 font-mono">
                {baseDomain}/{urlSlug || 'your-custom-slug'}
              </div>
              {selectedTemplate && (
                <div className="mt-1 text-xs text-gray-400">
                  Template: {selectedTemplate}
                </div>
              )}
            </div>
            
            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center space-x-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{validationError}</span>
              </div>
            )}
            
            {/* Validation Loading */}
            {isValidating && (
              <div className="text-xs text-gray-500">
                Checking availability...
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={!canSave || isLoading}
              size="sm"
              className="flex-1"
            >
              {isLoading ? 'Saving...' : hasChanges ? 'Save URL Slug' : 'Saved'}
            </Button>
            
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              disabled={!urlSlug || isLoadingTemplate}
            >
              {isCopied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{isCopied ? 'Copied!' : 'Copy URL'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};