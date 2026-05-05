import { type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

const PageLayout = ({ children, mainClassName = "pt-24 pb-20" }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
