import Meal from "@/components/meal/Meal";
import { Toast } from "@/components/ui/Toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteMeal from "@/lib/hooks/useDeleteMeal";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { ImageRef } from "expo-image-manipulator";

export default function MealScreen() {
  const dimensions = useWindowDimensions();
  const router = useRouter();
  const { photoUri, mealId: initialMealId } = useLocalSearchParams<{
    photoUri?: string;
    mealId?: Id<"meals">;
  }>();

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);
  const createMeal = useMutation(api.meals.createMeal.default);
  const deleteMeal = useDeleteMeal();

  const [mealId, setMealId] = useState<Id<"meals"> | undefined>(initialMealId);
  const startedRef = useRef(false);

  useEffect(() => {
    setMealId(initialMealId);
  }, [initialMealId]);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  const cropToDeviceAspect = useCallback(
    async (uri: string) => {
      const loaderContext = ImageManipulator.manipulate(uri);
      let baseImage: ImageRef | null = null;

      try {
        baseImage = await loaderContext.renderAsync();
      } catch (error) {
        console.error("Error loading image for crop:", error);
        return uri;
      } finally {
        loaderContext.release();
      }

      if (!baseImage) {
        return uri;
      }

      let croppedImage: ImageRef | null = null;

      try {
        const targetAspect = dimensions.width / dimensions.height;
        if (!Number.isFinite(targetAspect) || targetAspect <= 0) {
          return uri;
        }

        const imageAspect = baseImage.width / baseImage.height;
        if (
          !Number.isFinite(imageAspect) ||
          baseImage.width === 0 ||
          baseImage.height === 0 ||
          Math.abs(imageAspect - targetAspect) < 0.001
        ) {
          return uri;
        }

        let cropWidth = baseImage.width;
        let cropHeight = baseImage.height;
        let originX = 0;
        let originY = 0;

        if (imageAspect > targetAspect) {
          cropHeight = baseImage.height;
          cropWidth = Math.round(baseImage.height * targetAspect);
          cropWidth = Math.max(1, Math.min(cropWidth, baseImage.width));
          originX = Math.round((baseImage.width - cropWidth) / 2);
          const maxOriginX = baseImage.width - cropWidth;
          originX = Math.max(0, Math.min(originX, maxOriginX));
        } else {
          cropWidth = baseImage.width;
          cropHeight = Math.round(baseImage.width / targetAspect);
          cropHeight = Math.max(1, Math.min(cropHeight, baseImage.height));
          originY = Math.round((baseImage.height - cropHeight) / 2);
          const maxOriginY = baseImage.height - cropHeight;
          originY = Math.max(0, Math.min(originY, maxOriginY));
        }

        const cropContext = ImageManipulator.manipulate(baseImage);
        try {
          cropContext.crop({
            originX,
            originY,
            width: cropWidth,
            height: cropHeight,
          });

          croppedImage = await cropContext.renderAsync();
        } finally {
          cropContext.release();
        }

        if (!croppedImage) {
          return uri;
        }

        const result = await croppedImage.saveAsync({
          format: SaveFormat.PNG,
        });

        return result.uri;
      } catch (error) {
        console.error("Error cropping image:", error);
        return uri;
      } finally {
        if (croppedImage) {
          croppedImage.release();
        }
        if (baseImage) {
          baseImage.release();
        }
      }
    },
    [dimensions.height, dimensions.width]
  );

  const [initialUri, setInitialUri] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    if (!photoUri || initialMealId || startedRef.current || mealId) return;
    startedRef.current = true;

    (async () => {
      // TODO: Only crop aspect ratio for pictures taken with the camera, not uploaded ones
      setInitialUri(photoUri);
      const croppedUri = await cropToDeviceAspect(photoUri);
      setUri(croppedUri);

      return;

      // try {
      //   const uploadUrl = await generateUploadUrl();

      //   const fileRes = await fetch(photoUri);
      //   const blob = await fileRes.blob();

      //   const uploadRes = await fetch(uploadUrl, {
      //     method: "POST",
      //     headers: { "Content-Type": blob.type || "image/jpeg" },
      //     body: blob,
      //   });
      //   if (!uploadRes.ok) {
      //     throw new Error(`Upload failed: ${uploadRes.status}`);
      //   }
      //   const json = await uploadRes.json();
      //   if (!json?.storageId) {
      //     throw new Error("Upload response missing storageId");
      //   }
      //   const { storageId } = json;

      //   const mealId = await analyzeMealPhoto({ storageId });
      //   setMealId(mealId);
      // } catch (e) {
      //   console.error("Start meal error", e);
      //   Toast.show({ text: "Error al analizar la comida", variant: "error" });
      //   router.replace("/app");
      // }
    })();
  }, [
    analyzeMealPhoto,
    createMeal,
    cropToDeviceAspect,
    generateUploadUrl,
    photoUri,
    initialMealId,
    mealId,
    deleteMeal,
    router,
  ]);

  if (mealId && data === null) {
    return <Redirect href="/app" />;
  }

  const meal = data?.meal;
  const mealItems = data?.mealItems ?? [];

  const isDone =
    !!meal && meal.status === "done" && !!meal.name && !!meal.totals;

  const items = isDone
    ? mealItems.map((item) => ({
        id: item._id,
        name: item.food.description.en,
        calories: macrosToKcal(item.nutrients),
        grams: item.grams,
      }))
    : undefined;

  const isLoading = !mealId || !data || !isDone;

  if (uri && initialUri) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          // source={{ uri: initialUri }}
          source={{ uri }}
          style={{ height: 600, width: 300, resizeMode: "contain" }}
        />
      </View>
    );
  }

  return (
    <Meal
      loading={isLoading}
      name={meal?.name}
      mealId={meal?._id}
      totals={meal?.totals}
      items={items}
    />
  );
}
