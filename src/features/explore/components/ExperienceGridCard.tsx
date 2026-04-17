import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import type { ExploreExperience } from "../data/fallbackExperiences";

interface ExperienceGridCardProps {
  experience: ExploreExperience;
  index: number;
}

const ExperienceGridCard = ({ experience, index }: ExperienceGridCardProps) => {
  return (
    <motion.div
      key={experience.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      <div className="relative h-52 overflow-hidden">
        <LazyImage
          src={experience.image}
          alt={experience.title}
          className="h-full group-hover:scale-110 transition-transform duration-500"
          width={768}
          height={768}
        />
        <button className="absolute top-3 right-3 p-2 rounded-full glass hover:bg-primary/30 transition-all">
          <Heart className="w-4 h-4 text-primary-foreground" />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium text-primary-foreground">
          {experience.duration}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {experience.mood}
          </span>
          <span className="text-xs text-muted-foreground">{experience.category}</span>
        </div>
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {experience.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{experience.desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-mood-adventure fill-mood-adventure" />
            <span className="text-sm font-medium text-foreground">{experience.rating}</span>
          </div>
          <span className="text-lg font-bold text-primary">${experience.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceGridCard;
