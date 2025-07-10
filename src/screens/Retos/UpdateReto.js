import React, { useEffect, useState } from 'react';
import {
  View, TextInput, StyleSheet, Alert, Text,
  KeyboardAvoidingView, ScrollView, Platform,
  TouchableOpacity, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ClassicButton from '../../components/ClassicButton';
import colors from '../../styles/colors';

const UpdateReto = ({ route, navigation }) => {
  const { reto } = route.params;

  const [nombreReto, setNombreReto] = useState(reto.nombreReto);
  const [descripcion, setDescripcion] = useState(reto.descripcion);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(reto.categoria);
  const [fechaLimite, setFechaLimite] = useState(new Date(reto.fechaLimite));
  const [puntaje, setPuntaje] = useState(reto.puntaje);
  const [usuarioCreador] = useState(reto.usuarioCreador);
  const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const cargarMateriales = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const materialKeys = keys.filter(key => key.startsWith('material_'));
      const materiales = await AsyncStorage.multiGet(materialKeys);
      const nombres = materiales.map(([_, value]) => {
        try {
          const parsed = JSON.parse(value);
          return parsed.nombre;
        } catch {
          return null;
        }
      }).filter(n => n);
      setMaterialesDisponibles(nombres);
    };

    cargarMateriales();
  }, []);

  const formatDateLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const actualizarReto = async () => {
    if (
      nombreReto === reto.nombreReto &&
      descripcion === reto.descripcion &&
      materialSeleccionado === reto.categoria &&
      fechaLimite.toDateString() === new Date(reto.fechaLimite).toDateString()
    ) {
      Alert.alert("Sin cambios", "No se realizaron modificaciones al reto.");
      return;
    }

    if (!nombreReto.trim() || !descripcion.trim() || !materialSeleccionado.trim() || !fechaLimite) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const data = await AsyncStorage.getItem('retos');
      let retosArray = data ? JSON.parse(data) : [];

      const index = retosArray.findIndex(r =>
        r.usuarioCreador === usuarioCreador &&
        r.nombreReto === reto.nombreReto
      );

      if (index !== -1) {
        retosArray[index] = {
          nombreReto,
          descripcion,
          categoria: materialSeleccionado,
          fechaLimite: formatDateLocal(fechaLimite),
          puntaje,
          usuarioCreador,
        };

        await AsyncStorage.setItem('retos', JSON.stringify(retosArray));
        Alert.alert("Éxito", "Reto actualizado correctamente", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "No se encontró el reto para actualizar");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al actualizar el reto");
    }
  };

  const showDatepicker = () => setShowDatePicker(true);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setFechaLimite(selectedDate);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>✏️ Editar Reto</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del Reto"
            value={nombreReto}
            onChangeText={setNombreReto}
            placeholderTextColor={colors.gris}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            placeholderTextColor={colors.gris}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Material:</Text>
            <Picker
              selectedValue={materialSeleccionado}
              onValueChange={setMaterialSeleccionado}
              style={styles.picker}
              dropdownIconColor={colors.texto}
            >
              <Picker.Item label="Seleccione un material" value="" />
              {materialesDisponibles.map((material, index) => (
                <Picker.Item key={index} label={material} value={material} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Fecha Límite:</Text>
          <TouchableOpacity onPress={showDatepicker} style={styles.fechaInput}>
            <Text style={styles.fechaText}>{formatDateLocal(fechaLimite)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={fechaLimite || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Puntaje asignado:</Text>
            <Text style={styles.puntajeTexto}>{puntaje} puntos</Text>
          </View>

          <ClassicButton title="Guardar Cambios" onPress={actualizarReto} />
          <ClassicButton title="Cancelar" onPress={() => navigation.goBack()} color={colors.gris} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.fondo,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.texto,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
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
    backgroundColor: colors.fondoClaro,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.sombra,
  },
  picker: {
    width: '100%',
    color: colors.texto,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.texto,
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 6,
  },
  fechaInput: {
    borderWidth: 1,
    borderColor: colors.sombra,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.fondoClaro,
  },
  fechaText: {
    fontSize: 16,
    color: colors.texto,
  },
  puntajeTexto: {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.fondoClaro,
    color: colors.texto,
    marginBottom: 16,
  },
});

export default UpdateReto;
