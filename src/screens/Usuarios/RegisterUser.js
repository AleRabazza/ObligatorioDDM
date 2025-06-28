import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Localation from 'expo-location';

const RegisterUser = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const clearData = () => {
    setUserName("");
    setPassword("");
    setEmail("");
    setAge("");
    setNeighborhood("");
    setProfilePicture("");
  };

  const requestPerms = async() =>{
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !gal.granted) {
      Alert.alert('Permisos requeridos',
                  'Habilita acceso a la camara y la galeria.');
      return false;
    }
    return true;
  };
  

  const pickFromGallery = async () => {
    if(!(await requestPerms())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality : 1,
    });
    if (!result.canceled) setProfilePicture(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if(!(await requestPerms())) return;
    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
    });
    if (!result.canceled) setProfilePicture(result.assets[0].uri);
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
    if (!profilePicture) {
      Alert.alert("Seleccione una foto de perfil");
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
      <Text>Selecciona tu foto de perfil</Text>
      <Button title="Seleccionar de la Galería" onPress={pickFromGallery} />
      <Button title="Tomar Foto" onPress={takePhoto} />
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
