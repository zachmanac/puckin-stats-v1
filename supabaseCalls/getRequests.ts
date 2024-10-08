import { supabase } from '@/config/supabaseClient';

export const fetchPlayersWithStats = async (start: number = 0, end: number) => {

  if (start < 0 || end < start) {
    console.error('Invalid range:', { start, end });
    return { players: [], count: 0 };
  }

  const { data, error, count } = await supabase
  .from('player_stats')
  .select(`
    player_id,
    games_played,
    goals,
    assists,
    points,
    points_per_game,
    shooting_percent,
    shots,
    time_on_ice_per_game,
    game_winning_goals,
    sh_goals,
    players (name, position)
  `, { count: 'exact' })
  .eq('season_id', 20232024)
  .order('points', { ascending: false })
  .range(start, end);
  
  if (error) {
    console.error('Error fetching player stats:', error);
    return { players: [], count: 0 };
  }

  // restructure the data so stats are nested under the player 
  const transformedData = data.map((item: any) => ({
    playerId: item.player_id,
    name: item.players.name,
    position: item.players.position,
    playerStats: { 
      gamesPlayed: item.games_played,
      goals: item.goals,
      assists: item.assists,
      points: item.points,
      pointsPerGame: item.points_per_game,
      shootingPercent: item.shooting_percent,
      shots: item.shots,
      timeOnIcePerGame: item.time_on_ice_per_game,
      gameWinningGoals: item.game_winning_goals,
      shortHandedGoals: item.sh_goals,
    },
  }));

  return { players: transformedData || [], count: count || 0 };
};

export const fetchPlayerIdsFromTeam = async () => {
  const { data, error } = await supabase
    .from('user_teams')
    .select('player_id');

  if (error) {
    console.error('Error fetching player IDs:', error);
    return [];
  }

  return data.map((item) => item.player_id);
}

export const fetchTeamWithStats = async (playerIds: number[]) => {
  if (playerIds.length === 0) return [];

  const { data, error } = await supabase
    .from('player_stats')
    .select(`
      player_id,
      games_played,
      goals,
      assists,
      points,
      points_per_game,
      shooting_percent,
      shots,
      time_on_ice_per_game,
      game_winning_goals,
      sh_goals,
      players (
        name,
        position
      )
    `)
    .in('player_id', playerIds)
    .eq('season_id', 20222023);

  if (error) {
    console.error('Error fetching player stats and details:', error);
    return [];
  }

  const transformedData = data.map((item: any) => ({
    playerId: item.player_id,
    name: item.players.name,
    position: item.players.position,
    playerStats: { 
      gamesPlayed: item.games_played,
      goals: item.goals,
      assists: item.assists,
      points: item.points,
      pointsPerGame: item.points_per_game,
      shootingPercent: item.shooting_percent,
      shots: item.shots,
      timeOnIcePerGame: item.time_on_ice_per_game,
      gameWinningGoals: item.game_winning_goals,
      shortHandedGoals: item.sh_goals,
    },
  }));
  
  return transformedData;
}

export const fetchTeam = async () => {
  const { data, error } = await supabase
    .from('user_teams')
    .select('player_id');

    if (error) {
      console.error('Error fetching team:', error);
      return [];
    }
  
    return data ? data.map((row) => row.player_id) : [];
};

export const fetchIndividualPlayersStatsAllSeasons = async (playerId: number) => {

  const { data, error } = await supabase
  .from('player_stats')
  .select(`
    player_id,
    season_id,
    games_played,
    goals,
    assists,
    points,
    points_per_game,
    shooting_percent,
    shots,
    time_on_ice_per_game,
    game_winning_goals,
    sh_goals,
    players (name, position)
  `)
  .eq('player_id', playerId)
  .order('season_id')
  
  if (error) {
    console.error('Error fetching player stats:', error);
    return [];
  }

  // restructure the data so stats are nested under the player 
  const transformedData = data.map((item: any) => ({
    seasonId: item.season_id,
    playerId: item.player_id,
    name: item.players.name,
    position: item.players.position,
    playerStats: { 
      gamesPlayed: item.games_played,
      goals: item.goals,
      assists: item.assists,
      points: item.points,
      pointsPerGame: item.points_per_game,
      shootingPercent: item.shooting_percent,
      shots: item.shots,
      timeOnIcePerGame: item.time_on_ice_per_game,
      gameWinningGoals: item.game_winning_goals,
      shortHandedGoals: item.sh_goals,
    },
  }));

  return transformedData || [];
};