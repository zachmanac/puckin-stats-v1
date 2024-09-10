import { Pressable, Text, StyleSheet } from 'react-native';
import { CheckboxProps } from '@/types';

const Checkbox = ({ checked = false, onChange }: CheckboxProps) => {
  return (
    <Pressable
      style={[styles.checkbox, checked && styles.checked]}
      onPress={() => onChange?.(!checked)}
    >
      {checked && <Text style={styles.checkmark}>✔</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    width: 20,
    height: 20,
  },
  checked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
  },
});

export default Checkbox;