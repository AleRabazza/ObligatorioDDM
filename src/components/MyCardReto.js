import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClassicButton from './ClassicButton';
import colors from '../styles/colors';

const MyCardReto = ({ titulo, creador, descripcion, onPress }) => (
  <View style={styles.card}>
    <Text style={styles.titulo}>{titulo}</Text>
    <Text style={styles.texto}>Creador: {creador}</Text>
    <Text style={styles.texto}>Descripción: {descripcion}</Text>
    
    <ClassicButton
      title="Participar"
      onPress={onPress}
      color={colors.botonSecundario}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.crema || '#F5F0E1',
    borderRadius: 15,
    padding: 16,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: colors.botonPrimario,
  },
  texto: {
    fontSize: 14,
    color: colors.texto,
    marginBottom: 6,
  },
});

export default MyCardReto;
