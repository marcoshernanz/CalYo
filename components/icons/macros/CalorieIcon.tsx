import { FlameIcon, LucideIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function CalorieIcon(props: LucideIcon) {
  return <FlameIcon color={getColor("foreground")} {...props} />;
}
