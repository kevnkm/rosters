import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

const leagueLinks: Record<string, string> = {
    nfl: "https://www.nfl.com",
    nba: "https://www.nba.com",
    mlb: "https://www.mlb.com",
    nhl: "https://www.nhl.com",
    epl: "https://www.premierleague.com",
};

const League: React.FC = () => {
    const { sport } = useParams<{ sport: string }>();
    const link = leagueLinks[sport ?? ""];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <NavBar />
            <div className="flex flex-1 justify-center items-center">
                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-lg underline"
                    >
                        {link}
                    </a>
                ) : (
                    <p className="text-red-500 text-lg">Unknown sport: {sport}</p>
                )}
            </div>
        </div>
    );
};

export default League;
