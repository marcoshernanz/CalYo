import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useAuthContext } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { LogOutIcon, PieChartIcon } from "lucide-react-native";
import { ScrollView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useAuthContext();
  const router = useRouter();

  return (
    <SafeArea edges={["top", "left", "right"]}>
      <Title style={styles.title}>Ajustes</Title>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SettingsGroup>
          <Link href="/app/adjustMacroTargets" asChild prefetch>
            <SettingsItem text="Ajustar Macronutrientes" Icon={PieChartIcon} />
          </Link>
        </SettingsGroup>
        <SettingsGroup>
          <SettingsItem
            text="Cerrar Sesión"
            Icon={LogOutIcon}
            onPress={() => {
              void signOut().then(() => {
                if (router.canDismiss()) router.dismissAll();
                router.replace("/auth");
              });
            }}
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
