import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { useIsFocused } from "@react-navigation/native"; 

const ViewAllMateriales = ({ navigation }) => {
  const [materials, setMaterials] = useState([]);
  const isFocused = useIsFocused(); 

  
  const obtenerMateriales = async () => {
    try {
      const allMaterials = [];
      const keys = await AsyncStorage.getAllKeys();

      for (const key of keys) {
        if (key.startsWith("material_")) {
          const mat = await AsyncStorage.getItem(key);
          if (mat) {
            allMaterials.push(JSON.parse(mat));
          }
        }
      }
      setMaterials(allMaterials); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error al obtener los materiales.");
    }
  };

  
  useEffect(() => {
    if (isFocused) {
      obtenerMateriales(); 
    }
  }, [isFocused]); 

  const eliminarMaterial = async (nombre) => {
    Alert.alert(
      "Eliminar",
      `¿Estás seguro de eliminar el material "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(`material_${nombre}`);
            obtenerMateriales(); 
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>Sin imagen</Text>
      )}
      <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
      <Text>Categoría: {item.categoria}</Text>

      <ClassicButton
        title="Editar material"
        customPress={() => navigation.navigate("UpdateMateriales", { material: item, obtenerMateriales })}
      />
      <ClassicButton
        title="Eliminar material"
        btnColor="red"
        customPress={() => eliminarMaterial(item.nombre)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={materials}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay materiales registrados.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    alignItems: "center",
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  noImage: {
    color: "gray",
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "gray",
  },
});

export default ViewAllMateriales;

