import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { signOut } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <Text size="20" style={{ fontWeight: 600 }}>
          Home Screen
        </Text>
        <Button size="lg" onPress={handleSignOut}>
          Cerrar sesión
        </Button>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
});
