import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";
import { revenueCatConfig } from "@/config/revenueCatConfig";
import { useRouter } from "expo-router";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type SubscriptionContextType = {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  navigateToPaywall: () => void;
  presentCustomerCenter: () => Promise<void>;
  restorePurchases: () => Promise<CustomerInfo | null>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const syncSubscriptionStatus = useAction(
    api.profiles.syncSubscriptionStatus.default
  );
  const profile = useQuery(api.profiles.getProfile.default);

  useEffect(() => {
    if (!isLoading && profile?.userId) {
      // Identify the user in RevenueCat
      Purchases.logIn(profile.userId)
        .then(() => {
          // Sync status with server
          return syncSubscriptionStatus();
        })
        .catch((error: unknown) => {
          console.error("Failed to sync subscription status:", error);
        });
    }
  }, [isPro, isLoading, profile?.userId, syncSubscriptionStatus]);

  useEffect(() => {
    void (async () => {
      try {
        if (Platform.OS === "android" || Platform.OS === "ios") {
          await Purchases.setLogLevel(LOG_LEVEL.INFO);

          if (revenueCatConfig.apiKey) {
            Purchases.configure({ apiKey: revenueCatConfig.apiKey });
          }

          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
          checkEntitlement(info);
        }
      } catch (e) {
        console.error("RevenueCat init error:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const customerInfoUpdated = (info: CustomerInfo) => {
      setCustomerInfo(info);
      checkEntitlement(info);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);

  const checkEntitlement = (info: CustomerInfo) => {
    if (
      typeof info.entitlements.active[revenueCatConfig.entitlementId] !==
      "undefined"
    ) {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  };

  const navigateToPaywall = () => {
    router.push("/app/paywall");
  };

  const presentCustomerCenter = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      console.error("Present customer center error:", e);
    }
  };

  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      checkEntitlement(info);
      return info;
    } catch (e) {
      console.error("Restore purchases error:", e);
      return null;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        customerInfo,
        isLoading,
        navigateToPaywall,
        presentCustomerCenter,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }
  return context;
}
