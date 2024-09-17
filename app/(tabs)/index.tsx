import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PlayersTable from '@/components/PlayersTable';
import { fetchPlayersWithStats } from '@/supabaseCalls/getRequests';
import { Player } from '@/types';

export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenPlayers, setHiddenPlayers] = useState<number[]>([]);

  const pageSize = 15;

  const fetchPlayers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const { players: newPlayers, count } = await fetchPlayersWithStats((page - 1) * pageSize, page * pageSize - 1);
      setPlayers(newPlayers);
      setTotalPlayers(count);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(currentPage, pageSize);
  }, [currentPage]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText>{error}</ThemedText>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      {!loading && !error && (
        <ThemedView>
          <PlayersTable
            players={players}
            totalPlayers={totalPlayers}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            hiddenPlayers={hiddenPlayers}
            setHiddenPlayers={setHiddenPlayers}
          />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});