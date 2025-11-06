import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { LogOutIcon, PieChartIcon } from "lucide-react-native";
import { ScrollView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <SafeArea edges={["top", "left", "right"]}>
      <Title style={styles.title}>Ajustes</Title>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SettingsGroup>
          <SettingsItem
            text="Ajustar Macronutrientes"
            Icon={PieChartIcon}
            onPress={() => {}}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsItem
            text="Cerrar Sesión"
            Icon={LogOutIcon}
            onPress={() => {}}
          />
        </SettingsGroup>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 24,
  },
  title: {
    paddingBottom: 16,
  },
});
