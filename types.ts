export type PlayerStats = {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  pointsPerGame: number;
  shootingPercent: number;
  shots: number;
  timeOnIcePerGame: number;
  gameWinningGoals: number;
  shortHandedGoals: number;
};

export type Player = {
  playerId: number;
  name: string;
  position: string;
  playerStats: PlayerStats;
};
