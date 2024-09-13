import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Player } from '@/types';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { fetchPlayerIdsFromTeam, fetchTeamWithStats } from '@/supabaseCalls/getRequests';

const UserTeamTab = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  const { team } = useTeamContext();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const playerIds = await fetchPlayerIdsFromTeam();
        const data = await fetchTeamWithStats(playerIds);
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch data: ', error);
      }
    };

    fetchTeam();
  }, [team]);


  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.tableContainer}>
        {/* Columns */}
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.cellName]}>Name</Text>
            <Text style={[styles.cell, styles.cellStats]}>projected</Text>
            <Text style={[styles.cell, styles.cellStats]}>Pos</Text>
            <Text style={[styles.cell, styles.cellStats]}>GP</Text>
            <Text style={[styles.cell, styles.cellStats]}>G</Text>
            <Text style={[styles.cell, styles.cellStats]}>A</Text>
            <Text style={[styles.cell, styles.cellStats]}>Pts</Text>
            <Text style={[styles.cell, styles.cellStats]}>Pts/PG</Text>
            <Text style={[styles.cell, styles.cellLongNumbers]}>Shots</Text>
            <Text style={[styles.cell, styles.cellLongNumbers]}>Shot %</Text>
            <Text style={[styles.cell, styles.cellLongNumbers]}>TOI</Text>
            <Text style={[styles.cell, styles.cellStats]}>SHG</Text>
            <Text style={[styles.cell, styles.cellStats]}>GWG</Text>
          </View>

          {/* Rows */}
          {players.map((player: Player, index: number) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.cellName]}>{player.name}</Text>
              <Text style={[styles.cell, styles.cellStats]}>projected</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.position}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.gamesPlayed}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.goals}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.assists}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.points}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.pointsPerGame.toFixed(2)}</Text>
              <Text style={[styles.cell, styles.cellLongNumbers]}>{player.playerStats.shots}</Text>
              <Text style={[styles.cell, styles.cellLongNumbers]}>{(player.playerStats.shootingPercent * 100).toFixed(2)}</Text>
              <Text style={[styles.cell, styles.cellLongNumbers]}>
                {/* minutes */}
                {Math.floor(player.playerStats.timeOnIcePerGame / 60)}:
                {/* seconds */}
                {String(Math.round((player.playerStats.timeOnIcePerGame / 60 % 1) * 60)).padStart(2, '0')}
              </Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.shortHandedGoals}</Text>
              <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.gameWinningGoals}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingHorizontal: 8,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
  },
  header: {
    fontWeight: 'bold',
    height: 50,
    backgroundColor: '#f0f0f0',
  },
  cellId: {
    width: 20,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  cellName: {
    width: 120,
  },
  cellStats: {
    width: 30,
    textAlign: 'center',
  },
  cellLongNumbers: {
    width: 35,
    textAlign: 'center',
  },
});

export default UserTeamTab;