import type React from "react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWedding } from "../../contexts/WeddingContext";
import { cn } from "@/lib/utils";

interface EditableLinkProps {
    text: string;
    link: string;
    onSave: (text: string, link: string) => void;
    label?: string;
    className?: string;
    children?: React.ReactNode;
}

const EditableLink: React.FC<EditableLinkProps> = ({
    text,
    link,
    onSave,
    label,
    className,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editText, setEditText] = useState(text);
    const [editLink, setEditLink] = useState(link);
    const { isLoggedIn } = useWedding();
    const editTextInputId = useId();
    const editLinkInputId = useId();

    const handleSave = () => {
        onSave(editText, editLink);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setEditText(text);
        setEditLink(link);
        setIsOpen(false);
    };

    const handleOnEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    const handleOnClick = () => {
        setEditText(text);
        setEditLink(link);
    };

    const editableClassName = cn(
        "text-left w-full underline",
        isLoggedIn
            ? `cursor-pointer bg-red-100 hover:bg-red-200 border border-red-300 rounded px-2 py-1 transition-colors`
            : className,
    );

    if (!isLoggedIn) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-1 text-purple-600 italic text-left md:max-w-full custome_link ${className}`}
            >
                {text}
            </a>
        );
    }

    return (
        <div className={`relative group`}>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        className={`text-blue-700 ${editableClassName}`}
                        onClick={handleOnClick}
                        type="button"
                    >
                        {children || text}
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor={editTextInputId}>Text</Label>
                            <Input
                                id={editTextInputId}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={handleOnEnterKeyDown}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={editLinkInputId}>Link</Label>
                            <Input
                                id={editLinkInputId}
                                value={editLink}
                                onChange={(e) => setEditLink(e.target.value)}
                                onKeyDown={handleOnEnterKeyDown}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditableLink;
