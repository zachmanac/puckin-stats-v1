import { supabase } from '@/config/supabaseClient';

export const fetchPlayersWithStats = async (limit: number = 30) => {
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
    players (name, position)
  `)
  .eq('season_id', 20222023)
  .limit(limit);
  
  if (error) {
    console.error('Error fetching player stats:', error);
    return [];
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

  return transformedData;
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
    .eq('player_id', playerIds)
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

// export const fetchTeamWithStats = async () => {
//   const { data, error } = await supabase
//   .from('player_stats')
//   .select(`
//     player_id,
//     games_played,
//     goals,
//     assists,
//     points,
//     points_per_game,
//     shooting_percent,
//     shots,
//     time_on_ice_per_game,
//     game_winning_goals,
//     sh_goals,
//     players (name, position)
//     user_team (player_id)
//   `)
//   .eq('season_id', 20222023);
  
//   console.log("data: ", data)
//   console.log("error: ", error)
//   if (error) {
//     console.error('Error fetching player stats:', error);
//     return [];
//   }

//   // restructure the data so stats are nested under the player 
//   const transformedData = data.map((item: any) => ({
//     playerId: item.player_id,
//     name: item.players.name,
//     position: item.players.position,
//     playerStats: { 
//       gamesPlayed: item.games_played,
//       goals: item.goals,
//       assists: item.assists,
//       points: item.points,
//       pointsPerGame: item.points_per_game,
//       shootingPercent: item.shooting_percent,
//       shots: item.shots,
//       timeOnIcePerGame: item.time_on_ice_per_game,
//       gameWinningGoals: item.game_winning_goals,
//       shortHandedGoals: item.sh_goals,
//     },
//   }));
  
//     return transformedData;
// }