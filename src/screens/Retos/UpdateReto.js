import React, { useEffect, useState } from 'react';
import { View,TextInput, StyleSheet,Button, Alert, Text, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 

const UpdateReto = ({ route, navigation }) => {
  const { reto } = route.params;

  const [nombreReto, setNombreReto] = useState(reto.nombreReto);
  const [descripcion, setDescripcion] = useState(reto.descripcion);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(reto.categoria); 
  const [fechaLimite, setFechaLimite] = useState(new Date(reto.fechaLimite)); 
  const [puntaje, setPuntaje] = useState(reto.puntaje);
  const [usuarioCreador, setUsuarioCreador] = useState(reto.usuarioCreador);
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
      fechaLimite === reto.fechaLimite &&
      puntaje === reto.puntaje
    ) {
      Alert.alert("Sin cambios", "No se realizaron modificaciones al reto.");
      return;
    }

    if (!nombreReto.trim() || !descripcion.trim() || !materialSeleccionado.trim() || !fechaLimite || !puntaje.trim()) {
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

  const showDatepicker = () => {
    setShowDatePicker(true); 
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false); 
    if (selectedDate) {
      setFechaLimite(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Editar Reto</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del Reto"
            value={nombreReto}
            onChangeText={setNombreReto}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Material:</Text>
            <Picker
              selectedValue={materialSeleccionado}
              onValueChange={setMaterialSeleccionado}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un material" value="" />
              {materialesDisponibles.map((material, index) => (
                <Picker.Item key={index} label={material} value={material} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Fecha Límite:</Text>
<TouchableOpacity onPress={showDatepicker} style={styles.fechaInput}>
  <Text style={styles.fechaText}>
    {formatDateLocal(fechaLimite)}
  </Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={fechaLimite || new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={onChangeDate}
    minimumDate={new Date()} // ✅ Solo fechas futuras o actuales
  />
)}

          {showDatePicker && (
  <DateTimePicker
    value={fechaLimite || new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={onChangeDate}
    minimumDate={new Date()} // Permite solo hoy o fechas futuras
  />
)}


          {showDatePicker && (
            <DateTimePicker
              value={fechaLimite || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Puntaje asignado"
            value={puntaje}
            onChangeText={setPuntaje}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <Button title="Guardar Cambios" onPress={actualizarReto} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={() => navigation.goBack()} color="gray" />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingLeft: 8,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  picker: {
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  fechaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  fechaText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default UpdateReto;
