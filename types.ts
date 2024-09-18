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

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export type Modifiers = {
  goalModifier: string | number;
  assistModifier: string | number;
  GWGModifier: string | number;
  SHGModifier: string | number;
};