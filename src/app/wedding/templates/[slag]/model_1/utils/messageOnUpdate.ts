import { toast } from "@/hooks/use-toast";

const messageOnUpdate = (
    isUpdated: boolean,
    sectionName: string,
    descriptionOnSuccess?: string,
) => {
    if (isUpdated) {
        toast({
            title: `Successfully updated ${sectionName}!`,
            description: descriptionOnSuccess
                ? `${descriptionOnSuccess}.`
                : null,
        });
        return;
    }
    toast({
        title: `Failed to update ${sectionName}!`,
        description: "Please make sure you have a stable internet connection.",
        variant: "destructive",
    });
};

export default messageOnUpdate;
