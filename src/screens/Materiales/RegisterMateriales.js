import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, ScrollView, Text, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const RegisterMateriales = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);

  const limpiarCampos = () => {
    setNombre("");
    setCategoria("");
    setImagen(null);
  };

  const requestPerms = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !gal.granted) {
      Alert.alert("Permisos requeridos", "Habilita acceso a la cámara y la galería.");
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagen(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagen(result.assets[0].uri);
    }
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
    if (!imagen) {
      Alert.alert("Seleccione una imagen del material");
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
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al guardar el material.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
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

        <Text style={{ marginBottom: 8 }}>Selecciona una imagen del material</Text>
        <Button title="Seleccionar de la Galería" onPress={pickFromGallery} />
        <Button title="Tomar Foto" onPress={takePhoto} />

        {/* ✅ Aseguramos que se muestre la imagen */}
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.previewImage} />
        ) : (
          <Text style={{ marginVertical: 10, color: "gray", textAlign: "center" }}>
            Ninguna imagen seleccionada
          </Text>
        )}

        <ClassicButton title="Guardar material" customPress={guardarMaterial} />
        <ClassicButton title="Cancelar" customPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
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
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
});

export default RegisterMateriales;
