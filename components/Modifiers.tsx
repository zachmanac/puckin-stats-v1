import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from './ThemedTextInput';
import { useModifiersContext } from '@/contextProvider/modifiersContextProvider';
import { Modifiers } from '@/types';

export default function ModifiersTable() {
  const { modifiers, setModifiers } = useModifiersContext();
  const [localModifiers, setLocalModifiers] = useState(modifiers);

  const handleInputChange = (key: keyof Modifiers, value: string) => {
    if (value === '' || value === '.' || !isNaN(Number(value))) {
      setLocalModifiers((prevModifiers: Modifiers) => ({
        ...prevModifiers,
        [key]: {
          ...prevModifiers[key],
          value,
        },
      }));
    }
  };

  const toggleModifier = (modifierKey: keyof Modifiers) => {
    setLocalModifiers((prevModifiers) => ({
      ...prevModifiers,
      [modifierKey]: {
        ...prevModifiers[modifierKey],
        enabled: !prevModifiers[modifierKey].enabled,
      },
    }));
  };

  const handleSave = () => {
    const updatedModifiers = Object.keys(localModifiers).reduce((acc, key) => {
      const modifierKey = key as keyof Modifiers;
      
      acc[modifierKey] = {
        value: parseFloat(localModifiers[modifierKey].value as string),
        enabled: localModifiers[modifierKey].enabled,
      };
      
      return acc;
    }, {} as Modifiers);
  
    setModifiers(updatedModifiers);
  };

  return (
    <ThemedView style={styles.userSettingsContainer}>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>Goal Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.goalModifier.value.toString()}
          onChangeText={(value) => handleInputChange('goalModifier', value)}
        />
        <Pressable style={styles.button} onPress={() => toggleModifier('goalModifier')}>
          <ThemedText>
            {localModifiers.goalModifier.enabled ? 'Disable' : 'Enable'}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>Assist Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.assistModifier.value.toString()}
          onChangeText={(value) => handleInputChange('assistModifier', value)}
        />
        <Pressable style={styles.button} onPress={() => toggleModifier('assistModifier')}>
          <ThemedText>
            {localModifiers.assistModifier.enabled ? 'Disable' : 'Enable'}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>GWG Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.GWGModifier.value.toString()}
          onChangeText={(value) => handleInputChange('GWGModifier', value)}
        />
        <Pressable style={styles.button} onPress={() => toggleModifier('GWGModifier')}>
          <ThemedText>
            {localModifiers.GWGModifier.enabled ? 'Disable' : 'Enable'}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>SHG Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.SHGModifier.value.toString()}
          onChangeText={(value) => handleInputChange('SHGModifier', value)}
        />
        <Pressable style={styles.button} onPress={() => toggleModifier('SHGModifier')}>
          <ThemedText>
            {localModifiers.SHGModifier.enabled ? 'Disable' : 'Enable'}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView>
        <Pressable style={styles.button} onPress={handleSave}>
          <ThemedText>Save Changes</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  userSettingsContainer: {
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 10,
  },
  headerContainer: {
    width: '100%',
  },
  modifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    gap: 10,
  },
  button: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 5,
  },
});