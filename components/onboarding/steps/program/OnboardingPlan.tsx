import Description from "@/components/ui/Description";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";
import { StyleSheet, View } from "react-native";

export default function OnboardingPlan() {
  return (
    <View style={styles.container}>
      <Title>¡Enhorabuena! Tu plan personalizado está listo</Title>
      <View style={styles.mainContainer}>
        <View style={styles.recommendationsContainer}>
          <View style={styles.header}>
            <Title size="18">Recomendaciones Diarias</Title>
            <Description size="14">
              Puedes cambiarlas cuando quieras
            </Description>
          </View>
          <View>
            <View></View>
            <View></View>
            <View></View>
            <View></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendationsContainer: {
    backgroundColor: getColor("secondary", 0.5),
    width: "100%",
    padding: 20,
    borderRadius: 16,
  },
  header: {
    gap: 4,
  },
});
