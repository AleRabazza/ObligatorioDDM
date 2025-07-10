import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView, Image, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ClassicButton from "../../components/ClassicButton";
import colors from "../../styles/colors";
import MyButton from "../../components/MyButton";

const UpdateUser = ({ route, navigation }) => {
  const { user } = route.params;
  const [newUser, setNewUser] = useState({ ...user });

  const requestPerms = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !gal.granted) {
      Alert.alert('Permisos requeridos', 'Habilita acceso a la cámara y la galería.');
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setNewUser({ ...newUser, profilePicture: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setNewUser({ ...newUser, profilePicture: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    console.log("Intentando guardar los cambios...");

    if (
      !newUser.userName.trim() ||
      !newUser.email.trim() ||
      !newUser.age.trim() ||
      !newUser.neighborhood.trim() ||
      !newUser.profilePicture
    ) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }

    if (!newUser.email.includes("@")) {
      Alert.alert("Correo inválido");
      return;
    }

    if (JSON.stringify(newUser) === JSON.stringify(user)) {
      Alert.alert("No realizaste cambios");
      return;
    }

    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allUsers = await AsyncStorage.multiGet(allKeys);

      for (const [key, value] of allUsers) {
        if (!value || key === "usuario_logueado") continue;

        const existingUser = JSON.parse(value);

        if (
          existingUser.email === newUser.email &&
          existingUser.userName !== user.userName
        ) {
          Alert.alert("Error", "Ya existe un usuario con ese correo");
          return;
        }

        if (
          existingUser.userName === newUser.userName &&
          existingUser.userName !== user.userName
        ) {
          Alert.alert("Error", "Ya existe un usuario con ese nombre");
          return;
        }
      }

      await AsyncStorage.setItem(newUser.userName, JSON.stringify(newUser));
      await AsyncStorage.setItem("usuario_logueado", newUser.userName);

      if (newUser.userName !== user.userName) {
        await AsyncStorage.removeItem(user.userName);
      }

      console.log("Usuario actualizado correctamente");

      Alert.alert("Éxito", "Datos actualizados", [
        { text: "OK", onPress: () => navigation.navigate("ProfileUser") },
      ]);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      Alert.alert("Error al guardar los cambios.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        value={newUser.userName}
        onChangeText={(text) => setNewUser({ ...newUser, userName: text })}
        placeholder="Nombre usuario"
      />
      <TextInput
        style={styles.input}
        value={newUser.email}
        onChangeText={(text) => setNewUser({ ...newUser, email: text })}
        placeholder="Correo electrónico"
      />
      <TextInput
        style={styles.input}
        value={newUser.age}
        onChangeText={(text) => setNewUser({ ...newUser, age: text })}
        placeholder="Edad"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={newUser.neighborhood}
        onChangeText={(text) => setNewUser({ ...newUser, neighborhood: text })}
        placeholder="Barrio"
      />

      {newUser.profilePicture ? (
        <Image
          source={{ uri: newUser.profilePicture }}
          style={styles.profileImage}
        />
      ) : null}

      <MyButton style={styles.mybutton} title="Seleccionar foto de galería" onPress={pickFromGallery} />
      <MyButton style={styles.mybutton} title="Tomar una foto nueva" onPress={takePhoto} />

      <ClassicButton title="Guardar cambios" onPress={handleSave} />
      <ClassicButton title="Cancelar" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: colors.fondo
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingLeft: 8,
    width: '90%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  mybutton:{
    backgroundColor : colors.gris
  }
});

export default UpdateUser;
