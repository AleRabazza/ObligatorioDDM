import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import ClassicButton from '../../components/ClassicButton';
import colors from '../../styles/colors';

const ViewRetos = ({ navigation }) => {
  const [misRetos, setMisRetos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const cargarMisRetos = async () => {
      const user = await AsyncStorage.getItem('usuario_logueado');
      setUsuario(user);

      const data = await AsyncStorage.getItem('retos');
      if (data) {
        const retosArray = JSON.parse(data);
        const filtrados = retosArray.filter(r => r.usuarioCreador === user);
        setMisRetos(filtrados);
      }
    };

    cargarMisRetos();
  }, [isFocused]);

  const eliminarReto = async (nombreReto) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro que deseas eliminar este reto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar", style: "destructive", onPress: async () => {
            const data = await AsyncStorage.getItem('retos');
            const retosArray = data ? JSON.parse(data) : [];

            const nuevosRetos = retosArray.filter(
              r => !(r.usuarioCreador === usuario && r.nombreReto === nombreReto)
            );

            await AsyncStorage.setItem('retos', JSON.stringify(nuevosRetos));
            setMisRetos(nuevosRetos);
            Alert.alert("Reto eliminado");
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.nombreReto}</Text>
      <Text style={styles.texto}>Descripción: {item.descripcion}</Text>
      <Text style={styles.texto}>Categoría: {item.categoria}</Text>
      <Text style={styles.texto}>Fecha límite: {item.fechaLimite}</Text>
      <Text style={styles.texto}>Puntaje: {item.puntaje}</Text>

      <View style={styles.botones}>
        <ClassicButton
          title="Editar"
          onPress={() => navigation.navigate("UpdateReto", { reto: item })}
          color={colors.botonPrimario}
        />
        <ClassicButton
          title="Eliminar"
          onPress={() => eliminarReto(item.nombreReto)}
          color="red"
        />
      </View>

      <ClassicButton
        title="Ver Solicitudes"
        onPress={() => navigation.navigate("SolicitudesDelReto", {
          nombreReto: item.nombreReto,
          usuarioCreador: item.usuarioCreador,
        })}
        color={colors.botonSecundario}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 Mis Retos</Text>
      {misRetos.length === 0 ? (
        <Text style={styles.texto}>No has creado ningún reto todavía.</Text>
      ) : (
        <FlatList
          data={misRetos}
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
    marginBottom: 12,
    textAlign: 'center',
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
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.botonPrimario,
    marginBottom: 8,
  },
  texto: {
    fontSize: 14,
    color: colors.texto,
    marginBottom: 4,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default ViewRetos;
