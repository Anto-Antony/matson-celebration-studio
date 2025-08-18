"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import { WeddingContext, useWedding } from "@/app/wedding/contexts/WeddingContext";
import ResizableTemplateSidebar from "@/app/wedding/components/sidebar/ResizableTemplateSidebar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { WeddingData, ScheduleItem } from "@/types/wedding";
import { useToast } from "@/components/ui/use-toast";

interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Close sidebar on "routechange" when viewport is mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) setOpen(false);
    };
    window.addEventListener("routechange", handleRouteChange);
    return () => window.removeEventListener("routechange", handleRouteChange);
  }, []);

  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>;
}

// Custom hook to manage window width media check and sidebar open toggle on resize
function useResponsiveSidebar(setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop) setOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setOpen]);

  useEffect(() => {
    setOpen(window.innerWidth >= 768);
  }, [setOpen]);

  return isDesktop;
}

// Custom hook to handle click outside sidebar on mobile to close it
function useCloseSidebarOnClickOutside(open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth >= 768) return;
      const sidebar = document.querySelector("[data-sidebar]");
      const toggleButton = document.querySelector("[data-toggle-sidebar]");
      if (
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        toggleButton &&
        !toggleButton.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);
}

// Helper: transforms schedule object into array form, safely
function transformScheduleToArray(schedule: any): ScheduleItem[] {
  if (Array.isArray(schedule)) return schedule;

  if (schedule && typeof schedule === "object") {
    return Object.keys(schedule)
      .filter((key) => !isNaN(+key))
      .map((key) => schedule[key])
      .filter((item: any) => item?.id && item?.time && item?.event)
      .map(({ id, time, event, description }: any) => ({ id, time, event, description: description || "" }));
  }
  return [];
}

