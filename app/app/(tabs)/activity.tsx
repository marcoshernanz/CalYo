import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { useRouter } from "expo-router";

export default function ActivityScreen() {
  const router = useRouter();

  return (
    <SafeArea>
      <Button onPress={() => router.navigate("/app/camera")}>Camera</Button>
    </SafeArea>
  );
}
