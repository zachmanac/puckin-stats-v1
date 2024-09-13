import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { Player } from '@/types';
import Checkbox from './Checkbox';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function PlayersTable({ players }: { players: Player[] }) {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [hiddenPlayers, setHiddenPlayers] = useState<number[]>([]);

  const { addPlayerToTeam, team } = useTeamContext();

  const handleCheckboxChange = (playerId: number) => {
    setSelectedPlayers((prevSelected) =>
      prevSelected.includes(playerId)
        ? prevSelected.filter(id => id !== playerId)
        : [...prevSelected, playerId]
    );
  };

  const removeSelectedPlayers = () => {
    setHiddenPlayers([...hiddenPlayers, ...selectedPlayers]);
    setSelectedPlayers([]);
  };

  const unhideAllPlayers = () => {
    setHiddenPlayers([]);
  };

  const addSelectedPlayersToTeam = async () => {
    for (const playerId of selectedPlayers) {
      await addPlayerToTeam(playerId); // Send the player to the team context
    }
    setHiddenPlayers([...hiddenPlayers, ...selectedPlayers]);
    setSelectedPlayers([]);
  };

  const filteredPlayers = players.filter((player) => !hiddenPlayers.includes(player.playerId));

  return (
    <View>
      {selectedPlayers.length > 0 && (
        <ThemedView style={styles.dropdownMenu}>
          <Pressable onPress={removeSelectedPlayers} style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Remove Selected</ThemedText>
          </Pressable>
          <Pressable onPress={addSelectedPlayersToTeam} style={styles.menuButton}>
            <ThemedText style={styles.menuButtonText}>Add to Team</ThemedText>
          </Pressable>
        </ThemedView>
      )}
      {selectedPlayers.length === 0 && hiddenPlayers.length > 0 && (
        <ThemedView style={styles.dropdownMenu}>
          <Pressable style={styles.menuButton} onPress={unhideAllPlayers}>
            <Text style={styles.menuButtonText}>Unhide All Players</Text>
          </Pressable>
        </ThemedView>
      )}

      <ScrollView horizontal style={styles.tableContainer}>
        {/* Columns */}
        <ThemedView style={styles.table}>
          <ThemedView style={[styles.row, styles.header]}>
            <ThemedText style={[styles.cell, styles.cellId, styles.headerText]}>{/* checkbox header*/}</ThemedText>
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
          {filteredPlayers.map((player: Player, index: number) => (
            <ThemedView key={index} style={[styles.row, selectedPlayers.includes(player.playerId) && styles.selectedRow]}>
              <Checkbox
                checked={selectedPlayers.includes(player.playerId)}
                onChange={() => handleCheckboxChange(player.playerId)}
              />
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  selectedRow: {
    backgroundColor: 'gray',
  },
  dropdownMenu: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignContent: 'center',
    justifyContent: 'space-evenly',
    height: 50,
  },
  menuButton: {
    backgroundColor: 'gray',
    width: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    height: '70%',
    borderRadius: 10,
  },
  menuButtonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 5,
  },
  
});