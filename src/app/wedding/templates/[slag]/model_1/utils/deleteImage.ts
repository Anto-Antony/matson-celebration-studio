import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types/wedding";

const deleteImage = async (user: User, name: string) => {
    const imagePath = `user_uploads/${user.id}/${name}`;

    const { error } = await supabase.storage.from("images").remove([imagePath]);
    console.log(error);

    if (error) {
        toast({
            title: "Failed to remove image",
            variant: "destructive",
        });
        console.log("Failed to remove image", error);
        return false;
    }

    toast({
        title: "Image deleted successfully!",
    });

    return true;
};

export default deleteImage;
