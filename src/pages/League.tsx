import NavBar from "@/components/NavBar";
import TeamGraph from "@/components/TeamGraph";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";
import { useState, useEffect } from "react";

const DATA_URL = "https://cdn.jsdelivr.net/gh/kevnkm/rosters-data@main/nba/2025-26.json";

const League: React.FC = () => {
    const [teamOptions, setTeamOptions] = useState<Option[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<Option[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(true);

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

                {/* Controls: Team Selector */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4 bg-background/90 backdrop-blur-md px-8 py-5 rounded-xl shadow-xl border border-border">
                    <div className="w-96">
                        {loadingTeams ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading teams...
                            </div>
                        ) : (
                            <MultipleSelector
                                options={teamOptions}
                                value={selectedTeams}
                                onChange={setSelectedTeams}
                                placeholder="Search teams..."
                                emptyIndicator={<p className="text-center text-sm text-muted-foreground py-6">No teams found.</p>}
                                hidePlaceholderWhenSelected={true}
                                className="w-full"
                            />
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {selectedTeams.length === 0
                            ? "Select teams to display"
                            : `${selectedTeams.length} team${selectedTeams.length > 1 ? "s" : ""} selected`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default League;