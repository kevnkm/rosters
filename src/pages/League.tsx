import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import SeasonCarousel from "@/components/SeasonCarousel";
import TeamGraph from "@/components/TeamGraph";

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

            {/* Graph container */}
            <div className="relative flex-1">
                <div className="absolute inset-0">
                    <TeamGraph />
                </div>

                {/* Season carousel */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-md">
                    <SeasonCarousel
                        seasons={AVAILABLE_SEASONS}
                        selectedSeason={selectedSeason}
                        onSelect={setSelectedSeason}
                    />
                    <div className="flex items-center gap-3 px-6 py-2 bg-muted border border-border rounded-full w-64">
                        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                            Season
                        </span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex-1 text-center">
                            {selectedSeason}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default League;