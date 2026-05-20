import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <FeaturedExperiences />
            <Categories />
            <Testimonials />
            <footer className="py-12 bg-muted/30 border-t border-border">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-muted-foreground text-sm">
                        {t("home.footer.copyright")}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
