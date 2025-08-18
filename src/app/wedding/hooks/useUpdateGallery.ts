import useWedding from "@/hooks/useWedding";
import deleteImage from "@/utils/deleteImage";
import messageOnUpdate, { useCase } from "@/utils/messageOnUpdate";

const useUpdateGallery = () => {
    const { weddingData, updateWeddingData, user } = useWedding();

    const handleDelete = async (name: string, indexToRemove: number) => {
        const updatedGallery = [...weddingData.gallery];
        updatedGallery.splice(indexToRemove, 1);

        const updated = await deleteImage(user, name);

        if (!updated) {
            return;
        }

        const isUpdated = await updateWeddingData({ gallery: updatedGallery });
        messageOnUpdate(isUpdated, "photo", useCase.Delete);
    };

    const saveGalleryItem = async (index: number, field: string, value: string) => {
        const updatedGallery = [...weddingData.gallery];
        updatedGallery[index] = {
            ...updatedGallery[index],
            [field]: value
        };

        const isUpdated = await updateWeddingData({ gallery: updatedGallery });
        messageOnUpdate(isUpdated, "gallery item", useCase.Update);
    };

    const getSlots = (limit: number) =>
        Array.from({ length: limit }, (_, index) => {
            return (
                weddingData.gallery[index] || {
                    id: `empty-${index}`,
                    url: "",
                    caption: null,
                    name: null,
                }
            );
        });
    return { handleDelete, saveGalleryItem, getSlots };
};

export default useUpdateGallery;
