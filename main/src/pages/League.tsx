import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, MapPin, Calendar, ExternalLink, AlertCircle, Loader } from "lucide-react";
import NavBar from "../components/NavBar";

// Types
interface Team {
    id: number;
    name: string;
    code: string;
    city?: string;
    founded?: number;
    stadium?: string;
}

interface LeagueInfo {
    id: number;
    name: string;
    code: string;
    country: string;
    season: string;
    teams: Team[];
}

interface LeagueConfig {
    name: string;
    code: string;
    season: string;
    officialLink: string;
    dataSource: 'sport.db' | 'openfootball' | 'sportsdataverse';
}

const dataSourceConfig: Record<string, { label: string; apiEndpoint: string; startCommand: string }> = {
    'sport.db': {
        label: 'sport.db',
        apiEndpoint: 'GET /api/leagues/{code}/teams',
        startCommand: 'sportdb serve',
    },
    openfootball: {
        label: 'openfootball',
        apiEndpoint: 'GET /api/football/{code}/teams',
        startCommand: 'openfootball start',
    },
    sportsdataverse: {
        label: 'sportsdataverse',
        apiEndpoint: 'GET /api/sportsdata/{code}/teams',
        startCommand: 'sportsdataverse run',
    },
};

// League configuration
const leagueConfig: Record<string, LeagueConfig> = {
    nfl: {
        name: 'National Football League',
        code: 'NFL',
        season: '2024',
        officialLink: 'https://www.nfl.com',
        dataSource: 'sportsdataverse',
    },
    nba: {
        name: 'National Basketball Association',
        code: 'NBA',
        season: '2023-24',
        officialLink: 'https://www.nba.com',
        dataSource: 'sportsdataverse',
    },
    mlb: {
        name: 'Major League Baseball',
        code: 'MLB',
        season: '2024',
        officialLink: 'https://www.mlb.com',
        dataSource: 'sportsdataverse',
    },
    nhl: {
        name: 'National Hockey League',
        code: 'NHL',
        season: '2023-24',
        officialLink: 'https://www.nhl.com',
        dataSource: 'sportsdataverse',
    },
    epl: {
        name: 'English Premier League',
        code: 'ENG 1',
        season: '2023-24',
        officialLink: 'https://www.premierleague.com',
        dataSource: 'openfootball',
    },
    laliga: {
        name: 'La Liga',
        code: 'ES 1',
        season: '2023-24',
        officialLink: 'https://www.laliga.com',
        dataSource: 'openfootball',
    },
    bundesliga: {
        name: 'Bundesliga',
        code: 'DE 1',
        season: '2023-24',
        officialLink: 'https://www.bundesliga.com',
        dataSource: 'openfootball',
    },
};

// Mock data
const mockLeagueData: Record<string, LeagueInfo> = {
    epl: {
        id: 1,
        name: "English Premier League",
        code: "ENG 1",
        country: "England",
        season: "2023-24",
        teams: [
            { id: 1, name: "Arsenal", code: "ARS", city: "London", founded: 1886, stadium: "Emirates Stadium" },
            { id: 2, name: "Manchester City", code: "MCI", city: "Manchester", founded: 1880, stadium: "Etihad Stadium" },
            { id: 3, name: "Manchester United", code: "MUN", city: "Manchester", founded: 1878, stadium: "Old Trafford" },
            { id: 4, name: "Chelsea", code: "CHE", city: "London", founded: 1905, stadium: "Stamford Bridge" },
            { id: 5, name: "Liverpool", code: "LIV", city: "Liverpool", founded: 1892, stadium: "Anfield" },
            { id: 6, name: "Tottenham Hotspur", code: "TOT", city: "London", founded: 1882, stadium: "Tottenham Hotspur Stadium" },
        ],
    },
    nfl: {
        id: 2,
        name: "National Football League",
        code: "NFL",
        country: "United States",
        season: "2024",
        teams: [
            { id: 7, name: "Kansas City Chiefs", code: "KC", city: "Kansas City", founded: 1960, stadium: "Arrowhead Stadium" },
            { id: 8, name: "Buffalo Bills", code: "BUF", city: "Buffalo", founded: 1960, stadium: "Highmark Stadium" },
            { id: 9, name: "Miami Dolphins", code: "MIA", city: "Miami", founded: 1966, stadium: "Hard Rock Stadium" },
            { id: 10, name: "New England Patriots", code: "NE", city: "Foxborough", founded: 1960, stadium: "Gillette Stadium" },
        ],
    },
    nba: {
        id: 3,
        name: "National Basketball Association",
        code: "NBA",
        country: "United States",
        season: "2023-24",
        teams: [
            { id: 11, name: "Los Angeles Lakers", code: "LAL", city: "Los Angeles", founded: 1947, stadium: "Crypto.com Arena" },
            { id: 12, name: "Boston Celtics", code: "BOS", city: "Boston", founded: 1946, stadium: "TD Garden" },
            { id: 13, name: "Golden State Warriors", code: "GSW", city: "San Francisco", founded: 1946, stadium: "Chase Center" },
        ],
    },
};

