import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import SeasonCarousel from "@/components/SeasonCarousel";

const AVAILABLE_SEASONS = [
    "2018-19",
    "2019-20",
    "2020-21",
    "2021-22",
    "2022-23",
    "2023-24",
    "2024-25",
    "2025-26",
];

const League: React.FC = () => {
    const [selectedSeason, setSelectedSeason] = useState(
        AVAILABLE_SEASONS[AVAILABLE_SEASONS.length - 1]
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />
            <div className="py-4">
                <SeasonCarousel
                    seasons={AVAILABLE_SEASONS}
                    selectedSeason={selectedSeason}
                    onSelect={setSelectedSeason}
                />
            </div>

            <div className="container mx-auto px-4 py-5 max-w-7xl flex-1 flex flex-col items-center justify-center">
                {/* Season Display */}
                <div className="flex items-center gap-3 px-6 py-3 bg-muted border border-border rounded-full w-64">
                    <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                        Season
                    </span>
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex-1 text-center">
                        {selectedSeason}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default League;