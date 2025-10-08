import { LucideIcon, WheatIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function CarbIcon(props: LucideIcon) {
  return <WheatIcon color={getColor("carb")} {...props} />;
}
