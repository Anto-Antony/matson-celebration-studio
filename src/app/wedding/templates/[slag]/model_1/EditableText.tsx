import { useContext, useState } from "react";
import { Edit3 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWedding } from "../contexts/WeddingContext";

interface EditableTextProps {
    value: string;
    onSave: (value: string) => Promise<void> | void;
    className?: string;
    multiline?: boolean;
    label?: string;
}

const EditableText = ({
    value,
    onSave,
    className = "",
    multiline = false,
    label,
}: EditableTextProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const { isLoggedIn } = useWedding();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(editValue);
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsOpen(false);
    };

    if (!isLoggedIn) {
        return <span className={className}>{value}</span>;
    }

    return (
        <>
            <div
                className={`${className} ${isLoggedIn ? "bg-red-100/50 border border-red-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-red-100/70 transition-colors relative group" : ""}`}
                onClick={() => setIsOpen(true)}
                onKeyDown={() => setIsOpen(true)}
            >
                {value}
                {isLoggedIn && (
                    <Edit3
                        size={16}
                        className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600"
                    />
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="backdrop-blur-md bg-white/90 border border-white/20">
                    <DialogHeader>
                        <DialogTitle>{label || "Edit Text"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="editText">Text</Label>
                            {multiline ? (
                                <textarea
                                    id="editText"
                                    value={editValue}
                                    onChange={(e) =>
                                        setEditValue(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-lg resize-none h-32 backdrop-blur-sm bg-white/50"
                                    rows={4}
                                />
                            ) : (
                                <Input
                                    id="editText"
                                    value={editValue}
                                    onChange={(e) =>
                                        setEditValue(e.target.value)
                                    }
                                    className="backdrop-blur-sm bg-white/50"
                                />
                            )}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditableText;
