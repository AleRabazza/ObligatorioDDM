import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MisSolicitudes = ({ navigation }) => {
  const [todasSolicitudes, setTodasSolicitudes] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState(''); 

  useEffect(() => {
    const cargarSolicitudes = async () => {
      const usuario = await AsyncStorage.getItem('usuario_logueado');
      setUsuarioLogueado(usuario);

      const data = await AsyncStorage.getItem('participaciones');
      if (data) {
        const todas = JSON.parse(data);
        const propias = todas.filter((s) => s.usuarioParticipante === usuario);
        setTodasSolicitudes(propias);
      }
    };

    cargarSolicitudes();
  }, []);

  const solicitudesMostradas = todasSolicitudes.filter((s) =>
    estadoFiltro ? s.estado === estadoFiltro : true
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>Reto: {item.nombreReto}</Text>
      <Text>Comentario: {item.comentario || 'Sin comentario'}</Text>
      <Text>Estado: {item.estado}</Text>
      <Text>
        Ubicación:{' '}
        {item.ubicacion
          ? `Lat: ${item.ubicacion.latitud.toFixed(6)} - Lng: ${item.ubicacion.longitud.toFixed(6)}`
          : 'No disponible'}
      </Text>

      {item.estado === 'Pendiente' && (
        <Button
          title="Editar"
          onPress={() =>
            navigation.navigate('UpdateParticipacion', { participacion: item })
          }
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Solicitudes</Text>

      <View style={styles.filtros}>
        <Button title="Ver todas" onPress={() => setEstadoFiltro('')} />
        <Button title="Pendientes" onPress={() => setEstadoFiltro('Pendiente')} />
        <Button title="Aceptadas" onPress={() => setEstadoFiltro('Aprobado')} />
        <Button title="Rechazadas" onPress={() => setEstadoFiltro('Rechazado')} />
      </View>

      {solicitudesMostradas.length === 0 ? (
        <Text style={styles.aviso}>No tienes solicitudes en este estado.</Text>
      ) : (
        <FlatList
          data={solicitudesMostradas}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
  aviso: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default MisSolicitudes;
