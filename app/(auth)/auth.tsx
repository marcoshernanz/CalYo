import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { StyleSheet, View } from "react-native";

export default function AuthScreen() {
  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>
        Contar calorías de forma sencilla
      </Title>
      <View style={styles.mainContainer}>
        <View style={styles.image}></View>
      </View>
      <View style={styles.footerContainer}>
        <Button size="lg">Comenzar</Button>
        <View style={styles.footerText}>
          <Text style={{ textAlign: "center" }}>¿Ya tienes cuenta?</Text>
          <Button variant="text">Iniciar Sesión</Button>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  image: {
    flex: 1,
    backgroundColor: "#f00",
    borderRadius: 20,
  },
  footerContainer: {
    gap: 10,
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
});
