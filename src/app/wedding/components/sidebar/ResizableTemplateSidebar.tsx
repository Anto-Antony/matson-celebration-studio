import type { WeddingData } from "../../types/wedding";

const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
  { key: "model_3", label: "Template 3", preview: "/placeholder.svg" },
  { key: "model_4", label: "Template 4", preview: "/placeholder.svg" },
];

interface TemplateSidebarProps {
  selected: string;
  setSelected: (key: string) => void;
  saving: boolean;
  handleSave: () => void;
  weddingData: WeddingData;
}

export default function ResizableTemplateSidebar({ selected, setSelected, saving, handleSave, weddingData }: TemplateSidebarProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
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
        }}
      >
        {saving ? 'Saving...' : 'Save Template'}
      </button>
    </div>
  );
}