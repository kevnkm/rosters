// types/league.types.ts

export interface Team {
  id: number;
  name: string;
  code: string;
  city?: string;
  founded?: number;
  stadium?: string;
  logo?: string;
}

export interface LeagueInfo {
  id: number;
  name: string;
  code: string;
  country: string;
  season: string;
  teams: Team[];
  // updatedAt?: string;
}

export interface LeagueConfig {
  name: string;
  code: string;
  defaultSeason: string;
  seasons: string[];
  officialLink: string;
  logo?: string;
  primaryColor?: string;
}

export interface DataSourceConfig {
  label: string;
  apiEndpoint?: string;
  startCommand?: string;
}
