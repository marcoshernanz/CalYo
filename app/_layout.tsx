import AppContextProvider from "@/context/AppContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_100Thin,
  Inter_100Thin_Italic,
  Inter_200ExtraLight,
  Inter_200ExtraLight_Italic,
  Inter_300Light,
  Inter_300Light_Italic,
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
  Inter_800ExtraBold,
  Inter_800ExtraBold_Italic,
  Inter_900Black,
  Inter_900Black_Italic,
} from "@expo-google-fonts/inter";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_100Thin_Italic,
    Inter_200ExtraLight,
    Inter_200ExtraLight_Italic,
    Inter_300Light,
    Inter_300Light_Italic,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_500Medium_Italic,
    Inter_600SemiBold,
    Inter_600SemiBold_Italic,
    Inter_700Bold,
    Inter_700Bold_Italic,
    Inter_800ExtraBold,
    Inter_800ExtraBold_Italic,
    Inter_900Black,
    Inter_900Black_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContextProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AppContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
