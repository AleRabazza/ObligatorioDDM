import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const MyButton = ({ onPress, title, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.botonPrimario,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3
  },
  text: {
    color: colors.blanco,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default MyButton;
