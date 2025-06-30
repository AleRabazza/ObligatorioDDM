import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ClassicButton = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customPress} activeOpacity={0.7}>
      <View>
        <Text style={styles.text}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ClassicButton;

const styles = StyleSheet.create({
button: {
  alignContent: 'center',
  backgroundColor: 'black',
  color: '#ffffff',
  padding: 20,
  marginTop: 15,
  marginLeft: 30,
  marginRight: 30,
  borderRadius: 10,
  alignItems: 'center',
}
,
  text: {
    color: 'white',
  },
});
