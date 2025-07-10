import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const MySelect = ({ selectedValue, onValueChange, options }) => (
  <View style={styles.selectContainer}>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      {options.map((opt, index) => (
        <Picker.Item key={index} label={opt.label} value={opt.value} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.verdeClaro,
    borderRadius: 10,
    backgroundColor: colors.blanco,
    marginVertical: 8,
  },
  picker: {
    height: 50,
    color: colors.textoOscuro,
  },
});

export default MySelect;
