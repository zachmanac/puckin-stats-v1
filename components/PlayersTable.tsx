import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Player, PlayerStats, Modifiers } from '@/types';
import Checkbox from './Checkbox';
import { useTeamContext } from '@/contextProvider/userTeamContextProvider';
import { useModifiersContext } from '@/contextProvider/modifiersContextProvider';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { PlayersTableProps } from '@/types';
import { fetchIndividualPlayersStatsAllSeasons } from '@/supabaseCalls/getRequests';
import PlayerStatsModal from './PlayerStatsModal';
import PositionDropdown from './PositionDropdown';

export default function PlayersTable({
  players,
  totalPlayers,
  currentPage,
  pageSize,
  onPageChange,
  hiddenPlayers,
  setHiddenPlayers,
}: PlayersTableProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player[] | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [positionFilter, setPositionFilter] = useState<'All Players' | 'Forwards' | 'Defense'>('All Players');

  const { modifiers, modifiersActive, setModifiersActive } = useModifiersContext();

  const totalPages = Math.ceil(totalPlayers / pageSize);

  const { addPlayerToTeam, team } = useTeamContext();

  const handleCheckboxChange = (playerId: number) => {
    setSelectedPlayers((prevSelected) =>
      prevSelected.includes(playerId)
        ? prevSelected.filter(id => id !== playerId)
        : [...prevSelected, playerId]
    );
  };

  const handleSelectPlayer = async (playerId: number) => {
    const individualPlayersStats = await fetchIndividualPlayersStatsAllSeasons(playerId);
    setSelectedPlayer(individualPlayersStats);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlayer(null);
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

  const handleSort = (column: string) => {
    const direction = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  const calculateProjectedStats = (playerStats: PlayerStats, modifiersActive: boolean, modifiers: Modifiers): number => {
    const gamesProrated = playerStats.gamesPlayed > 0 ? (82 / playerStats.gamesPlayed) : 1;

    const goals = Math.round(playerStats.goals * (modifiersActive && modifiers.goalModifier.enabled ? parseFloat(modifiers.goalModifier.value.toString()) : 0));
    const assists = Math.round(playerStats.assists * (modifiersActive && modifiers.assistModifier.enabled ? parseFloat(modifiers.assistModifier.value.toString()) : 0));
    const SHG = Math.round(playerStats.shortHandedGoals * (modifiersActive && modifiers.SHGModifier.enabled ? parseFloat(modifiers.SHGModifier.value.toString()) : 0));
    const GWG = Math.round(playerStats.gameWinningGoals * (modifiersActive && modifiers.GWGModifier.enabled ? parseFloat(modifiers.GWGModifier.value.toString()) : 0));

    return Math.round((goals + assists + SHG + GWG) * gamesProrated);
  };
  
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const isHidden = hiddenPlayers.includes(player.playerId) || team.includes(player.playerId);
      const isPositionFiltered = (positionFilter === 'All Players') ||
        (positionFilter === 'Forwards' && player.position !== 'D') ||
        (positionFilter === 'Defense' && player.position === 'D');
  
      return !isHidden && isPositionFiltered;
    });
  }, [players, hiddenPlayers, team, positionFilter]);

  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;
  
      if (sortColumn === 'points') {
        aValue = a.playerStats.points;
        bValue = b.playerStats.points;
      } else if (sortColumn === 'projectedStats') {
        const aProjectedStats = calculateProjectedStats(a.playerStats, modifiersActive, modifiers);
        const bProjectedStats = calculateProjectedStats(b.playerStats, modifiersActive, modifiers);
        
        aValue = aProjectedStats;
        bValue = bProjectedStats;
      }
  
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredPlayers, sortColumn, sortDirection, modifiers, modifiersActive]);

  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedPlayers.slice(start, end);
  }, [sortedPlayers, currentPage, pageSize]);

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
    const projectedStats = calculateProjectedStats(item.playerStats, modifiersActive, modifiers);

    return (
      <Pressable
        onPress={() => {
          if (selectedPlayers.length === 0) {
            handleSelectPlayer(item.playerId); // Only trigger if no checkboxes are selected
          } else {
            return;
          }
        }}
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
        <ThemedView style={styles.selectedMenu}>
          <Pressable style={styles.menuButton} onPress={removeSelectedPlayers}>
            <ThemedText style={styles.menuButtonText}>Remove From List</ThemedText>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={addSelectedPlayersToTeam}>
            <ThemedText style={styles.menuButtonText}>Add to Team</ThemedText>
          </Pressable>
        </ThemedView>
      )}
      {selectedPlayers.length === 0 && hiddenPlayers.length > 0 && (
        <ThemedView style={styles.selectedMenu}>
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
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]} onPress={() => handleSort('projectedStats')}
            >Proj. Stats {sortColumn === 'projectedStats' && (sortDirection === 'asc' ? '↑' : '↓')}</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Pos</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>GP</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>G</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>A</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]} onPress={() => handleSort('points')}>
              Pts {sortColumn === 'points' && (sortDirection === 'asc' ? '↑' : '↓')}
            </ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>Pts/PG</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>Shots</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>Shot %</ThemedText>
            <ThemedText style={[styles.cell, styles.cellLongNumbers, styles.headerText]}>TOI</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>SHG</ThemedText>
            <ThemedText style={[styles.cell, styles.cellStats, styles.headerText]}>GWG</ThemedText>
          </ThemedView>

          {/* Rows */}
          <FlatList
            data={paginatedPlayers}
            renderItem={renderPlayer}
            keyExtractor={item => item.playerId.toString()}
            ListEmptyComponent={<ThemedText>No players available.</ThemedText>}
            initialNumToRender={15}
          />
        </ThemedView>
      </ScrollView>

      {/* Pagination */}
      <ThemedView style={styles.pagination}>
        <Pressable
          style={({ pressed }) => [
            styles.paginationButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ThemedText>Previous</ThemedText>
        </Pressable>
        <ThemedText style={styles.paginationButton}>{currentPage} / {totalPages}</ThemedText>
        <Pressable 
          style={({ pressed }) => [
            styles.paginationButton,
            pressed && styles.buttonPressed
            ]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ThemedText>Next</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Position filter dropdown and Modifier toggle */}
      <ThemedView style={styles.bottomButtonsContainer}>
        <PositionDropdown selectedPosition={positionFilter} onSelectPosition={setPositionFilter} />
        <Pressable
          onPress={() => setModifiersActive((prev) => !prev)}
          style={[styles.toggleButton, modifiersActive ? styles.active : styles.inactive]}
        >
          <ThemedText>{modifiersActive ? 'Toggle Modifiers Off' : 'Toggle Modifiers On'}</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Player Stats Modal */}
      <PlayerStatsModal
        selectedPlayer={selectedPlayer}
        modalVisible={modalVisible}
        onClose={handleCloseModal}
      />
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
  selectedMenu: {
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
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    gap: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    width: '50%',
    maxHeight: 43,
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
  buttonPressed: {
    backgroundColor: 'gray',
  }
});