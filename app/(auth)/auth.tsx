import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Onboarding Screen</Text>
      {/* Single screen; animations will be added locally later */}
      <Button
        title="Go to Sign In"
        onPress={() => router.push({ pathname: "/sign-in" as any })}
      />
    </View>
  );
}
