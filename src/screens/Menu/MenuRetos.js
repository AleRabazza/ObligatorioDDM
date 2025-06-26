import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MenuRetos = () => {
  return (
    <View style={styles.container}>
       <MyButton title="AgregarRetos" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("Opcion1")} />

      <MyButton title="Listar Retos" btnColor="blue" btnIcon="user-plus"  customPress={() => navigation.navigate("Opcion2")} />
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

