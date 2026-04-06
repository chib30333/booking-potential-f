import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <FeaturedExperiences />
            <Categories />
            <Testimonials />
            {/* Footer */}
            <footer className="py-12 bg-muted/30 border-t border-border">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-muted-foreground text-sm">
                        © 2026 Feelora. Crafted with emotion.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
