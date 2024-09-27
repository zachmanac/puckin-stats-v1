import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Position = "All Players" | "Forwards" | "Defense";

export default function PositionDropdown ({
  selectedPosition, onSelectPosition
}: { selectedPosition: Position, onSelectPosition: (position: Position) => void }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const positions: Position[] = ["All Players", "Forwards", "Defense"];

  const handleSelect = (position: Position) => {
    onSelectPosition(position);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.buttonText}>{selectedPosition || 'Position'}</Text>
      </Pressable>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {positions.map((position) => (
            <Pressable
              key={position}
              style={styles.dropdownItem}
              onPress={() => handleSelect(position)}
            >
              <Text style={styles.dropdownText}>{position}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
  },
});