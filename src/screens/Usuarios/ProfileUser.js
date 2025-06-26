import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassicButton from "../../components/ClassicButton"; 

const ProfileUser = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userName = await AsyncStorage.getItem("usuario_logueado");
      if (userName) {
        const userData = await AsyncStorage.getItem(userName);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    };
    loadUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("usuario_logueado");
    navigation.navigate("LoginUser");
  };

  const deleteUser = async () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar tu cuenta?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await AsyncStorage.removeItem(user.userName);
          await AsyncStorage.removeItem("usuario_logueado");
          Alert.alert("Cuenta eliminada");
          navigation.navigate("LoginUser");
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {user.profilePicture ? (
        <Image source={{ uri: user.profilePicture }} style={styles.image} />
      ) : (
        <Text style={styles.text}>Sin foto de perfil</Text>
      )}
      <Text style={styles.text}>Usuario: {user.userName}</Text>
      <Text style={styles.text}>Correo: {user.email}</Text>
      <Text style={styles.text}>Edad: {user.age}</Text>
      <Text style={styles.text}>Barrio: {user.neighborhood}</Text>

      <ClassicButton
        title="Editar"
        customPress={() => navigation.navigate("UpdateUser", { user })}
      />
      <ClassicButton
        title="Eliminar cuenta"
        customPress={deleteUser}
        btnColor="red"
      />
      <ClassicButton
        title="Cerrar sesión"
        customPress={logout}
        btnColor="gray"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
});

export default ProfileUser;
