import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Modifiers() {

  return (
    <ThemedView style={styles.userSettingsContainer}>
      <View style={styles.headerContainer}>
        <ThemedText type={'subtitle'}>
          Modifiers
        </ThemedText>
      </View>
      <ThemedText>
        Modifier 1: 
        {'\n'}
        Modifier 2:
      </ThemedText>
    </ThemedView>
)};

const styles = StyleSheet.create({
  userSettingsContainer: {
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 10,
  },
  headerContainer: {
    width: '100%',
  },
  headerText: {
    fontSize: 35,
    color: 'white',
  },
  text: {
    fontSize: 25,
    color: 'white',
    alignItems: 'center',
  }
});