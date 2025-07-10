import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  Alert, ScrollView, Image, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import colors from '../../styles/colors';
import MyButton from '../../components/MyButton';

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
      <Text style={styles.titulo}> Editar participación en: {participacion.nombreReto}</Text>
      <Text style={styles.subtitulo}>Creador: {participacion.usuarioCreador}</Text>

      <View style={styles.seccion}>
        <TouchableOpacity style={styles.btn} onPress={pickFromGallery}>
          <Text style={styles.btnText}>Seleccionar imagen de galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={takePhoto}>
          <Text style={styles.btnText}>Tomar foto</Text>
        </TouchableOpacity>
        {profilePicture && <Image source={{ uri: profilePicture }} style={styles.imagen} />}
      </View>

      <View style={styles.seccion}>
        <TouchableOpacity style={styles.btnUbicacion} onPress={obtenerUbicacion}>
          <Text style={styles.btnText}>Obtener ubicación actual</Text>
        </TouchableOpacity>
        {ubicacion && (
          <Text style={styles.ubicacion}>
            📍 Lat: {ubicacion.latitud.toFixed(6)} - Lng: {ubicacion.longitud.toFixed(6)}
          </Text>
        )}
      </View>

      <TextInput
        placeholder="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
        style={styles.input}
        placeholderTextColor="#6c757d"
      />

      <MyButton title="Guardar cambios" onPress={actualizarParticipacion} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.fondo,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: colors.texto,
    marginBottom: 20,
    textAlign: 'center',
  },
  seccion: {
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#74C69D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  btnUbicacion: {
    backgroundColor: '#52B788',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  ubicacion: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default UpdateParticipaciones;
