import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MyButton from "../../components/MyButton";
import colors from '../../styles/colors';




const MenuGlobal = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <MyButton title="Retos" btnColor="blue" btnIcon="bullseye" onPress={() => navigation.navigate("MenuRetos")} /> 
        <MyButton title="Materiales" btnColor="blue" btnIcon="cubes" onPress={() => navigation.navigate("MenuMateriales")} /> 
        <MyButton title="Usuario" btnColor="blue" btnIcon="user-circle" onPress={() => navigation.navigate("MenuUsuario")} />
        <MyButton title="Estadísticas" btnColor="blue" btnIcon="bar-chart" onPress={() => navigation.navigate("EstadisticasUsuario")} />
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

export default MenuGlobal;
