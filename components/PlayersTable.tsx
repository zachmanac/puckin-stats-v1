import { ScrollView, StyleSheet, View, Text } from 'react-native';

type PlayerStats = {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  pointsPerGame: number,
  shootingPercent: number,
  shots: number,
  timeOnIcePerGame: number,
}

type Player = {
  playerId: number;
  name: string;
  position: string;
  playerStats: PlayerStats;
};

type Props = {
  players: Player[];
};

export default function PlayersTable({players}: Props) {

  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View style={styles.table}>
        {/* Columns */}
        <View style={[styles.row, styles.header]}>
          {/* ID IS PLACEHOLDER FOR CHECKBOX */}
          <Text style={[styles.cell, styles.cellId]}>Id</Text>
          <Text style={[styles.cell, styles.cellName]}>Name</Text>
          <Text style={[styles.cell, styles.cellStats]}>projected</Text>
          <Text style={[styles.cell, styles.cellPosition]}>Pos</Text>
          <Text style={[styles.cell, styles.cellStats]}>GP</Text>
          <Text style={[styles.cell, styles.cellStats]}>G</Text>
          <Text style={[styles.cell, styles.cellStats]}>A</Text>
          <Text style={[styles.cell, styles.cellStats]}>Pts</Text>
          <Text style={[styles.cell, styles.cellStats]}>Pts/PG</Text>
          <Text style={[styles.cell, styles.cellStats]}>Shots</Text>
          <Text style={[styles.cell, styles.cellStats]}>Shot %</Text>
          <Text style={[styles.cell, styles.cellStats]}>TOI</Text>
        </View>

        {/* Rows */}
        {players.map((player: Player, index: number) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.cellId]}>{player.playerId}</Text>
            <Text style={[styles.cell, styles.cellName]}>{player.name}</Text>
            <Text style={[styles.cell, styles.cellStats]}>projected</Text>
            <Text style={[styles.cell, styles.cellPosition]}>{player.position}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.gamesPlayed}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.goals}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.assists}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.points}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.pointsPerGame.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.shots}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.shootingPercent.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellStats]}>{player.playerStats.timeOnIcePerGame.toFixed(2)}</Text>
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
  },
  cellName: {
    width: 120,
  },
  cellPosition: {
    width: 25,
  },
  cellStats: {
    width: 25,
  },
});