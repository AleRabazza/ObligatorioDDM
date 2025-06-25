import React from "react";
import { Text, StyleSheet } from "react-native";

const Text = (props) => {
  return (
    <Text style={styles.text}>
      {props.text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000', 
  },
});

export default Text;
