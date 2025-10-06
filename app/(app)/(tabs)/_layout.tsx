import Button from "@/components/ui/Button";
import getColor from "@/lib/utils/getColor";
import { Tabs } from "expo-router";
import {
  ActivityIcon,
  DumbbellIcon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react-native";
import { PressableProps, View } from "react-native";

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
          tabBarActiveTintColor: getColor("primary"),
          tabBarInactiveTintColor: getColor("mutedForeground"),
          tabBarStyle: {
            backgroundColor: getColor("background"),
            borderColor: getColor("foreground"), // TODO
            borderTopWidth: 1,
          },
          tabBarButton: (props) => <TabBarButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            tabBarLabel: "Activity",
            tabBarIcon: ({ color, size }) => (
              <ActivityIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => null,
            tabBarButton: () => <TabBarButton />,
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            tabBarLabel: "Exercises",
            tabBarIcon: ({ color, size }) => (
              <DumbbellIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
      </Tabs>

      {/* <TabsAddButton /> */}
    </View>
  );
}
