import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default PublicLayout;
