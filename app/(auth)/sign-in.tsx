import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function SignIn() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sign In Screen</Text>
      {/* Placeholder; no real auth logic */}
      <Button
        title="Sign In"
        onPress={() => router.replace({ pathname: "/home" as any })}
      />
    </View>
  );
}
