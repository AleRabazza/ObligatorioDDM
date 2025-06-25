import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const MyInputText = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        underlineColorAndroid="transparent"
        maxLength={props.maxLength}
        minLength={props.minLength}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="grey"
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={styles.input}
        blurOnSubmit={false}
        value={props.value}
        defaultValue={props.defaultValue}
      />
    </View>
  );
};

export default MyInputText;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5', // Fondo gris claro
    borderWidth: 1,
    borderColor: '#ddd', // Borde gris claro
    fontSize: 16,
    color: '#333', // Texto oscuro
    fontFamily: 'Roboto', // Fuente sencilla y limpia
  },
});
