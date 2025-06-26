import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";

const MenuMateriales = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <MyButton title="Agregar Materiales" btnColor="blue" btnIcon="plus-circle" customPress={() => navigation.navigate("RegisterMateriales")}/>
        <MyButton title="Listar Materiales" btnColor="blue" btnIcon="list" customPress={() => navigation.navigate("ViewAllMateriales")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MenuMateriales;
