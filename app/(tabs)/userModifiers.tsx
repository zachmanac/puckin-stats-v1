import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ModifiersTable from '@/components/Modifiers';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function userModifiers() {

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <View style={styles.userSettingsContainer}>
        <ThemedView style={styles.centeredTextContainer}>
          <ThemedText type={'title'}>
            Modifiers
          </ThemedText>
        </ThemedView>
        <ModifiersTable />
      </View>
    </ParallaxScrollView>
)};

const styles = StyleSheet.create({
  userSettingsContainer: {
    gap: 8,
    width: '100%',
  },
  centeredTextContainer: {
    width: '100%',
    alignItems: 'center',
  },
});