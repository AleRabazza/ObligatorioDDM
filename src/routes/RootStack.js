// RootStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import MenuGlobal from "../screens/Menu/MenuGlobal";
import MenuRetos from "../screens/Menu/MenuRetos";
import MenuMateriales from "../screens/Menu/MenuMateriales";
import MenuUsuario from "../screens/Menu/MenuUsuario";
import MenuInicio from "../screens/Menu/MenuInicio"; 
import RegisterUser from "../screens/Usuarios/RegisterUser";
import LoginUser from "../screens/Usuarios/LoginUser";
import ProfileUser from "../screens/Usuarios/ProfileUser";
import ViewAllUser from "../screens/Usuarios/ViewAllUser";
import UpdateUser from "../screens/Usuarios/UpdateUser";
import RegisterMateriales from "../screens/Materiales/RegisterMateriales";
import ViewAllMateriales from "../screens/Materiales/ViewAllMateriales";
import UpdateMateriales from "../screens/Materiales/UpdateMateriales";
import RegisterRetos from "../screens/Retos/RegisterRetos";
import ViewAllRetos from "../screens/Retos/ViewAllRetos";
import UpdateReto from "../screens/Retos/UpdateReto";
import ViewRetos from "../screens/Retos/ViewRetos";
import SolicitudesDelReto from "../screens/Retos/SolicitudesDelReto";
import RegisterParticipacion from "../screens/Participaciones/RegisterParticipacion";
import MisSolicitudes from "../screens/Retos/MisSolicitudes";
import UpdateParticipaciones from "../screens/Participaciones/UpdateParticipaciones";
import EstadisticasUsuario from "../screens/Estadisticas/EstadisticasUsuario";

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MenuInicio">
        {/* Rutas del menú global */}
        <Stack.Screen name="MenuGlobal" component={MenuGlobal} options={{ title: "Menú Global" }} />
        <Stack.Screen name="MenuRetos" component={MenuRetos} options={{ title: "Menú Retos" }} />
        <Stack.Screen name="MenuMateriales" component={MenuMateriales} options={{ title: "Menú Materiales" }} />
        <Stack.Screen name="MenuUsuario" component={MenuUsuario} options={{ title: "Menú Usuario" }} />

        {/* Rutas del menú de usuario */}
       <Stack.Screen name="MenuInicio" component={MenuInicio} options={{ title: "Inicio" }} />
        <Stack.Screen name="RegisterUser" component={RegisterUser} options={{ title: "Registrar Usuario" }} />
        <Stack.Screen name="LoginUser" component={LoginUser} options={{ title: "Iniciar Sesión" }} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} options={{ title: "Perfil de Usuario" }} />
        <Stack.Screen name="ViewAllUser" component={ViewAllUser} options={{ title: "Ver Todos los Usuarios" }} />
        <Stack.Screen name="UpdateUser" component={UpdateUser} options={{ title: "Actualizar Usuario" }} />

        {/* Rutas del menú de materiales */}
        <Stack.Screen name="RegisterMateriales" component={RegisterMateriales} options={{ title: "Registrar Materiales" }} />
        <Stack.Screen name="ViewAllMateriales" component={ViewAllMateriales} options={{ title: "Ver Todos los Materiales" }} />
        <Stack.Screen name="UpdateMateriales" component={UpdateMateriales} options={{ title: "Actualizar Materiales" }} />

        {/* Rutas del menú de Reto */}
        <Stack.Screen name = "RegisterRetos" component={RegisterRetos} options={{ title: "Registrar Retos" }} />
        <Stack.Screen name = "ViewAllRetos" component={ViewAllRetos} options={{ title: "Ver Todos los Retos" }} />
        <Stack.Screen name = "UpdateReto" component={UpdateReto} options={{ title: "Actualizar Retos" }} />
        <Stack.Screen name = "ViewRetos" component={ViewRetos} options={{ title: "Mis Retos" }} />
        <Stack.Screen name = "SolicitudesDelReto" component={SolicitudesDelReto} options={{ title: "Solicitudes del Reto" }} />
        <Stack.Screen name = "MisSolicitudes" component={MisSolicitudes} options={{ title: "Mis Solicitudes" }} />

        {/* Otras pantallas */}
        <Stack.Screen name="RegisterParticipacion" component={RegisterParticipacion} options={{ title: "Registrar Participación" }} />
        <Stack.Screen name="UpdateParticipaciones" component={UpdateParticipaciones} options={{ title: "Actualizar Participaciones" }} />

        <Stack.Screen name="EstadisticasUsuario" component={EstadisticasUsuario} options={{ title: "Estadísticas de Usuarios" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
