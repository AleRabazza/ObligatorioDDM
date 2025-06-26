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


        {/* Rutas del menú de Reto */}


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
