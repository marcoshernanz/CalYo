import Meal from "@/components/meal/Meal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteMeal from "@/lib/hooks/useDeleteMeal";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { ImageManipulator, SaveFormat, ImageRef } from "expo-image-manipulator";
import { Toast } from "@/components/ui/Toast";
import { z } from "zod";

export default function MealScreen() {
  const dimensions = useWindowDimensions();
  const router = useRouter();
  const {
    photoUri,
    mealId: initialMealId,
    source,
  } = useLocalSearchParams<{
    photoUri?: string;
    mealId?: Id<"meals">;
    source?: "camera" | "library";
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

  const fromCamera = source === "camera";

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
        baseImage.release();
      }
    },
    [dimensions.height, dimensions.width]
  );

  useEffect(() => {
    if (!photoUri || initialMealId || startedRef.current || mealId) return;
    startedRef.current = true;

    void (async () => {
      try {
        const croppedUri = fromCamera
          ? await cropToDeviceAspect(photoUri)
          : photoUri;

        const uploadUrl = await generateUploadUrl();

        const fileRes = await fetch(croppedUri);
        const blob = await fileRes.blob();

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });
        if (!uploadRes.ok) {
          throw new Error(`Upload failed: ${uploadRes.status}`);
        }
        const json: unknown = await uploadRes.json();
        const schema = z.object({
          storageId: z.string(),
        });

        const { data, success } = schema.safeParse(json);

        if (!success) {
          throw new Error("Upload response missing storageId");
        }
        const storageId = data.storageId as Id<"_storage">;

        const mealId = await analyzeMealPhoto({ storageId });
        setMealId(mealId);
      } catch (e) {
        console.error("Start meal error", e);
        Toast.show({ text: "Error al analizar la comida", variant: "error" });
        router.replace("/app");
      }
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
    fromCamera,
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
        name: item.food.name.en,
        calories: macrosToKcal(item.nutrients),
        grams: item.grams,
      }))
    : undefined;

  const isLoading = !mealId || !data || !isDone;

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
