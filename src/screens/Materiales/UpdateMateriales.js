import React, { useState } from "react";
import {View, TextInput, Alert, StyleSheet, ScrollView,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassicButton from "../../components/ClassicButton";
import { Picker } from "@react-native-picker/picker";

const UpdateMateriales = ({ route, navigation }) => {
  const { material } = route.params;
  const [newMaterial, setNewMaterial] = useState({ ...material });

  const handleSave = async () => {
    for (let key in newMaterial) {
      if (!newMaterial[key].trim()) {
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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        value={newMaterial.nombre}
        onChangeText={(text) => setNewMaterial({ ...newMaterial, nombre: text })}
        placeholder="Nombre del material"
      />

      <View style={styles.input}>
        <Picker
          selectedValue={newMaterial.categoria}
          onValueChange={(itemValue) =>
            setNewMaterial({ ...newMaterial, categoria: itemValue })
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


      <TextInput
        style={styles.input}
        value={newMaterial.imagen}
        onChangeText={(text) => setNewMaterial({ ...newMaterial, imagen: text })}
        placeholder="URL de la imagen"
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
  backgroundColor: "#fff",
  justifyContent: 'center',
},

picker: {
  height: 40,
  width: "100%",
  color: "#000",
},
});

export default UpdateMateriales;
