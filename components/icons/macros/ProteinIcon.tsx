import { DrumstickIcon, LucideIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function ProteinIcon(props: LucideIcon) {
  return <DrumstickIcon color={getColor("protein")} {...props} />;
}
