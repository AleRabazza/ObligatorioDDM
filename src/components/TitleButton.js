import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TitleButton = (props) => {
  const handleBackPress = () => {
    if (props.redirectTo) {
      
      // Si estás usando React Navigation (para aplicaciones móviles)
      // props.navigation.navigate(props.redirectTo);  // Esto depende de cómo configures las rutas
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleBackPress} // Redirige a la página especificada
      >
        <View style={styles.buttonContent}>
          <Icon name="arrow-left" size={24} color="black" />
          <Text style={styles.text}>volver</Text> 
        </View>
      </TouchableOpacity>
      <Text style={styles.pageText}>{props.title}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pageText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

export default TitleButton;
