import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import AdditionalInfoSection from "./AdditionalInfoSection";
import Background from "./Background";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import GallerySection from "./GallerySection";
import Header, { HEADER_HEIGHT } from "./Header";
import HeroSection from "./HeroSection";
import JewellerSection from "./JewellerSection";
import Loading from "./Loading";
import ScheduleSection from "./ScheduleSection";
import StorySection from "./StorySection";
import WeddingDetailsSection from "./WeddingDetailsSection";
import WishesSection from "./WishesSection";
import { useWedding } from "../contexts/WeddingContext";
import scrollToElement from "./utils/scrollToElement";

const UserWeddingPage = () => {
    const { user_id } = useParams();
    const { globalIsLoading, loadWeddingData, editable } = useWedding();
    const location = useLocation();

    // Fetch the relevant wedding data when the route changes
    useEffect(() => {
        if (user_id) {
            loadWeddingData(user_id);
        }
    }, [user_id, loadWeddingData]);

    // Optionally scroll to section if specified in the link state
    useEffect(() => {
        const elementId = location.state?.scrollTo;
        if (elementId) {
            scrollToElement(elementId);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    if (globalIsLoading) {
        return <Loading />;
    }

    return (
        <Background>
            <div className="relative z-10" style={{ paddingTop: HEADER_HEIGHT }}>
                <Header />
                
                <main>
                    <HeroSection />
                    <StorySection />
                    <WeddingDetailsSection />
                    <ScheduleSection />
                    <GallerySection />
                    <JewellerSection />
                    <AdditionalInfoSection />
                    <WishesSection />
                    <ContactSection />
                    <Footer />
                </main>
            </div>
        </Background>
    );
};

export default UserWeddingPage;
