import React from "react";
import { View, StyleSheet, Button } from "react-native";
import  TextComponent from "../../components/TextComponent"; 
import MyButton from "../../components/MyButton";
const MenuInicio = ({ navigation }) => {
  return (
      <View style={styles.container}>
      <TextComponent text="Bienvenidos" />
      <MyButton title="Iniciar Sesión" btnColor="blue" btnIcon="sign-in" customPress={() => navigation.navigate("LoginUser")} />
      <MyButton title="Registrarse " btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("RegisterUser")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default MenuInicio;
