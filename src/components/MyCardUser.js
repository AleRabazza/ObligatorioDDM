import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../styles/colors';

const MyCardUser = ({ userName, email, age, neighborhood, imageUri }) => (
  <View style={styles.card}>
    <Image source={{ uri: imageUri }} style={styles.image} />
    <Text style={styles.title}>Usuario: {userName}</Text>
    <Text>Correo: {email}</Text>
    <Text>Edad: {age}</Text>
    <Text>Barrio: {neighborhood}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.blanco,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color: colors.verdeOscuro,
  },
});

export default MyCardUser;
