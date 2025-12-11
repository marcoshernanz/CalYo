import { ImageManipulator, ImageRef, SaveFormat } from "expo-image-manipulator";
import logError from "../utils/logError";

export default async function processLibraryImage(uri: string) {
  const loaderContext = ImageManipulator.manipulate(uri);
  let baseImage: ImageRef | null = null;

  try {
    baseImage = await loaderContext.renderAsync();
  } catch (error) {
    logError("Error loading image for processing", error);
    return uri;
  } finally {
    loaderContext.release();
  }

  let resizedImage: ImageRef | null = null;

  try {
    if (baseImage.width > 1080) {
      const targetWidth = 1080;
      const targetHeight = Math.round(
        baseImage.height * (targetWidth / baseImage.width)
      );

      const resizeContext = ImageManipulator.manipulate(baseImage);
      try {
        resizeContext.resize({ width: targetWidth, height: targetHeight });
        resizedImage = await resizeContext.renderAsync();
      } finally {
        resizeContext.release();
      }
    }

    const imageToSave = resizedImage ?? baseImage;

    const result = await imageToSave.saveAsync({
      format: SaveFormat.JPEG,
      compress: 0.7,
    });

    return result.uri;
  } catch (error) {
    logError("Error processing library image", error);
    return uri;
  } finally {
    if (resizedImage) {
      resizedImage.release();
    }
    baseImage.release();
  }
}
