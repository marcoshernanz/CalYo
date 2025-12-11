import { HeartPulseIcon, type LucideProps } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function HealthIcon(props: LucideProps) {
  return <HeartPulseIcon color={getColor("health")} {...props} />;
}
