import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MyButton from '../../components/MyButton';
import colors from '../../styles/colors';


const MenuRetos = ({navigation}) => {

  return (
    <View style={styles.container}>
       <MyButton title="Agregar Retos" btnColor="blue" btnIcon="bullseye" onPress={() => navigation.navigate("RegisterRetos")} />

      <MyButton title="Listar Retos" btnColor="blue" btnIcon="list"  onPress={() => navigation.navigate("ViewAllRetos")} />

      <MyButton title="Mis Retos" btnColor="blue" btnIcon="trophy" onPress={() => navigation.navigate("ViewRetos")} />

      <MyButton title="Mis Solicitudes de Reto" btnColor="blue" btnIcon="bell" onPress={() => navigation.navigate("MisSolicitudes")} />

      <MyButton title="Volver al menu principal" btnColor="blue" btnIcon="home" onPress={() => navigation.navigate("MenuGlobal")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.fondo,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default MenuRetos;

