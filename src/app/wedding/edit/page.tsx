import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWedding from '@/hooks/useWedding';
import DynamicUserWeddingPage from '../templates/DynamicUserWeddingPage';
import { toast } from '@/hooks/use-toast';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ResizableTemplateSidebar from '../components/sidebar/ResizableTemplateSidebar';
import type { WeddingData } from '@/types/wedding';

// Error logger utility
const logError = (error: unknown, context: string, additionalInfo: Record<string, any> = {}) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error(`[WeddingEditPage] ${context}:`, {
    timestamp: new Date().toISOString(),
    error: errorMessage,
    stack: errorStack,
    ...additionalInfo,
  });

  return errorMessage;
};

const WeddingEditPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isLoggedIn, 
    isAuthInitialized,
    weddingData, 
    updateWeddingData,
    globalIsLoading,
    loadAllWeddingWishes 
  } = useWedding();
  
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(weddingData?.template || 'model_4');
  const [saving, setSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (weddingData?.template) {
      setSelectedTemplate(weddingData.template);
    }
  }, [weddingData?.template]);

  const handleSaveTemplate = async (data?: Partial<WeddingData>) => {
    setSaving(true);
    try {
      if (data) {
        // If we have full data from the form, use that
        await updateWeddingData({
          ...data,
          template: selectedTemplate // Ensure template is always included
        });
      } else {
        // Fallback to just updating the template
        await updateWeddingData({ template: selectedTemplate });
      }
      toast({
        title: "Success",
        description: "Your changes have been saved.",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = logError(error, 'Failed to save wedding data');
      toast({
        title: "Error",
        description: `Failed to save changes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
    setSaving(false);
    toast({
      title: "Template Saved!",
      description: "Your wedding website has been updated.",
    });
  };

  // Handle initial auth state and data loading
  useEffect(() => {
    if (!isAuthInitialized) {
      console.log('[WeddingEditPage] Auth initialization in progress...');
      return;
    }

    if (!isLoggedIn) {
      // Show login prompt if not already shown
      if (!showLoginPrompt) {
        const loginRequiredMessage = 'User not authenticated, redirecting to login';
        console.log(`[WeddingEditPage] ${loginRequiredMessage}`);
        
        toast({
          title: "Authentication Required",
          description: "Please log in to edit your wedding website.",
          variant: "destructive",
        });
        
        setShowLoginPrompt(true);
        
        // Log the redirect attempt
        console.log('[WeddingEditPage] Scheduling redirect to login page...');
        
        // Redirect to login after a short delay
        const timer = setTimeout(() => {
          console.log('[WeddingEditPage] Executing redirect to login page');
          navigate('/login');
        }, 2000);
        
        return () => {
          console.log('[WeddingEditPage] Cleaning up login redirect timer');
          clearTimeout(timer);
        };
      }
      return;
    }

    // If we get here, user is logged in
    console.log('[WeddingEditPage] User authenticated, initializing data...');
    setShowLoginPrompt(false);

    // Initialize data loading if not already done
    const initializeData = async () => {
      if (isDataInitialized) {
        console.log('[WeddingEditPage] Data already initialized, skipping...');
        return;
      }
      
      try {
        console.log('[WeddingEditPage] Loading wedding wishes...');
        await loadAllWeddingWishes();
        console.log('[WeddingEditPage] Wedding wishes loaded successfully');
        setIsDataInitialized(true);
      } catch (error) {
        const errorMessage = logError(error, 'Failed to initialize wedding data', {
          userId: user?.id,
          isLoggedIn,
          isAuthInitialized,
        });
        
        toast({
          title: "Error Loading Data",
          description: `Failed to load wedding data: ${errorMessage}. Please refresh the page to try again.`,
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [
    isAuthInitialized, 
    isLoggedIn, 
    user, 
    loadAllWeddingWishes, 
    isDataInitialized,
    navigate,
    showLoginPrompt
  ]);

  // Show loading state while auth is initializing
  if (!isAuthInitialized || globalIsLoading || !isDataInitialized) {
    console.log('[WeddingEditPage] Rendering auth initialization loader isAuthInitialized:', isAuthInitialized);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    console.log('[WeddingEditPage] Rendering login redirect UI');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Please log in to continue</h2>
          <p className="text-gray-600 mb-6">You're being redirected to the login page...</p>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user is not logged in or user data is missing
  if (!user || !weddingData) {
    const errorMessage = !isLoggedIn ? 'User not logged in' : 'User data not available';
    console.error(`[WeddingEditPage] ${errorMessage}`, { isLoggedIn, user });
    
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the wedding editor.</p>
          <button 
            onClick={() => {
              console.log('[WeddingEditPage] Manual login button clicked');
              navigate('/login');
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  console.log('[WeddingEditPage] Rendering DynamicUserWeddingPage with wedding data');
  
  try {
    // Toggle sidebar visibility
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                aria-label="Toggle sidebar"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Wedding Editor</h1>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Sidebar */}
            <Panel 
              defaultSize={20} 
              minSize={15} 
              maxSize={30}
              className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}
            >
              <ResizableTemplateSidebar
                selected={selectedTemplate}
                setSelected={setSelectedTemplate}
                saving={saving}
                handleSave={handleSaveTemplate as (data: Partial<WeddingData>) => void}
                weddingData={weddingData}
                onClose={() => setIsSidebarOpen(false)}
              />
            </Panel>
            
            {/* Resize handle */}
            {isSidebarOpen && (
              <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
            )}
            
            {/* Main content */}
            <Panel>
              <div className="h-full overflow-y-auto">
                <DynamicUserWeddingPage 
                  editable={true}
                  template={selectedTemplate}
                  webEntry={{ web_data: weddingData }}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = logError(error, 'Failed to render DynamicUserWeddingPage', {
      hasWeddingData: !!weddingData,
      userId: user?.id,
    });
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading the wedding editor. Our team has been notified.
            Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
            <p className="text-sm font-mono text-red-500 break-words">
              {errorMessage}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                console.log('[WeddingEditPage] Refresh button clicked');
                window.location.reload();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                console.log('[WeddingEditPage] Support button clicked');
                navigate('/contact');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default WeddingEditPage;