// Reusable Components
const ExternalLinkButton: React.FC<{ href: string; label: string }> = ({ href, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-blue-600 font-medium text-sm px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    >
        {label}
        <ExternalLink size={14} />
    </a>
);

const TeamCard: React.FC<{ team: Team }> = ({ team }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="font-bold text-gray-900">{team.name}</h3>
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono mt-1">
                    {team.code}
                </span>
            </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
            {team.city && (
                <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{team.city}</span>
                </div>
            )}
            {team.founded && (
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Founded {team.founded}</span>
                </div>
            )}
            {team.stadium && (
                <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{team.stadium}</span>
                </div>
            )}
        </div>
    </div>
);

const LeagueHeader: React.FC<{ leagueData: LeagueInfo | null; config: LeagueConfig }> = ({ leagueData, config }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{leagueData?.name || config.name}</div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-gray-600 text-sm sm:text-base">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                        {leagueData?.code || config.code}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={14} className="flex-shrink-0" />
                        {leagueData?.season || config.season}
                    </span>
                    <span className="flex items-center gap-1">
                        📍 {leagueData?.country || "TBD"}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{leagueData?.teams.length || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-500">Teams</div>
                </div>
                <ExternalLinkButton href={config.officialLink} label="Official Site" />
            </div>
        </div>
    </div>
);

const SportDbInfo: React.FC<{ config: LeagueConfig }> = ({ config }) => {
    const source = dataSourceConfig[config.dataSource];

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <code className="text-blue-800 text-xs">{source.label}</code>
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900">Data Source</h3>
                    <p className="text-blue-800 text-sm mt-1">
                        In production:{' '}
                        <code className="bg-blue-100 px-1 rounded">{source.apiEndpoint.replace('{code}', config.code)}</code>
                        <br />
                        Start service:{' '}
                        <code className="bg-blue-100 px-1 rounded">{source.startCommand}</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

const League: React.FC = () => {
    const { sport } = useParams<{ sport?: string }>();
    const [leagueData, setLeagueData] = useState<LeagueInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const config = sport && leagueConfig[sport] ? leagueConfig[sport] : null;

    useEffect(() => {
        const fetchLeagueData = async () => {
            if (!sport || !config) {
                setError(`Unknown sport: ${sport || 'undefined'}`);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                const mockData = mockLeagueData[sport];

                // let apiUrl;
                // switch (config.dataSource) {
                //     case 'sport.db':
                //         apiUrl = `/api/leagues/${config.code}/teams`;
                //         break;
                //     case 'openfootball':
                //         apiUrl = `/api/football/${config.code}/teams`;
                //         break;
                //     case 'sportsdataverse':
                //         apiUrl = `/api/sportsdata/${config.code}/teams`;
                //         break;
                // }

                setLeagueData(
                    mockData || {
                        id: 999,
                        name: config.name,
                        code: config.code,
                        country: "TBD",
                        season: config.season,
                        teams: [],
                    }
                );
            } catch (err) {
                setError(`Failed to fetch league data from ${config.dataSource}`);
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeagueData();
    }, [sport, config]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading {config?.name || sport || "league"} data...</p>
                        <p className="text-sm text-gray-500 mt-2">Fetching from {config?.dataSource}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !config) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 text-lg mb-4">{error || `Unknown sport: ${sport || "undefined"}`}</p>
                        {config && <ExternalLinkButton href={config.officialLink} label="Visit Official Site" />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 container mx-auto px-4 py-8">
                <LeagueHeader leagueData={leagueData} config={config} />
                <SportDbInfo config={config} />
                {leagueData?.teams.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leagueData.teams.map((team) => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teams Available</h3>
                        <p className="text-gray-600 mb-4">Team data for {config.name} is not yet available in sport.db</p>
                        <ExternalLinkButton href={config.officialLink} label="View on Official Site" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default League;
