import { type LucideProps, SproutIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function FiberIcon(props: LucideProps) {
  return <SproutIcon color={getColor("fiber")} {...props} />;
}
