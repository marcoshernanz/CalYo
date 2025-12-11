import { type LucideProps, WavesIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function SodiumIcon(props: LucideProps) {
  return <WavesIcon color={getColor("sodium")} {...props} />;
}
