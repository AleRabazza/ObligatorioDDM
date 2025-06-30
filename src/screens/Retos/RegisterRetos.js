import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterRetos = ({ navigation }) => {
  const [nombreReto, setNombreReto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [puntaje, setPuntaje] = useState('');
  const [usuarioCreador, setUsuarioCreador] = useState(null);
  const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await AsyncStorage.getItem('usuario_logueado');
      if (user) {
        setUsuarioCreador(user);
      } else {
        Alert.alert('Error', 'No hay un usuario logueado');
        navigation.navigate('LoginUser');
        return;
      }

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

      const unicos = [...new Set(nombres)];
      setMaterialesDisponibles(unicos);
    };

    fetchData();
  }, []);

  const clearForm = () => {
    setNombreReto('');
    setDescripcion('');
    setCategoria('');
    setFechaLimite(new Date());
    setPuntaje('');
  };

  const formatDateLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const registrarReto = async () => {
    // Verificar si no hay materiales disponibles
    if (materialesDisponibles.length === 0) {
      Alert.alert('Error', 'No hay materiales disponibles. Crea un material antes de crear un reto.');
      return;
    }

    if (!nombreReto.trim() || !descripcion.trim() || !categoria.trim() || !puntaje.trim()) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const retosGuardados = await AsyncStorage.getItem('retos');
      const retosArray = retosGuardados ? JSON.parse(retosGuardados) : [];

      const nombreYaExiste = retosArray.some(r =>
        r.nombreReto.toLowerCase() === nombreReto.trim().toLowerCase()
      );
      if (nombreYaExiste) {
        Alert.alert('Error', 'Ya existe un reto con ese nombre');
        return;
      }

      const nuevoReto = {
        nombreReto,
        descripcion,
        categoria,
        fechaLimite: formatDateLocal(fechaLimite),
        puntaje,
        usuarioCreador,
      };

      retosArray.push(nuevoReto);
      await AsyncStorage.setItem('retos', JSON.stringify(retosArray));

      clearForm();
      Alert.alert("Éxito", "Reto registrado correctamente", [
        { text: "OK", onPress: () => navigation.navigate("MenuRetos") }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error al guardar el reto');
    }
  };

  const showDatepicker = () => setShowDatePicker(true);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaLimite;
    setShowDatePicker(false);
    setFechaLimite(currentDate);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput style={styles.input} placeholder="Nombre del Reto" value={nombreReto} onChangeText={setNombreReto} />
          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Material (Categoría):</Text>
            <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.picker}>
              <Picker.Item label="Seleccione un material" value="" />
              {materialesDisponibles.map((nombre, index) => (
                <Picker.Item key={index} label={nombre} value={nombre} />
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
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Puntaje asignado:</Text>
            <Picker
              selectedValue={puntaje}
              onValueChange={setPuntaje}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un puntaje" value="" />
              <Picker.Item label="20 puntos" value="20" />
              <Picker.Item label="45 puntos" value="45" />
              <Picker.Item label="75 puntos" value="75" />
            </Picker>
          </View>

          <View style={{ marginTop: 20 }}>
            <Button title="Registrar Reto" onPress={registrarReto} />
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
});

export default RegisterRetos;
