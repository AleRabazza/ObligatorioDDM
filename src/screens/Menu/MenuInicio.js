import React from "react";
import { View, StyleSheet, Text } from "react-native";
import TextComponent from "../../components/TextComponent";
import MyButton from "../../components/MyButton";

const MenuInicio = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planeta Vivo</Text>
      <Text style={styles.subtitle}>EcoChallenge</Text>
      <TextComponent text="¡Bienvenidos a EcoChallenge! 🌱 Comenzá a reciclar, ganar puntos y hacer del planeta un lugar mejor." />

      <View style={styles.buttonContainer}>
        <MyButton title="Iniciar Sesión" btnColor="#2D6A4F"  btnIcon="sign-in" customPress={() => navigation.navigate("LoginUser")} />
      </View>

      <View style={styles.buttonContainer}>
        <MyButton title="Registrarse" btnColor="#40916C" btnIcon="user-plus" customPress={() => navigation.navigate("RegisterUser")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    backgroundColor: "#EAFBF3", 
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2D6A4F",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#40916C", 
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "80%", 
  },
});

export default MenuInicio;
