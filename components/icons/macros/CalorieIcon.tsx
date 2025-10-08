import { FlameIcon, type LucideProps } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function CalorieIcon(props: LucideProps) {
  return <FlameIcon color={getColor("foreground")} {...props} />;
}
