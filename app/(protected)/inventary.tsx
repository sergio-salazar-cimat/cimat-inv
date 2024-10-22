import { View, Text, StyleSheet } from "react-native";

export default function Inventary() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
});