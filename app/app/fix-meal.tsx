import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "@/components/ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderTitle,
} from "@/components/ui/screen/ScreenHeader";
import {
  ScreenFooter,
  ScreenFooterButton,
} from "@/components/ui/screen/ScreenFooter";
import { TextInput, View, Text, StyleSheet } from "react-native";
import getColor from "@/lib/ui/getColor";

export default function FixMeal() {
  const { mealId } = useLocalSearchParams<{ mealId: Id<"meals"> }>();
  const router = useRouter();
  const correctMeal = useAction(api.meals.analyze.correctMeal.correctMeal);
  const [correction, setCorrection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCorrect = async () => {
    if (!mealId || !correction.trim()) return;
    setLoading(true);
    try {
      await correctMeal({ mealId, correction });
      router.dismissTo("/app");
    } catch (error) {
      console.error(error);
      alert("Error correcting meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Corregir Comida" />
      </ScreenHeader>

      <ScreenMainScrollView safeAreaProps={{ edges: ["left", "right"] }}>
        <ScreenMainTitle title="¿Qué quieres corregir?" />

        <View style={styles.container}>
          <Text style={styles.label}>Describe los cambios:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: No es pollo, es tofu. Añade una manzana."
            placeholderTextColor={getColor("mutedForeground")}
            value={correction}
            onChangeText={setCorrection}
            multiline
            autoFocus
          />
        </View>
      </ScreenMainScrollView>

      <ScreenFooter>
        <ScreenFooterButton
          onPress={() => void handleCorrect()}
          disabled={loading || !correction.trim()}
        >
          {loading ? "Corrigiendo..." : "Corregir"}
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: getColor("foreground"),
  },
  input: {
    backgroundColor: getColor("secondary"),
    color: getColor("foreground"),
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
