import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Alert, ScrollView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const RegisterParticipacion = ({ route, navigation }) => {
  const { reto } = route.params;
  const [usuarioParticipante, setUsuarioParticipante] = useState('');
  const [comentario, setComentario] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      const usuario = await AsyncStorage.getItem('usuario_logueado');
      if (usuario) {
        setUsuarioParticipante(usuario);
      } else {
        Alert.alert('Error', 'Usuario no logueado');
        navigation.navigate('LoginUser');
      }
    };

    const solicitarPermisoUbicacion = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Habilitá los permisos de ubicación.');
      }
    };

    obtenerUsuario();
    solicitarPermisoUbicacion();
  }, []);

  const requestPerms = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cam.granted || !gal.granted) {
      Alert.alert('Permisos requeridos', 'Habilita acceso a la cámara y la galería.');
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

  const guardarParticipacion = async () => {
    if (!profilePicture || !ubicacion) {
      Alert.alert('Debe subir una imagen y obtener su ubicación');
      return;
    }

    const nuevaParticipacion = {
      nombreReto: reto.nombreReto,
      usuarioCreador: reto.usuarioCreador,
      usuarioParticipante,
      imagen: profilePicture,
      ubicacion,
      comentario,
      estado: 'Pendiente',
    };

    try {
      const data = await AsyncStorage.getItem('participaciones');
      const participaciones = data ? JSON.parse(data) : [];
      participaciones.push(nuevaParticipacion);

      await AsyncStorage.setItem('participaciones', JSON.stringify(participaciones));

      Alert.alert('Éxito', 'Participación registrada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('ViewAllRetos') }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error al guardar la participación');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Participar en: {reto.nombreReto}</Text>
      <Text style={styles.subtitulo}>Creador: {reto.usuarioCreador}</Text>

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

      <Button title="Enviar participación" onPress={guardarParticipacion} />
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

export default RegisterParticipacion;
