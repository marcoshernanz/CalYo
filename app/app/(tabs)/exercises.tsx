import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { useAuthContext } from "@/context/AuthContext";

export default function ExercisesScreen() {
  const { signOut } = useAuthContext();

  return (
    <SafeArea>
      <Button onPress={signOut}>Sign Out</Button>
    </SafeArea>
  );
}
