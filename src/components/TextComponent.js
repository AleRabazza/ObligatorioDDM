import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const TextComponent = ({ children, style }) => (
  <Text style={[styles.text, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.texto,
    fontWeight: '500'
  }
});

export default TextComponent;
