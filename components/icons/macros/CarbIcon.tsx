import { type LucideProps, WheatIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function CarbIcon(props: LucideProps) {
  return <WheatIcon color={getColor("carb")} {...props} />;
}
