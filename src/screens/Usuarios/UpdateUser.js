import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassicButton from "../../components/ClassicButton"; 

const UpdateUser = ({ route, navigation }) => {
  const { user } = route.params;
  const [newUser, setNewUser] = useState({ ...user });

  const handleSave = async () => {
    for (let key in newUser) {
      if (!newUser[key].trim()) {
        Alert.alert("Todos los campos son obligatorios");
        return;
      }
    }

    if (JSON.stringify(newUser) === JSON.stringify(user)) {
      Alert.alert("No realizaste cambios");
      return;
    }

    if (newUser.userName !== user.userName) {
      const existing = await AsyncStorage.getItem(newUser.userName);
      if (existing) {
        Alert.alert("Error", "Ya existe un usuario con ese nombre");
        return;
      }
    }

    
    await AsyncStorage.setItem(newUser.userName, JSON.stringify(newUser));
    await AsyncStorage.setItem("usuario_logueado", newUser.userName);

   
    if (newUser.userName !== user.userName) {
      await AsyncStorage.removeItem(user.userName);
    }

    Alert.alert("Éxito", "Datos actualizados", [
      { text: "OK", onPress: () => navigation.navigate("ProfileUser") },
    ]);
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
      <TextInput
        style={styles.input}
        value={newUser.profilePicture}
        onChangeText={(text) => setNewUser({ ...newUser, profilePicture: text })}
        placeholder="Foto perfil"
      />
      <ClassicButton title="Guardar cambios" customPress={handleSave} />
      <ClassicButton title="Cancelar" customPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    alignItems: "center",  
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
  button: {
    paddingVertical: 10,        
    paddingHorizontal: 20,      
    marginVertical: 10,
    backgroundColor: "black",
    color: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    marginRight: 30,
  },
});

export default UpdateUser;
