import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewAllRetos = ({ navigation }) => {
  const [retos, setRetos] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState('');

  useEffect(() => {
    const cargarRetos = async () => {
      const user = await AsyncStorage.getItem('usuario_logueado');
      setUsuarioLogueado(user);

      const data = await AsyncStorage.getItem('retos');
      if (data) {
        const todosLosRetos = JSON.parse(data);
        const otrosRetos = todosLosRetos.filter(
          reto => reto.usuarioCreador !== user
        );
        setRetos(otrosRetos);
      }
    };

    cargarRetos();
  }, []);

  const participarEnReto = (reto) => {
    Alert.alert(
      "Participación",
      `Solicitaste participar en el reto: "${reto.nombreReto}"`
    );
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
        title="Participar" onPress={() => navigation.navigate("RegisterParticipacion", { reto: item })}/>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Retos de Otros Usuarios</Text>
      {retos.length === 0 ? (
        <Text style={styles.aviso}>No hay retos disponibles de otros usuarios.</Text>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
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
