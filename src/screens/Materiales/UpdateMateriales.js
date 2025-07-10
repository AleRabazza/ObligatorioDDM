import React, { useState } from "react";
import {
  View, TextInput, Alert, StyleSheet, ScrollView,
  Text, Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import colors from "../../styles/colors";

const UpdateMateriales = ({ route, navigation }) => {
  const { material } = route.params;
  const [newMaterial, setNewMaterial] = useState({ ...material });

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
    if (!result.canceled && result.assets?.length > 0) {
      setNewMaterial({ ...newMaterial, imagen: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setNewMaterial({ ...newMaterial, imagen: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    for (let key in newMaterial) {
      if (!newMaterial[key]?.toString().trim()) {
        Alert.alert("Todos los campos son obligatorios");
        return;
      }
    }

    if (JSON.stringify(newMaterial) === JSON.stringify(material)) {
      Alert.alert("No realizaste cambios");
      return;
    }

    if (newMaterial.nombre !== material.nombre) {
      const existing = await AsyncStorage.getItem(`material_${newMaterial.nombre}`);
      if (existing) {
        Alert.alert("Error", "Ya existe un material con ese nombre");
        return;
      }
    }

    await AsyncStorage.setItem(
      `material_${newMaterial.nombre}`,
      JSON.stringify(newMaterial)
    );

    if (newMaterial.nombre !== material.nombre) {
      await AsyncStorage.removeItem(`material_${material.nombre}`);
    }

    Alert.alert("Éxito", "Material actualizado correctamente", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Material</Text>

        <TextInput
          style={styles.input}
          value={newMaterial.nombre}
          onChangeText={(text) => setNewMaterial({ ...newMaterial, nombre: text })}
          placeholder="Nombre del material"
          placeholderTextColor={colors.gris}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Categoría:</Text>
          <Picker
            selectedValue={newMaterial.categoria}
            onValueChange={(value) =>
              setNewMaterial({ ...newMaterial, categoria: value })
            }
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

        {newMaterial.imagen ? (
          <Image source={{ uri: newMaterial.imagen }} style={styles.previewImage} />
        ) : (
          <Text style={styles.noImage}>Ninguna imagen seleccionada</Text>
        )}

        <ClassicButton title="Guardar cambios" onPress={handleSave} />
        <ClassicButton title="Cancelar" onPress={() => navigation.goBack()} color={colors.gris} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.crema || "#F5F0E1", // marroncito claro
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.texto,
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
    color: colors.texto,
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 6,
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

export default UpdateMateriales;
