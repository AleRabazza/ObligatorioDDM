import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";
import colors from '../../styles/colors';

const MenuMateriales = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <MyButton title="Agregar Materiales" btnColor="blue" btnIcon="plus-square" onPress={() => navigation.navigate("RegisterMateriales")}/>
        <MyButton title="Listar Materiales" btnColor="blue" btnIcon="list" onPress={() => navigation.navigate("ViewAllMateriales")} />
        <MyButton title="Volver al menu principal" btnColor="blue" btnIcon="home" onPress={() => navigation.navigate("MenuGlobal")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MenuMateriales;
