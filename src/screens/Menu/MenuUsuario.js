import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";
import colors from "../../styles/colors";

const MenuUsuario = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <MyButton title="Listar Usuarios" btnColor="blue" btnIcon="list" onPress={() => navigation.navigate("ViewAllUser")} />
        <MyButton title="Ver Mi Usuario" btnColor="blue" btnIcon="user" onPress={() => navigation.navigate("ProfileUser")} />
        <MyButton title="Volver al menu principal" btnColor="blue" btnIcon="home" onPress={() => navigation.navigate("MenuGlobal")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.fondo,
  },
});

export default MenuUsuario;
