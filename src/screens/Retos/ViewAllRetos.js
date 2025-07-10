import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import colors from '../../styles/colors';
import MyButton from '../../components/MyButton';

const ViewAllRetos = ({ navigation }) => {
  const [retos, setRetos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [todasCategorias, setTodasCategorias] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuarioLogueado = await AsyncStorage.getItem('usuario_logueado');
        setUsuario(usuarioLogueado);

        const dataRetos = await AsyncStorage.getItem('retos');
        const dataParticipaciones = await AsyncStorage.getItem('participaciones');

        const todosRetos = dataRetos ? JSON.parse(dataRetos) : [];
        const participaciones = dataParticipaciones ? JSON.parse(dataParticipaciones) : [];

        const retosParticipados = participaciones
          .filter((p) => p.usuarioParticipante === usuarioLogueado)
          .map((p) => p.nombreReto);

        const retosDisponibles = todosRetos.filter(
          (r) =>
            !retosParticipados.includes(r.nombreReto) &&
            r.usuarioCreador !== usuarioLogueado
        );

        setRetos(retosDisponibles);

        const categoriasUnicas = [...new Set(retosDisponibles.map((r) => r.categoria || 'Sin categoría'))];
        setTodasCategorias(categoriasUnicas);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudieron cargar los retos');
      }
    };

    const unsubscribe = navigation.addListener('focus', cargarDatos);
    return unsubscribe;
  }, [navigation]);

  const retosFiltrados = retos.filter((r) => {
    const nombreReto = r.nombreReto || '';
    const categoria = r.categoria || 'Sin categoría';
    const coincideBusqueda = nombreReto.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada
      ? categoria === categoriaSeleccionada
      : true;
    return coincideBusqueda && coincideCategoria;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombreReto}</Text>
      <Text style={styles.text}> Creador: {item.usuarioCreador}</Text>
      <Text style={styles.text}> Descripción: {item.descripcion || 'Sin descripción'}</Text>
      <Text style={styles.text}> Categoría: {item.categoria || 'Sin categoría'}</Text>

      <TouchableOpacity
        style={styles.btnParticipar}
        onPress={() => navigation.navigate('RegisterParticipacion', { reto: item })}
      >
        <Text style={styles.btnText}>Participar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🌱 Retos Disponibles</Text>

      <TextInput
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaSeleccionada}
          onValueChange={(value) => setCategoriaSeleccionada(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas las categorías" value="" />
          {todasCategorias.map((cat, index) => (
            <Picker.Item label={cat} value={cat} key={index} />
          ))}
        </Picker>
      </View>

      <MyButton
        title="Volver al menú de Retos"
        onPress={() => navigation.navigate('MenuRetos')}
      />

      {retosFiltrados.length === 0 ? (
        <Text style={styles.aviso}>No hay retos disponibles con los filtros seleccionados.</Text>
      ) : (
        <FlatList
          data={retosFiltrados}
          keyExtractor={(item, index) => `${item.nombreReto}-${index}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.fondo,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2D6A4F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 45,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 120,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  btnParticipar: {
    marginTop: 10,
    backgroundColor: '#52B788',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aviso: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default ViewAllRetos;
