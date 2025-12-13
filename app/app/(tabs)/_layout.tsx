import Button from "@/components/ui/Button";
import getColor from "@/lib/ui/getColor";
import { Tabs } from "expo-router";
import { HomeIcon, SettingsIcon } from "lucide-react-native";
import { PressableProps, View } from "react-native";
import TabsAddOptions from "@/components/tabs/TabsAddOptions";

function TabBarButton(props: PressableProps) {
  return <Button {...props} />;
}
TabBarButton.displayName = "TabBarButton";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: getColor("foreground"),
          tabBarInactiveTintColor: getColor("mutedForeground", 0.5),
          animation: "shift",
          tabBarStyle: {
            backgroundColor: getColor("background"),
            borderColor: getColor("secondary"),
            borderTopWidth: 1,
            paddingHorizontal: 25,
          },
          tabBarButton: (props) => <TabBarButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => null,
            tabBarButton: () => <TabsAddOptions />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Ajustes",
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
