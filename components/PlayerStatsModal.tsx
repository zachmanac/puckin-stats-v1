import React from 'react';
import { Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { PlayerStatsModalProps } from '@/types';

export default function PlayerStatsModal({ modalVisible, selectedPlayer, onClose }: PlayerStatsModalProps) {

  const formatSeasonDisplay = (seasonId: number): string => {
    const seasonString = seasonId.toString();
    const startAbbreviation = seasonString.slice(2, 4); 
    const endAbbreviation = seasonString.slice(6, 8);
    return `${startAbbreviation}/${endAbbreviation}`;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          {selectedPlayer && (
            <>
              <ThemedText style={[styles.modalTitle]}>{selectedPlayer[0].name}</ThemedText>
              <ScrollView horizontal>
                {/* Columns */}
                <ThemedView style={styles.table}>
                  <ThemedView style={[styles.row, styles.header]}>
                  <ThemedText style={[styles.cell, styles.cellSeason, styles.headerText]}>Season</ThemedText>
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
                  {selectedPlayer.map((individualSeason: any) => (
                    <ThemedView key={individualSeason.seasonId} style={styles.row}>
                      <ThemedText style={[styles.cell, styles.cellSeason]}>{formatSeasonDisplay(individualSeason.seasonId)}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.gamesPlayed}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.goals}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.assists}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.points}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.pointsPerGame.toFixed(2)}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{individualSeason.playerStats.shots}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>{(individualSeason.playerStats.shootingPercent * 100).toFixed(2)}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellLongNumbers]}>
                        {/* minutes */}
                        {Math.floor(individualSeason.playerStats.timeOnIcePerGame / 60)}:
                        {/* seconds */}
                        {String(Math.round((individualSeason.playerStats.timeOnIcePerGame / 60 % 1) * 60)).padStart(2, '0')}
                      </ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.shortHandedGoals}</ThemedText>
                      <ThemedText style={[styles.cell, styles.cellStats]}>{individualSeason.playerStats.gameWinningGoals}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ScrollView>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <ThemedText style={styles.closeButtonText}>Close</ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    padding: 20,
  },
  modalContent: {
    borderRadius: 10,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    overflow: 'scroll',
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
  cellStats: {
    width: 30,
    textAlign: 'center',
  },
  cellLongNumbers: {
    width: 35,
    textAlign: 'center',
  },
  cellSeason: {
    width: 40,
    textAlign: 'center',
  },
});