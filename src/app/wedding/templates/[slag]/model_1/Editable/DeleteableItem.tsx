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
import { useWedding } from "../../contexts/WeddingContext";

interface DeleteableItemProps {
    value?: string;
    onSave?: (newValue: string) => void;
    onDelete?: () => void;
    label?: string;
    className?: string;
    children?: React.ReactNode;
    isLoading?: boolean;
}

const DeletableItem: React.FC<DeleteableItemProps> = ({
    value,
    onDelete,
    label = "Edit Text",
    className = "",
    children,
    isLoading,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn } = useWedding();

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleDelete = () => {
        if (onDelete) onDelete();
        setIsOpen(false);
    };

    if (!isLoggedIn) {
        return <span className={className}>{children || value}</span>;
    }

    return (
        <div className={`relative group ${className}`}>
            <span>{children || value}</span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white hover:bg-gray-300 opacity-100 transition-opacity p-1 h-6 w-6"
                    >
                        {/* Trash can Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Delete</title>
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                    d="M2.75 6.16667C2.75 5.70644 3.09538 5.33335 3.52143 5.33335L6.18567 5.3329C6.71502 5.31841 7.18202 4.95482 7.36214 4.41691C7.36688 4.40277 7.37232 4.38532 7.39185 4.32203L7.50665 3.94993C7.5769 3.72179 7.6381 3.52303 7.72375 3.34536C8.06209 2.64349 8.68808 2.1561 9.41147 2.03132C9.59457 1.99973 9.78848 1.99987 10.0111 2.00002H13.4891C13.7117 1.99987 13.9056 1.99973 14.0887 2.03132C14.8121 2.1561 15.4381 2.64349 15.7764 3.34536C15.8621 3.52303 15.9233 3.72179 15.9935 3.94993L16.1083 4.32203C16.1279 4.38532 16.1333 4.40277 16.138 4.41691C16.3182 4.95482 16.8778 5.31886 17.4071 5.33335H19.9786C20.4046 5.33335 20.75 5.70644 20.75 6.16667C20.75 6.62691 20.4046 7 19.9786 7H3.52143C3.09538 7 2.75 6.62691 2.75 6.16667Z"
                                    fill="#d20000"
                                ></path>{" "}
                                <path
                                    opacity="0.5"
                                    d="M11.6068 21.9998H12.3937C15.1012 21.9998 16.4549 21.9998 17.3351 21.1366C18.2153 20.2734 18.3054 18.8575 18.4855 16.0256L18.745 11.945C18.8427 10.4085 18.8916 9.6402 18.45 9.15335C18.0084 8.6665 17.2628 8.6665 15.7714 8.6665H8.22905C6.73771 8.6665 5.99204 8.6665 5.55047 9.15335C5.10891 9.6402 5.15777 10.4085 5.25549 11.945L5.515 16.0256C5.6951 18.8575 5.78515 20.2734 6.66534 21.1366C7.54553 21.9998 8.89927 21.9998 11.6068 21.9998Z"
                                    fill="#d20000"
                                ></path>{" "}
                            </g>
                        </svg>{" "}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-between items-center gap-2">
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                disabled={isLoading}
                            >
                                {isLoading ? "Deleting..." : "Delete 🗑️"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DeletableItem;
