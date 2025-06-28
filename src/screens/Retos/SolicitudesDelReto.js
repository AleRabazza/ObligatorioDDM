import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerSolicitudesDelReto = ({ route }) => {
  const { nombreReto, usuarioCreador } = route.params;
  const [participaciones, setParticipaciones] = useState([]);

  useEffect(() => {
    const cargarParticipaciones = async () => {
      const data = await AsyncStorage.getItem('participaciones');
      if (data) {
        const todas = JSON.parse(data);
        const filtradas = todas.filter(p =>
          p.nombreReto === nombreReto && p.usuarioCreador === usuarioCreador && p.estado === 'Pendiente'
        );
        setParticipaciones(filtradas);
      }
    };

    cargarParticipaciones();
  }, []);

  const actualizarEstado = async (participacion, nuevoEstado) => {
    const data = await AsyncStorage.getItem('participaciones');
    const participacionesArray = data ? JSON.parse(data) : [];

    const index = participacionesArray.findIndex(p =>
      p.nombreReto === participacion.nombreReto &&
      p.usuarioParticipante === participacion.usuarioParticipante
    );

    if (index !== -1) {
      participacionesArray[index].estado = nuevoEstado;
      await AsyncStorage.setItem('participaciones', JSON.stringify(participacionesArray));
      setParticipaciones(prev => prev.filter(p => p !== participacion));

      if (nuevoEstado === 'Aprobado') {
        await sumarPuntos(participacion.usuarioParticipante, participacion.puntaje);
      }

      Alert.alert("Éxito", `Participación ${nuevoEstado.toLowerCase()} correctamente`);
    }
  };

  const sumarPuntos = async (usuario, puntosASumar) => {
    const datos = await AsyncStorage.getItem(`usuario_${usuario}`);
    if (datos) {
      const user = JSON.parse(datos);
      const puntosActuales = parseInt(user.puntos || '0');
      const nuevosPuntos = puntosActuales + parseInt(puntosASumar);

      user.puntos = nuevosPuntos;

      await AsyncStorage.setItem(`usuario_${usuario}`, JSON.stringify(user));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>Usuario: {item.usuarioParticipante}</Text>
      <Text>Comentario: {item.comentario || 'Sin comentario'}</Text>
      {item.ubicacion && (
        <Text>Ubicación: Lat {item.ubicacion.latitud.toFixed(6)} - Lng {item.ubicacion.longitud.toFixed(6)}</Text>
      )}
      <Text>Estado: {item.estado}</Text>

      <View style={styles.botones}>
        <Button
          title="Aceptar"
          onPress={() => actualizarEstado(item, 'Aprobado')}
          color="green"
        />
        <Button
          title="Rechazar"
          onPress={() => actualizarEstado(item, 'Rechazado')}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Solicitudes para: {nombreReto}</Text>
      {participaciones.length === 0 ? (
        <Text style={styles.aviso}>No hay solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={participaciones}
          keyExtractor={(item, index) => `${item.usuarioParticipante}-${index}`}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aviso: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default VerSolicitudesDelReto;
