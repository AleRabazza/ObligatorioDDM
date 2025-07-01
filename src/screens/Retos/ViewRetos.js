import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

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
      <Text>Descripción: {item.descripcion}</Text>
      <Text>Categoría: {item.categoria}</Text>
      <Text>Fecha límite: {item.fechaLimite}</Text>
      <Text>Puntaje: {item.puntaje}</Text>

      <View style={styles.botones}>
        <Button title="Editar" onPress={() => navigation.navigate("UpdateReto", { reto: item })} />
        <Button title="Eliminar" color="red" onPress={() => eliminarReto(item.nombreReto)} />
      </View>

      <View style={styles.verSolicitudesBtn}>
        <Button
          title="Ver Solicitudes"
          onPress={() => navigation.navigate("SolicitudesDelReto", {
            nombreReto: item.nombreReto,
            usuarioCreador: item.usuarioCreador,
          })}
          color="#007bff"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Retos</Text>
      {misRetos.length === 0 ? (
        <Text>No has creado ningún reto todavía.</Text>
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
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
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
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  verSolicitudesBtn: {
    marginTop: 10,
  },
});

export default ViewRetos;
