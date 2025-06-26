// components/Text.js
import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

const TextComponent = (props) => {
  return (
    <RNText style={styles.text}>
      {props.text}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default TextComponent;
