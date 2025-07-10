import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const MyInputText = ({ placeholder, value, onChangeText, style }) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor={colors.grisClaro}
    value={value}
    onChangeText={onChangeText}
    style={[styles.input, style]}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.verdeClaro,
    backgroundColor: colors.blanco,
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    color: colors.textoOscuro,
  },
});

export default MyInputText;
