import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../styles/colors";
import MyInputText from "../../components/InputText";
import MyButton from "../../components/MyButton";
import ClassicButton from "../../components/ClassicButton";

const LoginUser = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!userName.trim()) {
      Alert.alert("Ingrese su nombre de usuario");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Ingrese su contraseña");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem(userName);
      if (!userData) {
        Alert.alert("El nombre de usuario no está registrado.");
        return;
      }

      const user = JSON.parse(userData);
      if (user.password !== password) {
        Alert.alert("Contraseña incorrecta");
        return;
      }

      await AsyncStorage.setItem("usuario_logueado", userName);

    
      Alert.alert("Éxito", "¡Bienvenido!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("MenuGlobal"),  
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al iniciar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <MyInputText style={styles.input} placeholder="Nombre de Usuario" value={userName} onChangeText={setUserName} />
      <MyInputText style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <ClassicButton title="Iniciar Sesión" onPress={loginUser} />
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
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: colors.fondoClaro,
  },
});

export default LoginUser;
 