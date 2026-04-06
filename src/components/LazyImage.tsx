import { useState } from "react";
import { motion } from "framer-motion";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

const LazyImage = ({ src, alt, className = "", width, height }: LazyImageProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!loaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded-inherit" />
            )}
            <motion.img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default LazyImage;
