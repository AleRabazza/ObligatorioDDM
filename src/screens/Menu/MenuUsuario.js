import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";

const MenuUsuario = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <MyButton title="Listar Usuarios" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("ViewAllUser")} />
        <MyButton title="Ver Mi Usuario" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("ProfileUser")} />
        <MyButton title="Volver al menu principal" btnColor="blue" btnIcon="home" customPress={() => navigation.navigate("MenuGlobal")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});

export default MenuUsuario;
