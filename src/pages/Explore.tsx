import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/shared/PageHeader";
import ExperienceGridCard from "@/features/explore/components/ExperienceGridCard";
import ExploreFiltersPanel from "@/features/explore/components/ExploreFiltersPanel";
import { useExploreCatalog } from "@/features/explore/hooks/useExploreCatalog";
import { useExploreFilters } from "@/features/explore/hooks/useExploreFilters";

const Explore = () => {
    const { experiences, categories, isLoading, isError } = useExploreCatalog();
    const {
        search,
        setSearch,
        selectedMood,
        setSelectedMood,
        selectedCategory,
        setSelectedCategory,
        moodOptions,
        filteredExperiences,
    } = useExploreFilters(experiences);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <PageHeader
                        className="mb-10"
                        title={<>Explore <span className="gradient-text">Experiences</span></>}
                        description="Find what makes your heart sing"
                    />

                    <ExploreFiltersPanel
                        search={search}
                        onSearchChange={setSearch}
                        moodOptions={moodOptions}
                        selectedMood={selectedMood}
                        onMoodChange={setSelectedMood}
                        categoryOptions={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    {isError && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 mb-6">
                            <p className="text-sm text-muted-foreground">
                                Live services are unavailable right now, so this page is temporarily showing the preserved catalog fallback.
                            </p>
                        </motion.div>
                    )}

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExperiences.map((experience, index) => (
                            <ExperienceGridCard
                                key={experience.id}
                                experience={experience}
                                index={index}
                            />
                        ))}
                    </div>

                    {isLoading && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground text-lg">Loading experiences...</p>
                        </div>
                    )}

                    {filteredExperiences.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No experiences match your filters. Try adjusting them!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
