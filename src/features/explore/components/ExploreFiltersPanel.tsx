import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

interface ExploreFiltersPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  moodOptions: string[];
  selectedMood: string;
  onMoodChange: (value: string) => void;
  categoryOptions: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const ExploreFiltersPanel = ({
  search,
  onSearchChange,
  moodOptions,
  selectedMood,
  onMoodChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
}: ExploreFiltersPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search experiences..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Filters</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Mood
        </p>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood}
              onClick={() => onMoodChange(mood)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedMood === mood
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreFiltersPanel;
