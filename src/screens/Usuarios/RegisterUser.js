import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterUser = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const clearData = () => {
    setUserName("");
    setPassword("");
    setEmail("");
    setAge("");
    setNeighborhood("");
    setProfilePicture("");
  };

  const registerUser = async () => {
   
    if (!userName.trim()) {
      Alert.alert("Ingrese su nombre de usuario");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Ingrese su contraseña");
      return;
    }
    if (!email.trim() || email.indexOf("@") === -1) {
      Alert.alert("Ingrese un correo electrónico válido");
      return;
    }
    if (!age.trim()) {
      Alert.alert("Ingrese su edad");
      return;
    }
    if (!neighborhood.trim()) {
      Alert.alert("Ingrese su barrio o zona de residencia");
      return;
    }
    if (!profilePicture.trim()) {
      Alert.alert("Ingrese una URL para la foto de perfil");
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(userName);
      if (existingUser) {
        Alert.alert("Este nombre de usuario ya está registrado.");
        return;
      }

      const newUser = {
        userName,
        password,
        email,
        age,
        neighborhood,
        profilePicture,
      };

      await AsyncStorage.setItem(userName, JSON.stringify(newUser));
      await AsyncStorage.setItem("usuario_logueado", userName); 
      clearData();
      Alert.alert("Éxito", "Usuario registrado correctamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("MenuGlobal"),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al registrar el usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nombre de Usuario" value={userName} onChangeText={setUserName} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Correo Electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Barrio o Zona" value={neighborhood} onChangeText={setNeighborhood} />
      <TextInput style={styles.input} placeholder="Foto de Perfil" value={profilePicture} onChangeText={setProfilePicture} />
      <Button title="Registrar" onPress={registerUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default RegisterUser;
