import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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

export default function Paywall() {
  const router = useRouter();
  const { scrollY, onScroll } = useScrollY();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setOffering(offerings.current);
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

      if (customerInfo.entitlements.active["CalYo Pro"]) {
        Alert.alert("Success", "Welcome to CalYo Pro!");
        router.back(); // Close paywall on success
      }
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
        />
        <View>
          <Button variant="base" size="base">
            <Card>
              <Text>Plan 1</Text>
            </Card>
          </Button>
          <Button variant="base" size="base">
            <Card>
              <Text>Plan 2</Text>
            </Card>
          </Button>
        </View>
      </ScreenMainScrollView>

      <ScreenFooter style={{ flexDirection: "column", gap: 14 }}>
        <ScreenFooterButton style={{ flex: 0 }}>
          Start 7-day free trial
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
        >
          Restore Purchases
        </ScreenFooterButton>
      </ScreenFooter>
    </ScreenMain>
  );
}

const styles = StyleSheet.create({});
