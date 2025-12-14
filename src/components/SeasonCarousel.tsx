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
    const currentIndex = seasons.indexOf(selectedSeason);
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
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent" />

            {/* Right gradient */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent" />

            <Carousel
                opts={{ align: "center" }}
                className="relative"
                setApi={setApi}
            >
                <CarouselContent>
                    {seasons.map((season, index) => {
                        const isActive = season === selectedSeason;
                        const isPast = index < currentIndex;

                        return (
                            <CarouselItem key={season} className="flex justify-center">
                                <button
                                    onClick={() => onSelect(season)}
                                    className={`
                                        w-52 h-36 rounded-2xl p-6 flex flex-col justify-between transition-all
                                        ${isActive
                                            ? "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"
                                            : "bg-gradient-to-br from-white to-gray-50"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            text-2xl font-bold
                                            ${isActive ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {season}
                                    </div>
                                    {isActive ? (
                                        <span className="text-xs font-bold text-white bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                                            • Active
                                        </span>
                                    ) : isPast ? (
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                                            Upcoming
                                        </span>
                                    )}
                                </button>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                <CarouselPrevious
                    className="
                        -left-12
                        h-10 w-10
                        border border-white/40
                        text-white
                        transition-all
                    "
                />
                <CarouselNext
                    className="
                        -right-12
                        h-10 w-10
                        border border-white/40
                        text-white
                        transition-all
                    "
                />
            </Carousel>
        </div>
    );
};

export default SeasonCarousel;
