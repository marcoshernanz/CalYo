import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import AlertDialog from "@/components/ui/AlertDialog";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useAuthContext } from "@/context/AuthContext";
import { useSubscriptionContext } from "@/context/SubscriptionContext";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Link, useRouter } from "expo-router";
import {
  LogOutIcon,
  PieChartIcon,
  UserXIcon,
  CrownIcon,
  CreditCardIcon,
  RefreshCwIcon,
} from "lucide-react-native";
import { Alert, ScrollView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useAuthContext();
  const { isPro, navigateToPaywall, presentCustomerCenter, restorePurchases } =
    useSubscriptionContext();
  const deleteUser = useMutation(api.users.deleteUser.default);
  const router = useRouter();

  const handleRestorePurchases = async () => {
    const customerInfo = await restorePurchases();
    if (customerInfo) {
      Alert.alert("Success", "Purchases restored successfully");
    } else {
      Alert.alert("Error", "Failed to restore purchases");
    }
  };

  const handleDeleteAccount = async () => {
    await deleteUser();
    await signOut();
    if (router.canDismiss()) router.dismissAll();
    router.replace("/auth");
  };

  const handleSignOut = async () => {
    await signOut();
    if (router.canDismiss()) router.dismissAll();
    router.replace("/auth");
  };

  return (
    <SafeArea edges={["top", "left", "right"]}>
      <Title style={styles.title}>Ajustes</Title>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SettingsGroup>
          <Link href="/app/(settings)/adjustMacroTargets" asChild>
            <SettingsItem text="Ajustar Macronutrientes" Icon={PieChartIcon} />
          </Link>
        </SettingsGroup>
        <SettingsGroup>
          {!isPro && (
            <SettingsItem
              text="Hazte Pro"
              Icon={CrownIcon}
              onPress={navigateToPaywall}
            />
          )}
          <SettingsItem
            text="Gestionar suscripción"
            Icon={CreditCardIcon}
            onPress={() => void presentCustomerCenter()}
          />
          <SettingsItem
            text="Restaurar compras"
            Icon={RefreshCwIcon}
            onPress={() => void handleRestorePurchases()}
          />
        </SettingsGroup>
        <SettingsGroup>
          <AlertDialog
            trigger={
              <SettingsItem
                destructive
                text="Eliminar Cuenta"
                Icon={UserXIcon}
              />
            }
            destructive
            title="Eliminar Cuenta"
            description="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
            onConfirm={() => void handleDeleteAccount()}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsItem
            text="Cerrar Sesión"
            Icon={LogOutIcon}
            onPress={() => void handleSignOut()}
          />
        </SettingsGroup>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: 16,
  },
  scrollView: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 24,
  },
});
