import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Linking } from "react-native";
import Purchases, {
  PACKAGE_TYPE,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import { useRouter } from "expo-router";
import {
  ScreenMain,
  ScreenMainScrollView,
  ScreenMainTitle,
} from "../ui/screen/ScreenMain";
import {
  ScreenHeader,
  ScreenHeaderBackButton,
  ScreenHeaderButton,
  ScreenHeaderTitle,
} from "../ui/screen/ScreenHeader";
import useScrollY from "@/lib/hooks/reanimated/useScrollY";
import { ScreenFooter, ScreenFooterButton } from "../ui/screen/ScreenFooter";
import { Toast } from "../ui/Toast";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { revenueCatConfig } from "@/config/revenueCatConfig";
import Text from "../ui/Text";
import getColor from "../../lib/ui/getColor";
import {
  CameraIcon,
  PenLineIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react-native";
import { useSubscriptionContext } from "@/context/SubscriptionContext";
import logError from "@/lib/utils/logError";

const proFeatures = [
  {
    title: "Foto y listo",
    description:
      "La IA identifica tu comida y calcula las calorías al instante. Solo apunta y dispara.",
    Icon: CameraIcon,
  },
  {
    title: "Registro por texto",
    description:
      "Simplemente describe tu plato y la IA calculará los macros automáticamente.",
    Icon: PenLineIcon,
  },
  {
    title: "Control total y edición",
    description:
      "Ajusta ingredientes o cantidades fácilmente si la IA se equivoca. Tú tienes la última palabra.",
    Icon: SparklesIcon,
  },
];

const currencyMap: Record<string, string> = {
  USD: "$",
  EUR: "€",
};

type BackProps = {
  type?: "back";
  onClose?: undefined;
};

type CloseProps = {
  type?: "close";
  onClose: () => void;
};

type Props = (BackProps | CloseProps) & {
  onSuccess?: () => void;
};

export default function Paywall({ type = "back", onClose, onSuccess }: Props) {
  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { restorePurchases } = useSubscriptionContext();

  useEffect(() => {
    void (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setOffering(offerings.current);
          if (offerings.current.availablePackages.length > 0) {
            setSelectedPackage(
              offerings.current.availablePackages[
                offerings.current.availablePackages.length - 1
              ]
            );
          }
        }
      } catch (e) {
        logError("Paywall error", e);
        Toast.show({
          variant: "error",
          text: "Error al cargar las ofertas",
        });
      }
    })();
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (
        typeof customerInfo.entitlements.active[
          revenueCatConfig.entitlementId
        ] !== "undefined"
      ) {
        if (onSuccess) {
          onSuccess();
        } else if (router.canGoBack()) {
          router.back();
        }
      }
    } catch (e) {
      const error = e as { userCancelled?: boolean; message?: string };
      if (!error.userCancelled && error.message) {
        Alert.alert("Error", error.message);
      }
      logError("Paywall error", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    const customerInfo = await restorePurchases();
    if (customerInfo) {
      Alert.alert("Éxito", "Compras restauradas correctamente");
    } else {
      Alert.alert("Error", "Error al restaurar las compras");
    }
    setIsPurchasing(false);
  };

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        {type === "back" && <ScreenHeaderBackButton />}
        <ScreenHeaderTitle title="Planes" />
        {type === "close" && (
          <ScreenHeaderButton
            Icon={XIcon}
            onPress={onClose}
            style={{ marginLeft: "auto", aspectRatio: 1 }}
          />
        )}
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <ScreenMainTitle
          title="CalYo Pro"
          description="Logra tus objetivos registrando tus comidas en segundos, no en minutos"
          style={styles.title}
        />
        <View style={styles.packageContainer}>
          {offering?.availablePackages.map((pkg) => {
            const isSelected = selectedPackage?.identifier === pkg.identifier;
            return (
              <Button
                key={`package-${pkg.identifier}`}
                variant="base"
                size="base"
                onPress={() => {
                  setSelectedPackage(pkg);
                }}
                style={{ flex: 1 }}
              >
                <Card style={[styles.card, isSelected && styles.selectedCard]}>
                  {pkg.packageType === PACKAGE_TYPE.ANNUAL && (
                    <View
                      style={[
                        styles.badge,
                        isSelected && { backgroundColor: getColor("primary") },
                      ]}
                    >
                      <Text
                        size="10"
                        weight="600"
                        color={isSelected ? getColor("background") : undefined}
                      >
                        {currencyMap[pkg.product.currencyCode] ??
                          pkg.product.currencyCode}
                        {Math.round((pkg.product.price / 12) * 100) / 100} / mes
                      </Text>
                    </View>
                  )}

                  <Text size="12">
                    {pkg.packageType === PACKAGE_TYPE.MONTHLY
                      ? "1 mes"
                      : "12 meses"}
                  </Text>
                  <Text size="18" weight="600">
                    {currencyMap[pkg.product.currencyCode] ??
                      pkg.product.currencyCode}
                    {Math.round(pkg.product.price * 100) / 100}
                  </Text>
                  <Text size="12" color={getColor("mutedForeground", 0.75)}>
                    Facturación{" "}
                    {pkg.packageType === PACKAGE_TYPE.MONTHLY
                      ? "mensual"
                      : "anual"}
                  </Text>
                </Card>
              </Button>
            );
          })}
        </View>

        <View>
          <Text size="20" weight="600" style={{ paddingBottom: 16 }}>
            ¿Por qué ser Pro?
          </Text>
          <Card style={styles.featuresCard}>
            {proFeatures.map(({ title, description, Icon }, index) => {
              const isLast = index === proFeatures.length - 1;

              return (
                <React.Fragment key={`feature-${title}`}>
                  <Button
                    variant="base"
                    size="base"
                    style={styles.featureButton}
                  >
                    <Icon size={20} color={getColor("foreground")} />
                    <View style={styles.featureTextContainer}>
                      <Text size="16" weight="600">
                        {title}
                      </Text>
                      <Text size="12" color={getColor("mutedForeground", 0.75)}>
                        {description}
                      </Text>
                    </View>
                  </Button>

                  {!isLast && <View style={styles.featuresDivider}></View>}
                </React.Fragment>
              );
            })}
          </Card>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingTop: 24,
            marginTop: "auto",
          }}
        >
          <Text
            size="14"
            style={{ textDecorationLine: "underline" }}
            onPress={() =>
              void Linking.openURL(
                "https://docs.google.com/document/d/e/2PACX-1vTyNCLjuAHdtZmdZQpIfOolwZ2nE7pA5kKTH3jrszZEgkSzfJMMBXdawf7yva_GFIoMiJ9vS63IplTy/pub"
              )
            }
          >
            Privacy Policy
          </Text>
          <Text>&middot;</Text>
          <Text
            size="14"
            style={{ textDecorationLine: "underline" }}
            onPress={() =>
              void Linking.openURL(
                "https://docs.google.com/document/d/e/2PACX-1vR-UlE0mpZ5nD3DekvTdch6hxejnJ_wqBGYKb9Fwk5ObEK8vgHpxUjVXWuRUOD40qREZCvoTo6L3PlG/pub"
              )
            }
          >
            Terms of Use
          </Text>
        </View>
      </ScreenMainScrollView>

      <ScreenFooter style={{ flexDirection: "column", gap: 14 }}>
        <ScreenFooterButton
          style={{ flex: 0 }}
          onPress={() =>
            void (selectedPackage && handlePurchase(selectedPackage))
          }
          disabled={!selectedPackage || isPurchasing}
        >
          Empezar prueba gratis de 7 días
        </ScreenFooterButton>
        <ScreenFooterButton
          variant="ghost"
          size="sm"
          style={{
            flex: 0,
            height: "auto",
            alignSelf: "center",
          }}
          hitSlop={4}
          onPress={() => void handleRestore()}
        >
          Restaurar compras
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: 20,
  },
  packageContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    alignItems: "center",
    padding: 16,
  },
  selectedCard: {
    padding: 16 - 2 + StyleSheet.hairlineWidth,
    borderWidth: 2,
    borderColor: getColor("primary"),
  },
  badge: {
    position: "absolute",
    top: 0,
    transform: [{ translateY: "-50%" }],
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: getColor("secondary"),
  },
  featuresCard: {
    padding: 20,
    gap: 16,
  },
  featureButton: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  featureTextContainer: {
    gap: 4,
    flex: 1,
  },
  featuresDivider: {
    height: 1,
    backgroundColor: getColor("secondary"),
  },
});
