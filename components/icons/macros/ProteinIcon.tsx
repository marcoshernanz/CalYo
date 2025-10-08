import { DrumstickIcon, type LucideProps } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function ProteinIcon(props: LucideProps) {
  return <DrumstickIcon color={getColor("protein")} {...props} />;
}
