import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, Image, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassicButton from "../../components/ClassicButton";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../styles/colors";


const ProfileUser = ({ navigation }) => {
  const [user, setUser] = useState(null);

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Éxito', 'Todo el AsyncStorage ha sido borrado');
    } catch (error) {
      console.error('Error al borrar el AsyncStorage', error);
      Alert.alert('Error', 'Hubo un problema al borrar los datos');
    } 
  };
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

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
          navigation.navigate("MenuInicio");
        },
      },
    ]);
  };

  const calcularNivel = (puntos) => {
    if (puntos < 100) return 1;
    if (puntos < 1000) return Math.floor(puntos / 100) + 1;
    return 10 + Math.floor((puntos - 1000) / 500) + 1;
  };



  if (!user) return null;

  const puntos = parseInt(user.puntos) || 0;
  const nivel = calcularNivel(puntos);


  // === Barra de progreso ===
  const puntosTotalesNivel = nivel < 10 ? 100 : 500;
  const puntosCompletados = nivel < 10 ? puntos % 100 : (puntos - 1000) % 500;
  const puntosRestantes = puntosTotalesNivel - puntosCompletados;
  const progreso = (puntosCompletados / puntosTotalesNivel) * 100;

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
      <Text style={[styles.text, styles.nivel]}>Nivel actual - {nivel}</Text>
    

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progreso}%` }]} />
        </View>
        <Text style={styles.text}>Faltan {puntosRestantes} puntos para subir de nivel</Text>
      </View>
      <Button title="Borrar Todo el AsyncStorage" onPress={clearAll} /> 
      {/* Botones */}
      <ClassicButton
        title="Editar"
        onPress={() => navigation.navigate("UpdateUser", { user })}
      />
      <ClassicButton
        title="Eliminar cuenta"
        onPress={deleteUser}
        btnColor="red"
      />

      <ClassicButton
        title="Cerrar sesión"
        onPress={() => navigation.navigate("MenuInicio")}
        btnColor="gray"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor:colors.fondo,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  nivel: {
    fontWeight: "bold",
    color: colors.botonPrimario,
    fontSize: 18,
  },
  mensaje: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: colors.gris,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2a9d8f',
  },
});

export default ProfileUser;
