import React, { useState, useMemo, useCallback, useRef } from 'react';
import { ScrollView, View, Pressable, FlatList, StyleSheet, Animated } from 'react-native';
import { Player } from '@/types';
import Checkbox from './Checkbox';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useModifiersContext } from '@/contextProvider/modifiersContextProvider';
import { PlayersTableProps } from '@/types';

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
  const [modifiersActive, setModifiersActive] = useState<boolean>(false);

  const { modifiers } = useModifiersContext();

  const totalPages = Math.ceil(totalPlayers / pageSize);

  const { addPlayerToTeam } = useTeamContext();

  const handleCheckboxChange = (playerId: number) => {
    setSelectedPlayers((prevSelected) =>
      prevSelected.includes(playerId)
        ? prevSelected.filter(id => id !== playerId)
        : [...prevSelected, playerId]
    );
  };

  const handleLongPress = (playerId: number) => {
    handleCheckboxChange(playerId);
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

  // Renders individual player row
  const renderPlayer = useCallback(({ item }: { item: Player }) => {
    const { goalModifier, assistModifier, SHGModifier, GWGModifier } = modifiers;

    const gamesPlayed = item.playerStats.gamesPlayed;

    const structuredGoals = Math.round(item.playerStats.goals * (modifiersActive && goalModifier.enabled ? parseFloat(goalModifier.value.toString()) : 1));
    const structuredAssists = Math.round(item.playerStats.assists * (modifiersActive && assistModifier.enabled ? parseFloat(assistModifier.value.toString()) : 1));
    const structuredPoints = structuredGoals + structuredAssists;
    const structuredPointsPerGame = item.playerStats.pointsPerGame.toFixed(2);
    const structuredShootingPercent = (item.playerStats.shootingPercent * 100).toFixed(2);
    const structuredMinutes = Math.floor(item.playerStats.timeOnIcePerGame / 60);
    const structuredSeconds = String(Math.round((item.playerStats.timeOnIcePerGame / 60 % 1) * 60)).padStart(2, '0');
    const structuredSHG = Math.round(item.playerStats.shortHandedGoals * (modifiersActive && SHGModifier.enabled ? parseFloat(SHGModifier.value.toString()) : 1));
    const structuredGWG = Math.round(item.playerStats.gameWinningGoals * (modifiersActive && GWGModifier.enabled ? parseFloat(GWGModifier.value.toString()) : 1));

    // Projected column calculation, based off of 82 games played
    const gamesProrated = gamesPlayed > 0 ? (82 / gamesPlayed) : 1;
    const projectedGoals = modifiersActive && goalModifier.enabled ? structuredGoals * gamesProrated : 0;
    const projectedAssists = modifiersActive && assistModifier.enabled ? structuredAssists * gamesProrated : 0;
    const projectedSHG = modifiersActive && SHGModifier.enabled ? structuredSHG * gamesProrated : 0;
    const projectedGWG = modifiersActive && GWGModifier.enabled ? structuredGWG * gamesProrated : 0;
    const projectedStats =  Math.round(projectedGoals + projectedAssists + projectedSHG + projectedGWG)

    return (
      <Pressable
        onLongPress={() => handleLongPress(item.playerId)}
        style={({ pressed }) => [
          pressed && styles.rowPressed
        ]}
      >
        <ThemedView style={[styles.row, selectedPlayers.includes(item.playerId) && styles.selectedRow]}>
          <Checkbox
            checked={selectedPlayers.includes(item.playerId)}
            onChange={() => handleCheckboxChange(item.playerId)}
          />
          <ThemedText style={[styles.cell, styles.cellName]}>{item.name}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{projectedStats}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{item.position}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{gamesPlayed}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredGoals}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredAssists}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredPoints}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredPointsPerGame}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{item.playerStats.shots}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{structuredShootingPercent}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{structuredMinutes}:{structuredSeconds}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredSHG}</ThemedText>
          <ThemedText style={[styles.cell, styles.cellStats]}>{structuredGWG}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  }, [selectedPlayers, handleCheckboxChange, hiddenPlayers, modifiers]);

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
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Proj. Stats</ThemedText>
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
            renderItem={renderPlayer}
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
        <ThemedText style={styles.paginationButton}>{currentPage} / {totalPages}</ThemedText>
        <Pressable style={styles.paginationButton} onPress={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          <ThemedText>Next</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifiers}>
        <Pressable
          onPress={() => setModifiersActive((prev) => !prev)}
          style={[styles.toggleButton, modifiersActive ? styles.active : styles.inactive]}
        >
          <ThemedText>{modifiersActive ? 'Toggle Modifiers Off' : 'Toggle Modifiers On'}</ThemedText>
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
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  paginationButton: {
    padding: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifiers: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    width: '50%',
  },
  active: {
    backgroundColor: 'gray',
  },
  inactive: {
    backgroundColor: '#007AFF',
  },
  rowPressed: {
    opacity: 0.5,
  },
});