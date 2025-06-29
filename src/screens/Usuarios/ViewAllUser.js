import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, Text, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewAllUser = () => {
  const [usuarios, setUsuarios] = useState([]);

  const obtenerUsuarios = async () => {
    try {
      const allUsers = [];
      const keys = await AsyncStorage.getAllKeys();
      const userLogueado = await AsyncStorage.getItem("usuario_logueado");

      for (const key of keys) {
        if (key !== "usuario_logueado" && key !== userLogueado) {
          const user = await AsyncStorage.getItem(key);
          if (user) {
            allUsers.push(JSON.parse(user));
          }
        }
      }

      setUsuarios(allUsers);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al obtener los usuarios.");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      {item.profilePicture ? (
        <Image source={{ uri: item.profilePicture }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>Sin foto</Text>
      )}
      <Text style={styles.text}>Usuario: {item.userName}</Text>
      <Text style={styles.text}>Correo: {item.email}</Text>
      <Text style={styles.text}>Edad: {item.age}</Text>
      <Text style={styles.text}>Barrio: {item.neighborhood}</Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay otros usuarios registrados.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  userContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  separator: {
    marginTop: 10,
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "gray",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  noImage: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
});

export default ViewAllUser;
