import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { LogOutIcon, PieChartIcon } from "lucide-react-native";
import { ScrollView, StyleSheet } from "react-native";

export default function ActivityScreen() {
  return (
    <SafeArea>
      <ScrollView>
        <Title style={styles.title}>Ajustes</Title>
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
  title: {
    paddingBottom: 16,
  },
});
