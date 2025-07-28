import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/app/wedding/templates/[slag]/types/wedding";

const uploadImage = async (
    file: File,
    user: User,
    name: string,
): Promise<string | null> => {
    const imagePath = `user_uploads/${user.id}/${name}`;
    const { error } = await supabase.storage
        .from("gallery")
        .upload(imagePath, file, {
            upsert: true,
        });

    if (error) {
        console.log("Error Uploading image: ", error.message);
        toast({
            title: "Failed to upload image",
            description: error.message,
            variant: "destructive",
        });
        return null;
    }

    toast({
        title: "Image uploaded Successfully!",
        description: "Please wait few seconds to see the effect.",
    });

    const { data } = supabase.storage.from("gallery").getPublicUrl(imagePath);

    if (!data.publicUrl) {
        toast({
            title: "Failed to retrieve load Image!",
            variant: "destructive",
        });
        return null;
    }

    return `${data.publicUrl}?t=${Date.now()}`;
};

export default uploadImage;
