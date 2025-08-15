import { toast as sToast } from "sonner";
import { toast } from "@/hooks/use-toast";

export enum useCase {
    Update,
    Delete,
    Save,
}

const messageOnUpdate = (
    isUpdated: boolean,
    sectionName: string,
    action: useCase = useCase.Update,
    descriptionOnSuccess?: string,
) => {
    let actionMessage = "updated";

    switch (action) {
        case useCase.Delete:
            actionMessage = "deleted";
            break;
        case useCase.Save:
            actionMessage = "saved";
            break;
    }

    // Fixed logic: Show error when isUpdated is FALSE
    if (!isUpdated) {
        toast({
            title: `Failed to update ${sectionName}!`,
            description:
                "Please make sure you have a stable internet connection.",
            variant: "destructive",
        });
        return;
    }

    // Show success when isUpdated is TRUE
    if (descriptionOnSuccess === undefined) {
        sToast.success(`Successfully ${actionMessage} ${sectionName}!`);
        return;
    }
    toast({
        title: `Successfully ${actionMessage} ${sectionName}!`,
        description: descriptionOnSuccess,
    });
};

export default messageOnUpdate;
