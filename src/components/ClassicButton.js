import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const ClassicButton = ({ onPress, title, color = colors.botonPrimario }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2
  },
  text: {
    color: colors.blanco,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ClassicButton;
