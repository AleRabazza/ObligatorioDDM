import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassicButton from '../../components/ClassicButton';
import colors from '../../styles/colors';

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

    const unsubscribe = navigation.addListener('focus', cargarSolicitudes);
    return unsubscribe;
  }, [navigation]);

  const cancelarParticipacion = async (participacionACancelar) => {
    Alert.alert(
      'Confirmar cancelación',
      '¿Estás seguro de que querés cancelar esta participación?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          onPress: async () => {
            try {
              const data = await AsyncStorage.getItem('participaciones');
              let participaciones = data ? JSON.parse(data) : [];

              participaciones = participaciones.filter(
                (p) =>
                  !(
                    p.usuarioParticipante === participacionACancelar.usuarioParticipante &&
                    p.nombreReto === participacionACancelar.nombreReto &&
                    p.estado === 'Pendiente'
                  )
              );

              await AsyncStorage.setItem('participaciones', JSON.stringify(participaciones));
              setTodasSolicitudes(participaciones);

              Alert.alert('Cancelada', 'La participación fue cancelada.');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'No se pudo cancelar la participación.');
            }
          },
        },
      ]
    );
  };

  const solicitudesMostradas = todasSolicitudes.filter((s) =>
    estadoFiltro ? s.estado === estadoFiltro : true
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagen && (
        <Image
          source={{ uri: item.imagen }}
          style={styles.imagen}
          resizeMode="cover"
        />
      )}
      <Text style={styles.nombre}> Reto: {item.nombreReto}</Text>
      <Text style={styles.texto}> Comentario: {item.comentario || 'Sin comentario'}</Text>
      <Text style={styles.texto}> Estado: {item.estado}</Text>
      <Text style={styles.texto}>
         Ubicación:{' '}
        {item.ubicacion
          ? `Lat: ${item.ubicacion.latitud.toFixed(6)} - Lng: ${item.ubicacion.longitud.toFixed(6)}`
          : 'No disponible'}
      </Text>

      {item.estado === 'Pendiente' && (
        <View style={styles.botones}>
          <ClassicButton
            title="Editar"
            onPress={() =>
              navigation.navigate('UpdateParticipaciones', { participacion: item })
            }
            color={colors.botonPrimario}
          />
          <ClassicButton
            title="Cancelar participación"
            onPress={() => cancelarParticipacion(item)}
            color="red"
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Mis Solicitudes</Text>

      <View style={styles.filtros}>
        <ClassicButton title="Ver todas" onPress={() => setEstadoFiltro('')} />
        <ClassicButton title="Pendientes" onPress={() => setEstadoFiltro('Pendiente')} />
        <ClassicButton title="Aceptadas" onPress={() => setEstadoFiltro('Aprobado')} />
        <ClassicButton title="Rechazadas" onPress={() => setEstadoFiltro('Rechazado')} />
      </View>

      {solicitudesMostradas.length === 0 ? (
        <Text style={styles.aviso}>No tienes solicitudes</Text>
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
    backgroundColor: colors.fondo,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.texto,
    marginBottom: 16,
    textAlign: 'center',
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.crema,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: colors.texto,
  },
  texto: {
    fontSize: 14,
    marginBottom: 4,
    color: colors.texto,
  },
  aviso: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.gris,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
  },
  botones: {
    marginTop: 12,
    gap: 8,
  },
});

export default MisSolicitudes;
