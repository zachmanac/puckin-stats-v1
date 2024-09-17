import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Player } from '@/types';
import Checkbox from './Checkbox';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type PlayersTableProps = {
  players: Player[];
  totalPlayers: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  hiddenPlayers: number[];
  setHiddenPlayers: (hiddenPlayers: number[]) => void;
};

export default function PlayersTable({
  players,
  totalPlayers,
  currentPage,
  pageSize,
  onPageChange,
  hiddenPlayers,
  setHiddenPlayers,
}: PlayersTableProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const totalPages = Math.ceil(totalPlayers / pageSize);

  const { addPlayerToTeam } = useTeamContext();

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

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => !hiddenPlayers.includes(player.playerId));
  }, [players, hiddenPlayers]);

  const renderItem = useCallback(({ item }: { item: Player }) => (
    <ThemedView
      style={[
        styles.row,
        selectedPlayers.includes(item.playerId) && styles.selectedRow
        ]}
    >
      <Checkbox
        checked={selectedPlayers.includes(item.playerId)}
        onChange={() => handleCheckboxChange(item.playerId)}
      />
      <ThemedText style={[styles.cell, styles.cellName]}>{item.name}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>projected</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.position}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.gamesPlayed}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.goals}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.assists}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.points}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.pointsPerGame.toFixed(2)}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{item.playerStats.shots}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{(item.playerStats.shootingPercent * 100).toFixed(2)}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>
        {/* Minutes */}
        {Math.floor(item.playerStats.timeOnIcePerGame / 60)}:
        {/* Seconds */}
        {String(Math.round((item.playerStats.timeOnIcePerGame / 60 % 1) * 60)).padStart(2, '0')}
      </ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.shortHandedGoals}</ThemedText>
      <ThemedText style={[styles.cell, styles.cellStats]}>{item.playerStats.gameWinningGoals}</ThemedText>
    </ThemedView>
  ), [selectedPlayers, handleCheckboxChange, hiddenPlayers]);

  return (
    <View>
      {selectedPlayers.length > 0 && (
        <ThemedView style={styles.dropdownMenu}>
          <Pressable style={styles.menuButton} onPress={removeSelectedPlayers}>
            <ThemedText style={styles.menuButtonText}>Remove Selected</ThemedText>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={addSelectedPlayersToTeam}>
            <ThemedText style={styles.menuButtonText}>Add to Team</ThemedText>
          </Pressable>
        </ThemedView>
      )}
      {selectedPlayers.length === 0 && hiddenPlayers.length > 0 && (
        <ThemedView style={styles.dropdownMenu}>
          <Pressable style={styles.menuButton} onPress={unhideAllPlayers}>
            <ThemedText style={styles.menuButtonText}>Unhide All Players</ThemedText>
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
          <FlatList
            data={filteredPlayers}
            renderItem={renderItem}
            keyExtractor={item => item.playerId.toString()}
            ListEmptyComponent={<ThemedText>No players available.</ThemedText>}
            initialNumToRender={15}
          />
        </ThemedView>
      </ScrollView>

      {/* Pagination */}
      <ThemedView style={styles.pagination}>
        <Pressable style={styles.paginationButton} onPress={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          <ThemedText>Previous</ThemedText>
        </Pressable>
        <ThemedText>{currentPage} / {totalPages}</ThemedText>
        <Pressable style={styles.paginationButton} onPress={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          <ThemedText>Next</ThemedText>
        </Pressable>
      </ThemedView>
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  paginationButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});