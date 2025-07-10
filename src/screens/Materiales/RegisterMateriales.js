import React, { useState } from "react";
import {
  View, TextInput, StyleSheet, Alert,
  ScrollView, Text, Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import colors from "../../styles/colors";

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
    if (!nombre.trim()) return Alert.alert("Ingrese el nombre del material");
    if (!categoria.trim()) return Alert.alert("Seleccione una categoría");
    if (!imagen) return Alert.alert("Seleccione una imagen del material");

    const existingMaterial = await AsyncStorage.getItem(`material_${nombre}`);
    if (existingMaterial) return Alert.alert("Error", "Ya existe un material con ese nombre.");

    const nuevoMaterial = { nombre, categoria, imagen };

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
        <Text style={styles.title}>Registrar Material</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del material"
          placeholderTextColor={colors.gris}
          value={nombre}
          onChangeText={setNombre}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Categoría</Text>
          <Picker
            selectedValue={categoria}
            onValueChange={setCategoria}
            style={styles.picker}
            dropdownIconColor={colors.texto}
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

        <Text style={styles.label}>Imagen del material</Text>
        <ClassicButton title="Seleccionar de la Galería" onPress={pickFromGallery} />
        <ClassicButton title="Tomar Foto" onPress={takePhoto} />

        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.previewImage} />
        ) : (
          <Text style={styles.noImage}>Ninguna imagen seleccionada</Text>
        )}

        <ClassicButton title="Guardar material" onPress={guardarMaterial} />
        <ClassicButton title="Cancelar" onPress={() => navigation.goBack()} color={colors.gris} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.fondo,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: colors.texto,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: colors.fondoClaro,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: colors.texto,
    borderWidth: 1,
    borderColor: colors.sombra,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: colors.fondoClaro,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.sombra,
  },
  picker: {
    width: "100%",
    color: colors.texto,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: colors.texto,
    paddingLeft: 10,
    paddingTop: 10,
  },
  previewImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginVertical: 20,
    borderColor: colors.sombra,
    borderWidth: 2,
  },
  noImage: {
    marginVertical: 10,
    color: colors.gris,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default RegisterMateriales;
