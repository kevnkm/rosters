import React, { useEffect, useRef, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

interface SeasonCarouselProps {
    seasons: string[];
    selectedSeason: string;
    onSelect: (season: string) => void;
}

const SeasonCarousel: React.FC<SeasonCarouselProps> = ({
    seasons,
    selectedSeason,
    onSelect,
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!api) return;

        const handleSelect = () => {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Get the currently centered slide
            const selectedIndex = api.selectedScrollSnap();
            const season = seasons[selectedIndex];

            // Set a 1-second timeout to auto-select the season
            timeoutRef.current = setTimeout(() => {
                if (season !== selectedSeason) {
                    onSelect(season);
                }
            }, 1000);
        };

        // Listen to carousel scroll events
        api.on("select", handleSelect);

        return () => {
            api.off("select", handleSelect);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [api, seasons, selectedSeason, onSelect]);

    return (
        <div className="relative w-full max-w-xs mx-auto">
            {/* Left gradient */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />

            {/* Right gradient */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

            <Carousel
                opts={{ align: "center" }}
                className="relative"
                setApi={setApi}
            >
                <CarouselContent>
                    {seasons.map((season) => {
                        const isActive = season === selectedSeason;

                        return (
                            <CarouselItem key={season} className="flex justify-center">
                                <button
                                    onClick={() => onSelect(season)}
                                    className={`
                                        w-52 h-24 rounded-2xl p-6 flex items-center justify-center transition-all select-none
                                        ${isActive
                                            ? "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"
                                            : "bg-card"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            text-2xl font-bold
                                            ${isActive ? "text-white" : "text-card-foreground"}
                                        `}
                                    >
                                        {season}
                                    </div>
                                </button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                <CarouselPrevious
                    className="
                        -left-12
                        h-10 w-10
                        bg-card
                        border-border
                        text-card-foreground
                        hover:bg-accent
                        hover:text-accent-foreground
                        transition-all
                    "
                />
                <CarouselNext
                    className="
                        -right-12
                        h-10 w-10
                        bg-card
                        border-border
                        text-card-foreground
                        hover:bg-accent
                        hover:text-accent-foreground
                        transition-all
                    "
                />
            </Carousel>
        </div>
    );
};

export default SeasonCarousel;
