import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { Player } from '@/types';
import Checkbox from './Checkbox';

export default function PlayersTable({ players }: { players: Player[] }) {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [hiddenPlayers, setHiddenPlayers] = useState<number[]>([]);

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

  const filteredPlayers = players.filter((player) => !hiddenPlayers.includes(player.playerId));

  return (
    <View>
      {selectedPlayers.length > 0 && (
        <View style={styles.dropdownMenu}>
          <Pressable onPress={removeSelectedPlayers} style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Remove Selected</Text>
          </Pressable>
        </View>
      )}
      {selectedPlayers.length === 0 && hiddenPlayers.length > 0 && (
        <View style={styles.dropdownMenu}>
          <Pressable style={styles.menuButton} onPress={unhideAllPlayers}>
            <Text style={styles.menuButtonText}>Unhide All Players</Text>
          </Pressable>
        </View>
      )}

      <ScrollView horizontal style={styles.tableContainer}>
        {/* Columns */}
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.cellId]}>{/* checkbox header*/}</Text>
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
          {filteredPlayers.map((player: Player, index: number) => (
            <View key={index} style={[styles.row, selectedPlayers.includes(player.playerId) && styles.selectedRow]}>
              <Checkbox
                checked={selectedPlayers.includes(player.playerId)}
                onChange={() => handleCheckboxChange(player.playerId)}
              />
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
  selectedRow: {
    backgroundColor: 'gray',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007bff',
    zIndex: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignContent: 'center'
  },
  menuButton: {
    backgroundColor: 'gray',
    padding: 10,
    width: 150,
    alignSelf: 'center',
  },
  menuButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  
});