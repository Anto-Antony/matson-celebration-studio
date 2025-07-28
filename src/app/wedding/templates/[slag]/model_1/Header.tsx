import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWedding } from "../contexts/WeddingContext";
import { useWeddingAuth } from "../contexts/WeddingAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import scrollToElement from "./utils/scrollToElement";
import { useSidebar } from "@/components/ui/sidebar";

const HEADER_HEIGHT = 64; // px

const Header: React.FC<{ isNotIndexPage?: boolean }> = ({ isNotIndexPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { weddingData } = useWedding();
    const { logout, isLoggedIn } = useWeddingAuth();
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const { open: sidebarOpen, isMobile: sidebarIsMobile } = useSidebar ? useSidebar() : { open: true, isMobile: false };

    const navItems = [
        { name: "Home", href: "#hero" },
        { name: "Our Story", href: "#story" },
        { name: "Details", href: "#details" },
        { name: "Schedule", href: "#schedule" },
        { name: "Gallery", href: "#gallery" },
        { name: "Wishes", href: "#wishes" },
        { name: "Contact", href: "#contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > window.innerHeight);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const LogoutButton: React.FC<{ className?: string }> = ({ className }) => {
        if (!isLoggedIn) {
            return;
        }
        return (
            <button
                key={"logoutButton"}
                onClick={handleLogout}
                className={className}
                type="button"
            >
                Logout
            </button>
        );
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        toast({ title: "You have logged out!" });
    };

    const scrollToSection = (elementId: string) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: elementId } });
            return;
        }
        scrollToElement(elementId);
        setIsOpen(false);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white/20 border-b border-white/20 transition-all duration-200 h-auto",
                (!isScrolled || isNotIndexPage) && "bg-transparent",
            )}
            style={{
                marginLeft: sidebarOpen && !sidebarIsMobile ? '16rem' : 0,
                height: HEADER_HEIGHT,
                transition: 'all 0.3s',
            }}
        >
            <nav
                className={cn(
                    "container mx-auto px-4 py-4",
                    isOpen && "h-screen",
                )}
            >
                <div className="flex items-center justify-between">
                    <Link
                        className={cn(
                            "text-2xl font-bold font-Faculty-Glyphic text-white",
                            (isScrolled || isNotIndexPage) && "text-purple-600",
                        )}
                        to="/"
                        onClick={() => scrollToSection("#hero")}
                    >
                        {weddingData.couple.groomName[0]} &{" "}
                        {weddingData.couple.brideName[0]} Wedding
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                                type="button"
                            >
                                {item.name}
                            </button>
                        ))}
                        <LogoutButton className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium" />
                    </div>

                    {/* Mobile Navigation Button */}
                    <button
                        className="md:hidden p-2 rounded-lg backdrop-blur-sm bg-white/30 border border-white/20"
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={cn(
                        "md:hidden mt-4 backdrop-blur-md bg-white/30 rounded-2xl border border-white/20 p-4 transition-opacity duration-200",
                        isOpen
                            ? "translate-x-0 opacity-100"
                            : "translate-x-full opacity-0 -mt-10",
                    )}
                >
                    <div className={cn("space-y-3", !isOpen && "hidden")}>
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-white/20 rounded-lg transition-all duration-200"
                                type="button"
                            >
                                {item.name}
                            </button>
                        ))}
                        <LogoutButton className="block w-full text-left px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-white/20 rounded-lg transition-all duration-200" />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export { HEADER_HEIGHT };
export default Header;
