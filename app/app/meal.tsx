import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import Title from "@/components/ui/Title";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  FlameIcon,
  Share2Icon,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

export default function MealScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);
  const router = useRouter();

  const [mealId, setMealId] = useState<Id<"meals"> | null>(
    "kn7bpc59sd228ncdzg33642vmx7szjbj" as Id<"meals">
  );
  const startedRef = useRef(true);
  // const [mealId, setMealId] = useState<Id<"meals"> | null>(null);
  // const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  useEffect(() => {
    if (!photoUri || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const newMealId = await createMeal();
        if (!newMealId) throw new Error("Failed to create meal");
        setMealId(newMealId);

        const uploadUrl = await generateUploadUrl();

        const fileRes = await fetch(photoUri);
        const blob = await fileRes.blob();

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });
        const { storageId } = await uploadRes.json();

        await analyzeMealPhoto({ mealId: newMealId, storageId });
      } catch (e) {
        console.error("Start meal error", e);
      }
    })();
  }, [analyzeMealPhoto, createMeal, generateUploadUrl, photoUri]);

  const meal = data?.meal;
  const items = data?.mealItems ?? [];
  const isLoading =
    !meal || meal.status === "pending" || meal.status === "processing";
  const totals = meal?.totals ?? { calories: 0, protein: 0, fat: 0, carbs: 0 };

  return (
    <SafeArea>
      {/* <ScrollView>
        <Text>Status: {meal?.status}</Text>
        <Text>Name: {meal?.name}</Text>
        <Text>Calories: {meal?.totals?.calories}</Text>
        <Text>Protein: {meal?.totals?.protein}</Text>
        <Text>Carbs: {meal?.totals?.carbs}</Text>
        <Text>Fat: {meal?.totals?.fat}</Text>
        <Text>Items:</Text>
        {items.map((item) => (
          <View key={item._id}>
            <Text>- Description: {item.food?.description.en}</Text>
            <Text>- Grams: {item.grams}</Text>
            <Text>- Protein: {item.food?.nutrients.protein}</Text>
            <Text>- Carbs: {item.food?.nutrients.carbs}</Text>
            <Text>- Fat: {item.food?.nutrients.fat}</Text>
          </View>
        ))}
      </ScrollView> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingBottom: 16,
        }}
      >
        <Button
          size="sm"
          variant="secondary"
          style={{ aspectRatio: 1 }}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon size={22} />
        </Button>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text size="18" weight="600">
            Nutrición
          </Text>
        </View>
        <Button size="sm" variant="secondary" style={{ aspectRatio: 1 }}>
          <EllipsisVerticalIcon size={22} />
        </Button>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <Text size="24" weight="600">
          Macarrones con tomate y atún.
        </Text>
        <View style={{ gap: 6 }}>
          <Card style={{ flexDirection: "row", gap: 12, padding: 12 }}>
            <View
              style={{
                height: 64,
                width: 64,
                borderRadius: 16,
                backgroundColor: getColor("muted"),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlameIcon />
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text size="12" color={getColor("mutedForeground")}>
                Calorías
              </Text>
              <Text size="24" weight="700">
                {totals.calories}
              </Text>
            </View>
          </Card>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  style={{
                    flex: 1,
                    padding: 12,
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Text size="12" color={getColor("mutedForeground")}>
                    Proteína
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 22,
                        width: 22,
                        borderRadius: 16,
                        backgroundColor: getColor("muted"),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FlameIcon size={14} />
                    </View>
                    <Text size="16" weight="600">
                      {totals.protein}g
                    </Text>
                  </View>
                </Card>
              ))}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 12,
        }}
      >
        <Button style={{ flex: 1, height: 48 }}>Hecho</Button>
      </View>
    </SafeArea>
  );
}
