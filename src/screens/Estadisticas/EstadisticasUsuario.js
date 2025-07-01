import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EstadisticasUsuario = () => {
  const [topParticipacion, setTopParticipacion] = useState([]);
  const [topPuntos, setTopPuntos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const userKeys = keys.filter(key => key !== "usuario_logueado" && !key.startsWith("material_"));
        const datos = await AsyncStorage.multiGet(userKeys);

        const usuarios = datos.map(([key, value]) => {
          try {
            const user = JSON.parse(value);
            return {
              userName: user.userName,
              puntos: parseInt(user.puntos) || 0
            };
          } catch {
            return null;
          }
        }).filter(u => u && u.userName);

        const retosRaw = await AsyncStorage.getItem("retos");
        const retos = retosRaw ? JSON.parse(retosRaw) : [];

        const participacionMap = {};
        retos.forEach(reto => {
          if (reto.usuarioCreador) {
            participacionMap[reto.usuarioCreador] = (participacionMap[reto.usuarioCreador] || 0) + 1;
          }
        });

        const usuariosConParticipacion = usuarios.map(u => ({
          ...u,
          participacion: participacionMap[u.userName] || 0
        }));

        const topPorParticipacion = [...usuariosConParticipacion]
          .filter(u => u.participacion > 0)
          .sort((a, b) => b.participacion - a.participacion)
          .slice(0, 3);

        const topPorPuntos = [...usuariosConParticipacion]
          .filter(u => u.puntos > 0)
          .sort((a, b) => b.puntos - a.puntos)
          .slice(0, 3);

        setTopParticipacion(topPorParticipacion);
        setTopPuntos(topPorPuntos);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏆 Top 3 en creación de retos</Text>
      {topParticipacion.length > 0 ? (
        topParticipacion.map((u, index) => (
          <Text key={u.userName} style={styles.item}>
            {index + 1}. {u.userName} - {u.participacion} retos
          </Text>
        ))
      ) : (
        <Text style={styles.noData}>De momento no hay usuarios con participación en retos.</Text>
      )}

      <Text style={[styles.title, { marginTop: 30 }]}>⭐ Top 3 por Puntos</Text>
      {topPuntos.length > 0 ? (
        topPuntos.map((u, index) => (
          <Text key={u.userName} style={styles.item}>
            {index + 1}. {u.userName} - {u.puntos} puntos
          </Text>
        ))
      ) : (
        <Text style={styles.noData}>De momento no hay usuarios con puntos registrados.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
  },
  noData: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#777",
    marginBottom: 10,
  },
});

export default EstadisticasUsuario;
