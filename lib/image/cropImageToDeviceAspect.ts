import { ImageManipulator, ImageRef, SaveFormat } from "expo-image-manipulator";
import { ScaledSize } from "react-native";
import logError from "../utils/logError";

type Params = {
  uri: string;
  dimensions: ScaledSize;
};

export default async function cropImageToDeviceAspect({
  uri,
  dimensions,
}: Params) {
  const loaderContext = ImageManipulator.manipulate(uri);
  let baseImage: ImageRef | null = null;

  try {
    baseImage = await loaderContext.renderAsync();
  } catch (error) {
    logError("Error loading image for crop", error);
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
      format: SaveFormat.JPEG,
      compress: 0.7,
    });

    return result.uri;
  } catch (error) {
    logError("Error cropping image", error);
    return uri;
  } finally {
    if (croppedImage) {
      croppedImage.release();
    }
    baseImage.release();
  }
}
