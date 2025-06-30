import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Alert, ScrollView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const UpdateParticipaciones = ({ route, navigation }) => {
  const { participacion } = route.params;

  const [comentario, setComentario] = useState(participacion.comentario || '');
  const [profilePicture, setProfilePicture] = useState(participacion.imagen || '');
  const [ubicacion, setUbicacion] = useState(participacion.ubicacion || null);

  const requestPerms = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !gal.granted) {
      Alert.alert('Permisos requeridos', 'Habilitá el acceso a la cámara y galería.');
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setProfilePicture(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (!(await requestPerms())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setProfilePicture(result.assets[0].uri);
  };

  const obtenerUbicacion = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setUbicacion({
      latitud: location.coords.latitude,
      longitud: location.coords.longitude,
    });
  };

  const actualizarParticipacion = async () => {
    if (!profilePicture || !ubicacion) {
      Alert.alert('Debe subir una imagen y obtener su ubicación');
      return;
    }

    try {
      const data = await AsyncStorage.getItem('participaciones');
      let participaciones = data ? JSON.parse(data) : [];

      participaciones = participaciones.map((p) => {
        if (
          p.usuarioParticipante === participacion.usuarioParticipante &&
          p.nombreReto === participacion.nombreReto &&
          p.estado === 'Pendiente'
        ) {
          return {
            ...p,
            comentario,
            imagen: profilePicture,
            ubicacion,
          };
        }
        return p;
      });

      await AsyncStorage.setItem('participaciones', JSON.stringify(participaciones));

      Alert.alert('Éxito', 'Participación actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar la participación');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar participación en: {participacion.nombreReto}</Text>
      <Text style={styles.subtitulo}>Creador: {participacion.usuarioCreador}</Text>

      <View style={styles.seccion}>
        <Button title="Seleccionar imagen de galería" onPress={pickFromGallery} />
        <Button title="Tomar foto" onPress={takePhoto} />
        {profilePicture ? <Image source={{ uri: profilePicture }} style={styles.imagen} /> : null}
      </View>

      <View style={styles.seccion}>
        <Button title="Obtener ubicación actual" onPress={obtenerUbicacion} />
        {ubicacion && (
          <Text style={styles.texto}>
            Lat: {ubicacion.latitud.toFixed(6)} - Lng: {ubicacion.longitud.toFixed(6)}
          </Text>
        )}
      </View>

      <TextInput
        placeholder="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
        style={styles.input}
      />

      <Button title="Guardar cambios" onPress={actualizarParticipacion} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitulo: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  seccion: {
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  imagen: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  texto: {
    marginTop: 8,
  },
});

export default UpdateParticipaciones;

