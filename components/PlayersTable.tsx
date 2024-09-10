import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Player } from '@/types';

export default function PlayersTable({ players }: { players: any[] }) {

  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View style={styles.table}>
        {/* Columns */}
        <View style={[styles.row, styles.header]}>
          {/* ID IS PLACEHOLDER FOR CHECKBOX */}
          <Text style={[styles.cell, styles.cellId]}>Id</Text>
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
            <Text style={[styles.cell, styles.cellId]}>{player.playerId}</Text>
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
    width: 80,
    textAlign: 'center',
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