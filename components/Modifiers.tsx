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
  const [saved, setSaved] = useState(false);

  const handleInputChange = (key: keyof Modifiers, value: string) => {
    const isNumber = !isNaN(Number(value));

    if (isNumber) {
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
    setSaved(true);

    const updatedModifiers = Object.keys(localModifiers).reduce((acc, key) => {
      const modifierKey = key as keyof Modifiers;
      
      acc[modifierKey] = {
        value: parseFloat(localModifiers[modifierKey].value as string),
        enabled: localModifiers[modifierKey].enabled,
      };
      
      return acc;
    }, {} as Modifiers);

    setModifiers(updatedModifiers);
    setTimeout(() => setSaved(false), 2000);
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
        <Pressable
          style={[
            styles.button, 
            localModifiers.goalModifier.enabled ? styles.buttonEnabled : styles.buttonDisabled
          ]}
          onPress={() => toggleModifier('goalModifier')}
        >
          <ThemedText>{localModifiers.goalModifier.enabled ? 'Enabled' : 'Disabled'}</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>Assist Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.assistModifier.value.toString()}
          onChangeText={(value) => handleInputChange('assistModifier', value)}
        />
        <Pressable
          style={[
            styles.button,
            localModifiers.assistModifier.enabled ? styles.buttonEnabled : styles.buttonDisabled
          ]}
          onPress={() => toggleModifier('assistModifier')}
        >
          <ThemedText>{localModifiers.assistModifier.enabled ? 'Enabled' : 'Disabled'}</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>GWG Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.GWGModifier.value.toString()}
          onChangeText={(value) => handleInputChange('GWGModifier', value)}
        />
        <Pressable
          style={[
            styles.button,
            localModifiers.GWGModifier.enabled ? styles.buttonEnabled : styles.buttonDisabled
          ]}
          onPress={() => toggleModifier('GWGModifier')}
        >
          <ThemedText>{localModifiers.GWGModifier.enabled ? 'Enabled' : 'Disabled'}</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.modifierRow}>
        <ThemedText>SHG Modifier:</ThemedText>
        <ThemedTextInput
          keyboardType="numeric"
          value={localModifiers.SHGModifier.value.toString()}
          onChangeText={(value) => handleInputChange('SHGModifier', value)}
        />
        <Pressable
          style={[
            styles.button, 
            localModifiers.SHGModifier.enabled ? styles.buttonEnabled : styles.buttonDisabled
          ]}
          onPress={() => toggleModifier('SHGModifier')}
        >
          <ThemedText>{localModifiers.SHGModifier.enabled ? 'Enabled' : 'Disabled'}</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          { saved ? (
            <ThemedText>Saved</ThemedText>
          ) : (
            <ThemedText>Save Changes</ThemedText>
          )}
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
    borderRadius: 5,
    padding: 5,
  },
  buttonEnabled: {
    backgroundColor: 'green',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  saveButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 5,
  },
});