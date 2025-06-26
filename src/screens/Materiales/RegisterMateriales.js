import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, ScrollView, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";

const RegisterMateriales = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");

  const limpiarCampos = () => {
    setNombre("");
    setCategoria("");
    setImagen("");
  };

  const guardarMaterial = async () => {
    if (!nombre.trim()) {
      Alert.alert("Ingrese el nombre del material");
      return;
    }
    if (!categoria.trim()) {
      Alert.alert("Seleccione una categoría");
      return;
    }
    if (!imagen.trim()) {
      Alert.alert("Ingrese la URL de una imagen");
      return;
    }

    const existingMaterial = await AsyncStorage.getItem(`material_${nombre}`);
    if (existingMaterial) {
      Alert.alert("Error", "Ya existe un material con ese nombre.");
      return;
    }

    const nuevoMaterial = {
      nombre,
      categoria,
      imagen,
    };

    try {
      
      await AsyncStorage.setItem(`material_${nombre}`, JSON.stringify(nuevoMaterial));
      limpiarCampos();
      Alert.alert("Éxito", "Material guardado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al guardar el material.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del material"
        value={nombre}
        onChangeText={setNombre}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Categoría:</Text>
        <Picker
          selectedValue={categoria}
          onValueChange={setCategoria}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una categoría" value="" />
          <Picker.Item label="Plástico" value="Plástico" />
          <Picker.Item label="Metal" value="Metal" />
          <Picker.Item label="Papel" value="Papel" />
          <Picker.Item label="Vidrio" value="Vidrio" />
          <Picker.Item label="Orgánico" value="Orgánico" />
          <Picker.Item label="Electrónico" value="Electrónico" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="URL de imagen de ejemplo"
        value={imagen}
        onChangeText={setImagen}
      />

      <ClassicButton title="Guardar material" customPress={guardarMaterial} />
      <ClassicButton title="Cancelar" customPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 12,
  },
  picker: {
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RegisterMateriales;
