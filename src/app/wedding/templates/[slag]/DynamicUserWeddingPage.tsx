import { useWedding } from "./WeddingContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import TemplateSidebar from "./sidebar/TemplateSidebar";

const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
];

// Use import.meta.glob to import all possible template pages
const templatePages = import.meta.glob("./model_*/[user_id]/page.tsx");

export default function DynamicUserWeddingPage() {
  const { weddingData, editable, updateWeddingData } = useWedding();
  const { user_id } = useParams();
  // selected is now lifted up
  const [selected, setSelected] = useState(weddingData.template || "model_1");
  const [TemplateComponent, setTemplateComponent] = useState<React.ComponentType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // When weddingData.template changes (after save), update selected
    setSelected(weddingData.template || "model_1");
  }, [weddingData.template]);

  useEffect(() => {
    // Use selected for preview
    const template = selected || "model_1";
    const importPath = `./${template}/[user_id]/page.tsx`;
    const importFn = templatePages[importPath];
    if (importFn) {
      importFn().then((mod: any) => setTemplateComponent(() => mod.default));
    } else {
      setTemplateComponent(() => null);
    }
  }, [selected, user_id]);

  const handleSave = async () => {
    setSaving(true);
    await updateWeddingData({ template: selected });
    setSaving(false);
  };

  return (
    <SidebarProvider>
      {editable && (
       <TemplateSidebar
         selected={selected}
         setSelected={setSelected}
         saving={saving}
         handleSave={handleSave}
         weddingData={weddingData}
       />
      )}
      <main className="transition-all duration-300 ease-in-out">
        { !TemplateComponent ? <div>Loading...</div> : <TemplateComponent /> }
      </main>
    </SidebarProvider>
  );
}
