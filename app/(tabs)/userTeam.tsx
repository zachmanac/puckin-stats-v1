import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Player } from '@/types';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { fetchPlayerIdsFromTeam, fetchTeamWithStats } from '@/supabaseCalls/getRequests';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
    <ThemedView style={styles.container}>
      <ScrollView horizontal style={styles.tableContainer}>
        {/* Columns */}
        <ThemedView style={styles.table}>
          <ThemedView style={[styles.row, styles.header]}>
            <ThemedText style={[styles.cell, styles.cellName, styles.headerText]}>Name</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>projected</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Pos</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>GP</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>G</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>A</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Pts</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Pts/PG</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>Shots</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>Shot %</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>TOI</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>SHG</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>GWG</ThemedText>
          </ThemedView>

          {/* Rows */}
          {players.map((player: Player, index: number) => (
            <ThemedView key={index} style={styles.row}>
              <ThemedText style={[styles.cell, styles.cellName]}>{player.name}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>projected</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.position}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.gamesPlayed}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.goals}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.assists}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.points}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.pointsPerGame.toFixed(2)}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{player.playerStats.shots}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{(player.playerStats.shootingPercent * 100).toFixed(2)}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellLongNumbers]}>
                {/* minutes */}
                {Math.floor(player.playerStats.timeOnIcePerGame / 60)}:
                {/* seconds */}
                {String(Math.round((player.playerStats.timeOnIcePerGame / 60 % 1) * 60)).padStart(2, '0')}
              </ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.shortHandedGoals}</ThemedText>
              <ThemedText style={[styles.cell, styles.cellStats]}>{player.playerStats.gameWinningGoals}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
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
  },
  headerText: {
    lineHeight: 15,
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