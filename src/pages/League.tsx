import React, { useState } from "react";
import { Calendar } from "lucide-react";
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

            <div className="container mx-auto px-4 py-12 max-w-7xl flex-1">
                {/* Season Selector */}
                <div className="mb-12">
                    <SeasonCarousel
                        seasons={AVAILABLE_SEASONS}
                        selectedSeason={selectedSeason}
                        onSelect={setSelectedSeason}
                    />
                </div>

                {/* Season Display */}
                <div className="bg-card rounded-3xl shadow-xl p-12 text-center">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-foreground">
                            League Overview
                        </h1>
                    </div>

                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted border border-border rounded-full">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Season
                        </span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            {selectedSeason}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default League;