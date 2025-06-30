import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewAllRetos = ({ navigation }) => {
  const [retos, setRetos] = useState([]);
  const [usuario, setUsuario] = useState('');

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
          (r) => !retosParticipados.includes(r.nombreReto)
        );

        setRetos(retosDisponibles);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudieron cargar los retos');
      }
    };

    const unsubscribe = navigation.addListener('focus', cargarDatos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombreReto}</Text>
      <Text>Creador: {item.usuarioCreador}</Text>
      <Text>Descripción: {item.descripcion || 'Sin descripción'}</Text>

      <Button
        title="Participar"
        onPress={() =>
          navigation.navigate('RegisterParticipacion', { reto: item })
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Retos Disponibles</Text>

      {retos.length === 0 ? (
        <Text style={styles.aviso}>No hay retos disponibles en este momento.</Text>
      ) : (
        <FlatList
          data={retos}
          keyExtractor={(item, index) => `${item.nombreReto}-${index}`}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  aviso: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default ViewAllRetos;
