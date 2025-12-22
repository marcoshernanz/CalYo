import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { revenueCatConfig } from "@/config/revenueCatConfig";

type SubscriptionContextType = {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  presentPaywall: () => Promise<boolean>;
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
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        if (Platform.OS === "android" || Platform.OS === "ios") {
          await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

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

  const presentPaywall = async (): Promise<boolean> => {
    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: revenueCatConfig.entitlementId,
      });

      if (
        result === PAYWALL_RESULT.PURCHASED ||
        result === PAYWALL_RESULT.RESTORED
      ) {
        return true;
      }

      return false;
    } catch (e) {
      console.error("Present paywall error:", e);
      return false;
    }
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
        presentPaywall,
        presentCustomerCenter,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
