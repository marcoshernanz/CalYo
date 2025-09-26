import Description from "@/components/ui/Description";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import getColor from "@/lib/utils/getColor";
import { Platform, StyleSheet, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
import { useAnimatedProps } from "react-native-reanimated";

const dailyRecommendations = [
  "Calorías",
  "Carbohidratos",
  "Proteína",
  "Grasas",
  "Micronutrientes",
];

const descriptions = [
  "Calculando calorías...",
  "Calculando carbohidratos...",
  "Calculando proteínas...",
  "Calculando grasas...",
  "Calculando micronutrientes...",
  "Finalizando plan...",
];

export default function OnboardingCreatingPlan() {
  const animatedProps = {
    progress: useAnimatedProps(() => ({
      text: `${49}%`,
    })),
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <AnimateableText
          animatedProps={animatedProps.progress}
          style={styles.progressText}
        />
        <Title size="28" style={styles.title}>
          Estamos creando tu plan personalizado
        </Title>
      </View>

      <View style={styles.bottomContainer}>
        <Description style={styles.description}>{descriptions[0]}</Description>
        <View style={styles.recommendationsContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressIndicator}></View>
          </View>
          <Title size="18" style={styles.recommendationsTitle}>
            Recomendaciones diarias
          </Title>
          {dailyRecommendations.map((item, i) => (
            <View key={i} style={styles.recommendationContainer}>
              <Text size="16">&bull; {item}</Text>
              <View style={styles.recommendationLoading}></View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  topContainer: {
    alignItems: "center",
    width: "100%",
    gap: 16,
  },
  progressText: {
    alignItems: "center",
    fontSize: 48,
    fontWeight: 600,
    fontFamily: "Inter_600SemiBold",
    color: getColor("foreground"),
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
  title: {
    textAlign: "center",
    fontWeight: 600,
  },
  bottomContainer: {
    width: "100%",
    gap: 12,
  },
  description: {
    textAlign: "center",
  },
  recommendationsContainer: {
    width: "100%",
    backgroundColor: getColor("secondary", 0.5),
    padding: 20,
    borderRadius: 16,
    gap: 10,
    overflow: "hidden",
  },
  progressContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: getColor("secondary"),
  },
  progressIndicator: {
    width: "49%",
    height: "100%",
    backgroundColor: getColor("primary"),
  },
  recommendationsTitle: {
    fontWeight: 600,
    paddingBottom: 8,
  },
  recommendationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationLoading: {},
});
