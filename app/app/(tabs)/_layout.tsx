import Button from "@/components/ui/Button";
import getColor from "@/lib/ui/getColor";
import getShadow from "@/lib/ui/getShadow";
import { Tabs, useRouter } from "expo-router";
import { HomeIcon, PlusIcon, SettingsIcon } from "lucide-react-native";
import { PressableProps, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
            tabBarLabel: "Home",
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
            tabBarButton: () => <CenterAddButton />,
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
    </View>
  );
}

function CenterAddButton() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const size = 59 + Math.max(0, bottom / 2 - 10);

  return (
    <View
      pointerEvents="box-none"
      style={{ flex: 1, alignItems: "center", top: -16 }}
    >
      <Button
        variant="primary"
        style={{ height: size, width: size, ...getShadow("sm") }}
        hitSlop={10}
        accessibilityLabel="Add"
        onPress={() => router.navigate("/app/camera")}
      >
        <PlusIcon color={getColor("background")} size={28} />
      </Button>
    </View>
  );
}
