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
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenPlayers, setHiddenPlayers] = useState<number[]>([]);

  const pageSize = 15;

  const fetchAllPlayers = async () => {
    setLoading(true);
    try {
      let allPlayers: Player[] = [];
      let batchSize = 1000;
      let start = 0;
      let end = batchSize - 1;
      let hasMore = true;
  
      while (hasMore) {
        const { players: newPlayers, count } = await fetchPlayersWithStats(start, end);
        if (newPlayers.length === 0) {
          hasMore = false;
        } else {
          allPlayers = [...allPlayers, ...newPlayers];
          start = end + 1;
          end = start + batchSize - 1;
          if (allPlayers.length >= count) {
            hasMore = false;
          }
        }
      }
  
      setPlayers(allPlayers);
      setTotalPlayers(allPlayers.length);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllPlayers();
  }, []);

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