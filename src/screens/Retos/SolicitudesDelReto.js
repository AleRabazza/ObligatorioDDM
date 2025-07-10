import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassicButton from '../../components/ClassicButton';
import colors from '../../styles/colors';

const VerSolicitudesDelReto = ({ route }) => {
  const { nombreReto, usuarioCreador } = route.params;
  const [participaciones, setParticipaciones] = useState([]);

  useEffect(() => {
    const cargarParticipaciones = async () => {
      const data = await AsyncStorage.getItem('participaciones');
      if (data) {
        const todas = JSON.parse(data);
        const filtradas = todas.filter(p =>
          p.nombreReto === nombreReto &&
          p.usuarioCreador === usuarioCreador &&
          p.estado === 'Pendiente'
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
        const retosData = await AsyncStorage.getItem('retos');
        const retosArray = retosData ? JSON.parse(retosData) : [];
        const retoAsociado = retosArray.find(r => r.nombreReto === participacion.nombreReto);

        if (retoAsociado && retoAsociado.puntaje) {
          const puntos = parseInt(retoAsociado.puntaje);
          await sumarPuntos(participacion.usuarioParticipante, puntos);
        }
      }

      Alert.alert("Éxito", `Participación ${nuevoEstado.toLowerCase()} correctamente`);
    }
  };

  const sumarPuntos = async (usuario, puntosASumar) => {
    try {
      const datos = await AsyncStorage.getItem(usuario);
      if (datos) {
        const user = JSON.parse(datos);
        const puntosActuales = parseInt(user.puntos || '0');
        user.puntos = puntosActuales + puntosASumar;
        await AsyncStorage.setItem(usuario, JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error al sumar puntos:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>👤 Usuario: {item.usuarioParticipante}</Text>
      <Text style={styles.texto}>📝 Comentario: {item.comentario || 'Sin comentario'}</Text>
      {item.ubicacion && (
        <Text style={styles.texto}>📍 Lat: {item.ubicacion.latitud.toFixed(6)} | Lng: {item.ubicacion.longitud.toFixed(6)}</Text>
      )}
      <Text style={styles.texto}>📌 Estado: {item.estado}</Text>

      <View style={styles.botones}>
        <ClassicButton
          title="Aceptar"
          onPress={() => actualizarEstado(item, 'Aprobado')}
          color={colors.botonPrimario}
        />
        <ClassicButton
          title="Rechazar"
          onPress={() => actualizarEstado(item, 'Rechazado')}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Solicitudes para: {nombreReto}</Text>
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
    backgroundColor: colors.fondo,
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.texto,
    textAlign: 'center',
  },
  aviso: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.gris,
  },
  card: {
    backgroundColor: colors.crema || '#F5F0E1',
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
    marginBottom: 8,
    color: colors.texto,
  },
  texto: {
    fontSize: 14,
    color: colors.texto,
    marginBottom: 4,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default VerSolicitudesDelReto;
