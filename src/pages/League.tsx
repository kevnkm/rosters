import NavBar from "@/components/NavBar";
import TeamGraph from "@/components/TeamGraph";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const DATA_URL = "https://cdn.jsdelivr.net/gh/kevnkm/rosters-data@main/nba/2025-26.json";

const League: React.FC = () => {
    const [teamOptions, setTeamOptions] = useState<Option[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Option[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    // Helper to pick N random items from an array
    const getRandomTeams = (options: Option[], count: number): Option[] => {
        const shuffled = [...options].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Fetch team list from the data URL once on mount
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(DATA_URL);
                if (!response.ok) throw new Error("Failed to fetch roster data");
                const data = await response.json();

                const options: Option[] = Object.values(data.teams).map((teamData: any) => ({
                    value: teamData.team_info.abbreviation,
                    label: teamData.team_info.displayName,
                }));

                // Sort alphabetically by label
                options.sort((a, b) => a.label.localeCompare(b.label));

                setTeamOptions(options);

                // Randomly select 7 teams (or all if fewer than 7)
                const randomCount = Math.min(7, options.length);
                const randomSelected = getRandomTeams(options, randomCount);
                setSelectedTeams(randomSelected);
            } catch (err) {
                console.error(err);
                setTeamOptions([]);
                setSelectedTeams([]);
            } finally {
                setLoadingTeams(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            {/* Graph container */}
            <div className="relative flex-1">
                <div className="absolute inset-0 touch-none">
                    <TeamGraph selectedTeamAbbrs={selectedTeams.map((t) => t.value)} />
                </div>

                {/* Team Selector Panel */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-10">
                    <div className="flex items-start justify-end">
                        {/* Panel */}
                        {!isMinimized && (
                            <div className="w-full sm:w-96 sm:mr-3">
                                <div className="bg-background/90 backdrop-blur-md rounded-lg shadow-xl border border-border py-4 sm:py-5 px-4 sm:px-6">
                                    <h3 className="text-sm font-medium mb-3 sm:mb-4">Team Selector</h3>

                                    {loadingTeams ? (
                                        <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
                                            Loading teams...
                                        </div>
                                    ) : (
                                        <>
                                            <MultipleSelector
                                                options={teamOptions}
                                                value={selectedTeams}
                                                onChange={setSelectedTeams}
                                                placeholder="Search teams..."
                                                emptyIndicator={
                                                    <p className="text-center text-sm text-muted-foreground py-4 sm:py-6">
                                                        No teams found.
                                                    </p>
                                                }
                                                hidePlaceholderWhenSelected={true}
                                                className="w-full"
                                            />

                                            <div className="text-xs sm:text-sm text-muted-foreground text-center mt-3 sm:mt-4">
                                                {selectedTeams.length === 0
                                                    ? "Select teams to display"
                                                    : `${selectedTeams.length} team${selectedTeams.length > 1 ? "s" : ""} selected`}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Toggle Button */}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-lg shadow-xl border border-border hover:bg-accent/70 transition-colors flex-shrink-0"
                            aria-label={isMinimized ? "Expand team selector" : "Minimize team selector"}
                        >
                            {isMinimized ? (
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default League;