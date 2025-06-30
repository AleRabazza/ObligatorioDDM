import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";




const MenuGlobal = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <MyButton title="Retos" btnColor="blue" btnIcon="bullseye" customPress={() => navigation.navigate("MenuRetos")} /> 
        <MyButton title="Materiales" btnColor="blue" btnIcon="cubes" customPress={() => navigation.navigate("MenuMateriales")} /> 
        <MyButton title="Usuario" btnColor="blue" btnIcon="user-circle" customPress={() => navigation.navigate("MenuUsuario")} />
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

export default MenuGlobal;
