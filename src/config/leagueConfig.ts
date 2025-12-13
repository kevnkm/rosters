import type { LeagueConfig } from "../types/league.types";

export const leagueConfig: Record<string, LeagueConfig> = {
  nfl: {
    name: "National Football League",
    code: "NFL",
    defaultSeason: "2024",
    seasons: [],
    officialLink: "https://www.nfl.com",
  },
  nba: {
    name: "National Basketball Association",
    code: "NBA",
    defaultSeason: "2023-24",
    seasons: [],
    officialLink: "https://www.nba.com",
  },
  mlb: {
    name: "Major League Baseball",
    code: "MLB",
    defaultSeason: "2024",
    seasons: [],
    officialLink: "https://www.mlb.com",
  },
  nhl: {
    name: "National Hockey League",
    code: "NHL",
    defaultSeason: "2023-24",
    seasons: [],
    officialLink: "https://www.nhl.com",
  },
  epl: {
    name: "English Premier League",
    code: "ENG 1",
    defaultSeason: "2023-24",
    seasons: [],
    officialLink: "https://www.premierleague.com",
  },
  laliga: {
    name: "La Liga",
    code: "ES 1",
    defaultSeason: "2023-24",
    seasons: [],
    officialLink: "https://www.laliga.com",
  },
  bundesliga: {
    name: "Bundesliga",
    code: "DE 1",
    defaultSeason: "2023-24",
    seasons: [],
    officialLink: "https://www.bundesliga.com",
  },
};
