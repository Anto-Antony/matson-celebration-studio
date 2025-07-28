import type React from "react";
import { useId, useState } from "react";
import { useWedding } from "../../contexts/WeddingContext";
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
import ImageDropArea from "./ImageDropArea";

type EditableImageProps = {
    className?: string;
    label?: string;
    imageCaptionAvailable?: boolean;
    imageCaption?: string;
    index?: number;
    onUpdate: (
        newImage: File | null,
        imageCaption?: string,
        index?: number,
    ) => Promise<void>;
    children: React.ReactNode;
    iconClassName?: string;
};

const EditableImage: React.FC<EditableImageProps> = ({
    onUpdate,
    index,
    className,
    imageCaptionAvailable = false,
    imageCaption = null,
    label = "Edit Image",
    children,
    iconClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn } = useWedding();
    const [editedImageCaption, setEditedImageCaption] = useState<string>(
        imageCaption || "",
    );
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const editCaptionId = useId();

    const handleUpdate = async () => {
        setIsLoading(true);
        await onUpdate(image, editedImageCaption, index);
        setImage(null);
        setIsOpen(false);
        setIsLoading(false);
    };

    const handleCancel = () => {
        setEditedImageCaption(imageCaption);
        setImage(null);
        setIsOpen(false);
    };

    if (!isLoggedIn) {
        return <div className={`${className}`}>{children}</div>;
    }

    const isUpdateDisabled = (
        isLoading: boolean,
        image: File,
        imageCaption: string,
        editedImageCaption: string,
    ): boolean => {
        return (
            isLoading ||
            (!image &&
                (!imageCaptionAvailable || imageCaption === editedImageCaption))
        );
    };

    return (
        <div className={`${className}`}>
            {children}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute bg-white hover:bg-gray-300 rounded-sm bottom-2 right-2 z-50 opacity-100 transition-opacity p-1 h-6 w-6 ${iconClassName}`}
                        aria-label="Edit Image"
                    >
                        ✏️
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            {imageCaptionAvailable && (
                                <>
                                    <Label htmlFor={editCaptionId}>
                                        Caption
                                    </Label>
                                    <Input
                                        id={editCaptionId}
                                        value={editedImageCaption}
                                        onChange={(e) =>
                                            setEditedImageCaption(
                                                e.target.value,
                                            )
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <ImageDropArea setImage={setImage} />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            variant="default"
                            className="rounded-sm"
                            disabled={isUpdateDisabled(
                                isLoading,
                                image,
                                imageCaption,
                                editedImageCaption,
                            )}
                        >
                            {isLoading ? "Uploading..." : "Update"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditableImage;