function DynamicUserWeddingPage() {
  const { session, weddingData } = useContext(WeddingContext) ?? {};
  const [searchParams] = useSearchParams();
  const [iframeUrl, setIframeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [templateUrl, setTemplateUrl] = useState("https://template-7.matson.app");
  const { open, setOpen } = useSidebar();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sidebarWidth, setSidebarWidth] = useState(320);

  // Add preview template state
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Track pending changes without causing rerenders on wedding data
  const [pendingChanges, setPendingChanges] = useState<Partial<WeddingData>>({});
  const weddingDataRef = useRef(weddingData);
  useEffect(() => {
    weddingDataRef.current = weddingData;
  }, [weddingData]);

  // Use preview OR saved template_id (remove hardcoded default)
  const templateToShow = previewTemplateId || weddingData?.template_id;

  // Responsive / desktop state hook
  const isDesktop = useResponsiveSidebar(setOpen);

  // Click outside hook for mobile sidebar close
  useCloseSidebarOnClickOutside(open, setOpen);

  // Fetch template URL when templateToShow changes
  useEffect(() => {
    const fetchTemplateUrl = async () => {
      if (!templateToShow) return;
      
      try {
        const { data, error } = await supabase
          .from('wedding_template')
          .select('template_url')
          .eq('template_id', templateToShow)
          .single();

        if (error) {
          console.error('Error fetching template URL:', error);
          return;
        }

        if (data?.template_url) {
          setTemplateUrl(data.template_url);
        }
      } catch (error) {
        console.error('Error fetching template URL:', error);
      }
    };

    fetchTemplateUrl();
  }, [templateToShow]);

  // Compose iframe login URL once per session or searchParam updates
  useEffect(() => {
    const accessToken = searchParams.get("access_token") ?? session?.access_token ?? "";
    const refreshToken = searchParams.get("refresh_token") ?? session?.refresh_token ?? "";
    const url = new URL(`${templateUrl}/login`);
    accessToken && url.searchParams.append("access_token", accessToken);
    refreshToken && url.searchParams.append("refresh_token", refreshToken);
    setIframeUrl(url.toString());
    setIsLoading(false);
  }, [searchParams, session, templateUrl]);

  const { updateWeddingData } = useWedding();
  const { toast } = useToast();

  // Saves a single field immediately
  const handleFieldChange = useCallback(
    async (section: keyof WeddingData, field: string, value: string) => {
      if (!weddingData) return;
      const immediateData = {
        ...weddingData,
        [section]: { ...(weddingData[section] as any), [field]: value },
      };
      try {
        const success = await updateWeddingData(immediateData);
        if (success) {
          toast({
            title: "Saved",
            description: `${field} saved successfully.`,
            variant: "default",
          });
          setPendingChanges((prev) => {
            const updated = { ...prev };
            if (updated[section]) {
              const sectionData = { ...(updated[section] as any) };
              delete sectionData[field];
              if (Object.keys(sectionData).length === 0) {
                delete updated[section];
              } else {
                updated[section] = sectionData;
              }
            }
            return updated;
          });
        }
      } catch (error) {
        console.error("Failed to save field:", error);
        toast({
          title: "Error",
          description: "Failed to save field.",
          variant: "destructive",
        });
      }
    },
    [weddingData, updateWeddingData, toast]
  );

  // Helper: update array in pending changes
  const updateArrayField = (
    prev: Partial<WeddingData>,
    section: keyof WeddingData,
    index: number,
    arrayField: string,
    value: string
  ) => {
    const currentArray = (prev[section] as any) ?? (weddingDataRef.current?.[section] as any) ?? [];
    const newArray = Array.isArray(currentArray) ? [...currentArray] : [];
    while (newArray.length <= index) {
      if (section === "schedule") {
        newArray.push({ id: "", time: "", event: "", description: "" });
      } else if (section === "gallery") {
        newArray.push({ url: "", name: "", caption: "" });
      } else {
        newArray.push({});
      }
    }
    newArray[index] = { ...newArray[index], [arrayField]: value };
    return { ...prev, [section]: newArray };
  };

  // Pending changes handler for inputs without immediate saves; supports array and normal keys
  const handlePendingChange = useCallback(
    (section: keyof WeddingData, field: string, value: string) => {
      setPendingChanges((prev) => {
        // Handle top-level properties like template_id
        if (section === 'template_id' || field === '') {
          return { ...prev, [section]: value };
        }
        
        if (field === "array_update") {
          try {
            const newArray = JSON.parse(value);
            return { ...prev, [section]: newArray };
          } catch (error) {
            console.error("Failed to parse array update:", error);
            return prev;
          }
        }
        if (field.includes(".")) {
          const [indexStr, arrayField] = field.split(".");
          const index = parseInt(indexStr);
          if (!isNaN(index)) {
            return updateArrayField(prev, section, index, arrayField, value);
          }
        }
        const sectionData = {
          ...((prev[section] as any) ?? (weddingDataRef.current?.[section] as any) ?? {}),
        };
        sectionData[field] = value;
        return { ...prev, [section]: sectionData };
      });
    },
    []
  );

  const handleTemplateChange = useCallback((id: string) => {
    // Instead of saving immediately, just update pending changes
    setPendingChanges(prev => ({ ...prev, template_id: id }));
  }, []);

  // Send wedding data updates to iframe, including pending template changes
  useEffect(() => {
    if (iframeRef.current && weddingData) {
      const sanitizedWeddingData = {
        ...weddingData,
        ...pendingChanges, // Include pending changes
        schedule: transformScheduleToArray(weddingData.schedule),
        gallery: Array.isArray(weddingData.gallery) ? weddingData.gallery : [],
      };
      iframeRef.current.contentWindow?.postMessage(
        {
          type: "WEDDING_DATA_UPDATE",
          weddingData: sanitizedWeddingData,
        },
        "*"
      );
    }
  }, [weddingData, pendingChanges]); // Add pendingChanges as dependency

  const toggleSidebar = useCallback(() => setOpen((o) => !o), [setOpen]);

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-matson-gold"></div>
      </div>
    );

  const sidebarStyles = {
    width: sidebarWidth,
    minWidth: 250,
  };

  const mainContentStyles = {
    marginLeft: isDesktop ? (open ? `${sidebarWidth}px` : "0") : "0",
    width: isDesktop ? (open ? `calc(100% - ${sidebarWidth}px)` : "100%") : "100%",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {weddingData && (
        <div
          data-sidebar
          className={cn(
            "fixed z-30 h-full transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          style={sidebarStyles}
        >
          <ResizableTemplateSidebar
            selected={templateToShow}
            setSelected={(tid) => setPreviewTemplateId(tid)}
            weddingData={weddingData}
            onClose={() => setOpen(false)}
            onFieldChange={handleFieldChange}
            onPendingChange={handlePendingChange}
            pendingChanges={pendingChanges}
            onWidthChange={setSidebarWidth}
            setPendingChanges={setPendingChanges}
            previewTemplateId={previewTemplateId}
            onSaveComplete={() => setPreviewTemplateId(null)}
          />
        </div>
      )}

      <div
        className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
        style={mainContentStyles}
      >
        <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center">
          <div className="flex items-center space-x-4">
            <button
              data-toggle-sidebar
              onClick={toggleSidebar}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-medium text-gray-800">Website Preview</h1>
          </div>
        </header>

        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
            <iframe
              ref={iframeRef}
              src={`${iframeUrl}${iframeUrl.includes("?") ? "&" : "?"}template=${encodeURIComponent(
                templateToShow
              )}`}
              className="w-full h-full border-0"
              title="Wedding Website Preview"
              allow="camera; microphone; fullscreen;"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                const sanitizedWeddingData = weddingData
                  ? {
                      ...weddingData,
                      ...pendingChanges, // Include pending changes in onLoad message
                      schedule: transformScheduleToArray(weddingData.schedule),
                      gallery: Array.isArray(weddingData.gallery) ? weddingData.gallery : [],
                    }
                  : null;
                iframeRef.current?.contentWindow?.postMessage(
                  {
                    type: "TEMPLATE_CHANGED",
                    template: templateToShow,
                    weddingData: sanitizedWeddingData,
                  },
                  "*"
                );
                setIsLoading(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DynamicUserWeddingPageWrapper() {
  return (
    <SidebarProvider>
      <DynamicUserWeddingPage />
    </SidebarProvider>
  );
}
