import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWedding from '@/hooks/useWedding';
import DynamicUserWeddingPage from '../templates/DynamicUserWeddingPage';
import { toast } from '@/hooks/use-toast';

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
    globalIsLoading,
    loadAllWeddingWishes 
  } = useWedding();
  
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
  if (!isAuthInitialized) {
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

  // Show loading state while data is being fetched
  if (!isDataInitialized) {
    console.log('[WeddingEditPage] Rendering data loading state');
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="relative">
            <div className="h-20 w-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-pink-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Preparing Your Wedding Editor</h3>
          <p className="text-gray-600">Loading your wedding data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Show error state if user is not logged in or user data is missing
  if (!isLoggedIn || !user) {
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
    console.log("aaa")
    return (
      <DynamicUserWeddingPage 
        editable={true}
        template="model_4"
        webEntry={{ web_data: weddingData }}
      />
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
