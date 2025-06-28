import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const ViewAllRetos = ({ navigation }) => {
  const [retos, setRetos] = useState([]);
  const [retosFiltrados, setRetosFiltrados] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarRetos = async () => {
      const user = await AsyncStorage.getItem('usuario_logueado');
      setUsuarioLogueado(user);

      const data = await AsyncStorage.getItem('retos');
      if (data) {
        const todosLosRetos = JSON.parse(data);
        const otrosRetos = todosLosRetos.filter(reto => reto.usuarioCreador !== user);
        setRetos(otrosRetos);
        setRetosFiltrados(otrosRetos);

        const categoriasUnicas = [...new Set(otrosRetos.map(r => r.categoria))];
        setCategorias(categoriasUnicas);
      }
    };

    cargarRetos();
  }, []);

  useEffect(() => {
    filtrarRetos();
  }, [busqueda, categoriaSeleccionada]);

  const filtrarRetos = () => {
    let nuevos = [...retos];

    if (busqueda.trim() !== '') {
      nuevos = nuevos.filter(r =>
        r.nombreReto.toLowerCase().includes(busqueda.trim().toLowerCase())
      );
    }

    if (categoriaSeleccionada !== '') {
      nuevos = nuevos.filter(r => r.categoria === categoriaSeleccionada);
    }

    setRetosFiltrados(nuevos);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.nombreReto}</Text>
      <Text>Categoría: {item.categoria}</Text>
      <Text>Fecha límite: {item.fechaLimite}</Text>
      <Text>Puntaje: {item.puntaje}</Text>
      <Text>Creado por: {item.usuarioCreador}</Text>
      <View style={styles.boton}>
        <Button
          title="Participar"
          onPress={() => navigation.navigate("RegisterParticipacion", { reto: item })}
        />
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Retos de Otros Usuarios</Text>

        <TextInput
          placeholder="Buscar por nombre del reto..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.input}
        />

        <Picker
          selectedValue={categoriaSeleccionada}
          onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las categorías" value="" />
          {categorias.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>

        {retosFiltrados.length === 0 ? (
          <Text style={styles.aviso}>No hay retos que coincidan con los filtros.</Text>
        ) : (
          <FlatList
            data={retosFiltrados}
            keyExtractor={(item, index) => `${item.nombreReto}-${index}`}
            renderItem={renderItem}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  aviso: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  boton: {
    marginTop: 8,
  },
});

export default ViewAllRetos;
