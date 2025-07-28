import { Link } from "react-router-dom";
import Gallery from "./Gallery";
import { Button } from "@/components/ui/button";

const GallerySection = () => {
    return (
        <Gallery limit={3}>
            <div className="p-6 text-center mx-auto">
                <Link to="/gallery">
                    <Button variant="outline" type="button">
                        View All Images
                    </Button>
                </Link>
            </div>
        </Gallery>
    );
};

export default GallerySection;
