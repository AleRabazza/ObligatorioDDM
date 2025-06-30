import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  Button,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

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
        <TextInput
          style={styles.input}
          value={newMaterial.nombre}
          onChangeText={(text) =>
            setNewMaterial({ ...newMaterial, nombre: text })
          }
          placeholder="Nombre del material"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Categoría:</Text>
          <Picker
            selectedValue={newMaterial.categoria}
            onValueChange={(value) =>
              setNewMaterial({ ...newMaterial, categoria: value })
            }
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

        {newMaterial.imagen ? (
          <Image source={{ uri: newMaterial.imagen }} style={styles.previewImage} />
        ) : (
          <Text style={{ marginVertical: 10, color: "gray", textAlign: "center" }}>
            Ninguna imagen seleccionada
          </Text>
        )}

        <ClassicButton title="Guardar cambios" customPress={handleSave} />
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
    backgroundColor: "#fff",
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

export default UpdateMateriales;
