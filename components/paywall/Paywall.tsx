import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Purchases, {
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
import { CameraIcon, PenLineIcon, SparklesIcon } from "lucide-react-native";

const proFeatures = [
  {
    title: "Log with a photo",
    description: "AI meal logger with a picture of your food",
    Icon: CameraIcon,
  },
  {
    title: "Log with description",
    description: "AI meal logger by describing your meal",
    Icon: PenLineIcon,
  },
  {
    title: "Fix meal",
    description: "Correct mistakes easily with AI",
    Icon: SparklesIcon,
  },
];

export default function Paywall() {
  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setOffering(offerings.current);
          if (offerings.current.availablePackages.length > 0) {
            setSelectedPackage(offerings.current.availablePackages[0]);
          }
        }
      } catch {
        Toast.show({
          variant: "error",
          text: "Failed to load offerings",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (isPurchasing) return;
    setIsPurchasing(true);

    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      if (
        typeof customerInfo.entitlements.active[
          revenueCatConfig.entitlementId
        ] !== "undefined"
      ) {
        Toast.show({
          variant: "success",
          text: "Subscription successful",
        });
        router.back(); // Close paywall on success
      }
      // TODO
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Purchase Error", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active["CalYo Pro"]) {
        Alert.alert("Success", "Purchases restored!");
        router.back();
      } else {
        Alert.alert("Info", "No active subscriptions found to restore.");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScreenMain edges={[]}>
      <ScreenHeader scrollY={scrollY}>
        <ScreenHeaderBackButton />
        <ScreenHeaderTitle title="Plans" />
      </ScreenHeader>

      <ScreenMainScrollView
        scrollViewProps={{ onScroll }}
        safeAreaProps={{ edges: ["left", "right"] }}
      >
        <ScreenMainTitle
          title="CalYo Pro"
          description="Reach your goals with faster food logging"
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
                      €4.17 / mes
                    </Text>
                  </View>

                  <Text size="12">1 month</Text>
                  <Text size="18" weight="600">
                    €9.99
                  </Text>
                  <Text size="12" color={getColor("mutedForeground", 0.75)}>
                    Billed monthly
                  </Text>
                </Card>
              </Button>
            );
          })}
        </View>

        <View>
          <Text size="20" weight="600" style={{ paddingBottom: 16 }}>
            Why go Pro?
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
      </ScreenMainScrollView>

      <ScreenFooter style={{ flexDirection: "column", gap: 14 }}>
        <ScreenFooterButton
          style={{ flex: 0 }}
          onPress={() =>
            void (selectedPackage && handlePurchase(selectedPackage))
          }
          disabled={!selectedPackage || isPurchasing}
        >
          {isPurchasing
            ? "Processing..."
            : selectedPackage
              ? `Subscribe for ${selectedPackage.product.priceString}`
              : "Select a plan"}
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
          Restore Purchases
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
