import { Sidebar, SidebarContent, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// import { useWedding } from "@/contexts/WeddingContext";
// import { useState } from "react";

const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
];

interface TemplateSidebarProps {
  selected: string;
  setSelected: (key: string) => void;
  saving: boolean;
  handleSave: () => void;
  weddingData: { template: string };
}

export default function TemplateSidebar({ selected, setSelected, saving, handleSave, weddingData }: TemplateSidebarProps) {
  // const { editable, weddingData, updateWeddingData } = useWedding();
  // const [selected, setSelected] = useState(weddingData.template || "model_1");
  // const [saving, setSaving] = useState(false);
  const { open, setOpen } = useSidebar();
  // if (!editable) return null;

  // const handleSave = async () => {
  //   setSaving(true);
  //   await updateWeddingData({ template: selected });
  //   setSaving(false);
  // };

  return (
    <>
      {/* Only show trigger when sidebar is closed */}
      {!open && (
        <>
          <SidebarTrigger
            className="fixed left-4 z-50"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 0 16px 4px #6366f1aa, 0 2px 8px #6366f188', // Glowing effect
              animation: 'pulse-glow 1.5s infinite', // Pulse animation
            }}
            onClick={() => setOpen(true)}
          />
          {/* Pulse animation keyframes for SidebarTrigger */}
          <style>{`
            @keyframes pulse-glow {
              0% { box-shadow: 0 0 16px 4px #6366f1aa, 0 2px 8px #6366f188; }
              50% { box-shadow: 0 0 32px 8px #6366f1cc, 0 2px 16px #6366f1aa; }
              100% { box-shadow: 0 0 16px 4px #6366f1aa, 0 2px 8px #6366f1aa; }
            }
          `}</style>
        </>
      )}
      {/* Sidebar only renders when open, so space is released when closed */}
      {open && (
        <Sidebar side="left" variant="sidebar" className="w-[260px] max-w-[90vw]">
          <SidebarContent>
            {/* Close button at the top right of the sidebar */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 100,
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Close sidebar"
            >
              ×
            </button>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Choose a Template</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {templates.map(t => (
                  <div
                    key={t.key}
                    onClick={() => setSelected(t.key)}
                    style={{
                      border: selected === t.key ? '3px solid #6366f1' : '1px solid #ccc',
                      borderRadius: 8,
                      padding: 8,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      background: selected === t.key ? '#f0f4ff' : '#fff',
                      boxShadow: selected === t.key ? '0 0 8px #6366f155' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      pointerEvents: saving ? 'none' : 'auto',
                    }}
                  >
                    <img src={t.preview} alt={t.label + ' preview'} style={{ width: 120, height: 70, objectFit: 'cover', marginBottom: 8, borderRadius: 4 }} />
                    <span style={{ fontWeight: 'bold', color: selected === t.key ? '#6366f1' : '#333', fontSize: 15 }}>{t.label}</span>
                    {weddingData.template === t.key && (
                      <>
                        {/* Checkmark icon */}
                        <span style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#6366f1',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          boxShadow: '0 0 4px #6366f1aa',
                        }}>✓</span>
                        {/* Current label */}
                        <span style={{
                          marginTop: 4,
                          color: '#6366f1',
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}>Current</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || selected === weddingData.template}
              style={{
                width: '100%',
                padding: 10,
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 16,
                opacity: saving || selected === weddingData.template ? 0.6 : 1,
                cursor: saving || selected === weddingData.template ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                boxShadow: '0 0 16px 4px #6366f1aa, 0 2px 8px #6366f1aa', // Glowing effect
                animation: saving || selected === weddingData.template ? 'none' : 'pulse-glow 1.5s infinite', // Pulse animation
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {/* Pulse animation keyframes */}
            <style>{`
              @keyframes pulse-glow {
                0% { box-shadow: 0 0 16px 4px #6366f1aa, 0 2px 8px #6366f1aa; }
                50% { box-shadow: 0 0 32px 8px #6366f1cc, 0 2px 16px #6366f1aa; }
                100% { box-shadow: 0 0 16px 4px #6366f1aa, 0 2px 8px #6366f1aa; }
              }
            `}</style>
          </SidebarContent>
        </Sidebar>
      )}
    </>
  );
} 