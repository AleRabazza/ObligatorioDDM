import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MyButton from '../../components/MyButton';


const MenuRetos = ({navigation}) => {

  return (
    <View style={styles.container}>
       <MyButton title="Agregar Retos" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("RegisterRetos")} />

      <MyButton title="Listar Retos" btnColor="blue" btnIcon="user-plus"  customPress={() => navigation.navigate("ViewAllRetos")} />

      <MyButton title="Mis Retos" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("ViewRetos")} />

      <MyButton title="Mis Solicitudes de Reto" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("MisSolicitudes")} />

                <MyButton title="Volver al menu principal" btnColor="blue" btnIcon="home" customPress={() => navigation.navigate("MenuGlobal")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default MenuRetos;

