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
  goalModifier: {
    value: string | number;
    enabled: boolean;
  };
  assistModifier: {
    value: string | number;
    enabled: boolean;
  };
  GWGModifier: {
    value: string | number;
    enabled: boolean;
  };
  SHGModifier: {
    value: string | number;
    enabled: boolean;
  };
};

export type PlayersTableProps = {
  players: Player[];
  totalPlayers: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  hiddenPlayers: number[];
  setHiddenPlayers: (hiddenPlayers: number[]) => void;
};

export type PlayerStatsModalProps = {
  modalVisible: boolean;
  selectedPlayer: Player[] | null;
  onClose: () => void;
};

export type ModifiersContextType = {
  modifiers: Modifiers;
  setModifiers: React.Dispatch<React.SetStateAction<Modifiers>>;
  modifiersActive: boolean;
  setModifiersActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TeamContextType = {
  team: number[]; // Array of player IDs
  addPlayerToTeam: (playerId: number) => Promise<void>;
  removePlayerFromTeam: (playerId: number) => Promise<void>;
  fetchTeam: () => Promise<number[]>;
}