import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView} from "react-native";
import MyButton from "../../components/MyButton";
const MenuMateriales = ({navigation}) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ScrollView>
          <MyButton title="AgregarMateriales" btnColor="blue" btnIcon="user-plus" customPress={() => navigation.navigate("Opcion1")} />

          <MyButton title="Listar Materiales" btnColor="blue" btnIcon="user-plus"  customPress={() => navigation.navigate("Opcion2")} />
            
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});


export default MenuMateriales;