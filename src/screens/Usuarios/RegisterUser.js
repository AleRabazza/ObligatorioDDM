import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert, Text, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import colors from "../../styles/colors";
import MyButton from "../../components/MyButton";
import ClassicButton from "../../components/ClassicButton";

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
    setProfilePicture(null);
  };

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
    if (!result.canceled) setProfilePicture(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (!(await requestPerms())) return;
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
    const keys = await AsyncStorage.getAllKeys();
    const allUsers = await AsyncStorage.multiGet(keys);
    
    // verificamos q no exista el nombre en otro usuario
    const existingUser = allUsers.find(([key]) => key === userName);
    if (existingUser) {
      Alert.alert("Este nombre de usuario ya está registrado.");
      return;
    }

    // verificamos q no exista el mail en otro usuario
    const emailExiste = allUsers.some(([key, value]) => {
      try {
        const userData = JSON.parse(value);
        return userData.email === email;
      } catch {
        return false;
      }
    });

    if (emailExiste) {
      Alert.alert("Este correo electrónico ya está en uso.");
      return;
    }

    const newUser = {
      userName,
      password,
      email,
      age,
      neighborhood,
      profilePicture,
      puntos: 0,
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
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Barrio o Zona"
        value={neighborhood}
        onChangeText={setNeighborhood}
      />
      <Text style={{ marginBottom: 8  }}>Selecciona tu foto de perfil</Text>
      <MyButton title="Seleccionar de la Galería" onPress={pickFromGallery} />
      <MyButton title="Tomar Foto" onPress={takePhoto} />

      {/* Mostrar la imagen seleccionada o tomada */}
      {profilePicture && (
        <Image
          source={{ uri: profilePicture }}
          style={styles.profileImage}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <MyButton title="Registrar" onPress={registerUser} />
      </View>

      <View style={{ marginTop: 10 }}>
        <ClassicButton title="Cancelar" color="red" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.fondo,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 4,
    marginBottom: 15,
    paddingLeft: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
    alignSelf: "center",
  },
});

export default RegisterUser;
