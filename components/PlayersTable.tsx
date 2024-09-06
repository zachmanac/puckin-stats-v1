import { StyleSheet, View, Text } from 'react-native';

type Player = {
  player_id: number;
  name: string;
  position: string;
};

type Props = {
  players: Player[];
};

export default function PlayersTable({players}: Props) {

  return (
    <View style={styles.container}>
      {/* Columns */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.header]}>ID</Text>
        <Text style={[styles.cell, styles.header]}>Name</Text>
        <Text style={[styles.cell, styles.header, styles.position]}>Position</Text>
      </View>

      {/* Rows */}
      {players.map((player: Player, index: number) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{player.player_id}</Text>
          <Text style={styles.cell}>{player.name}</Text>
          <Text style={[styles.cell, styles.position]}>{player.position}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  position: {
    width: 50,
    textAlign: 'center',
  },
});