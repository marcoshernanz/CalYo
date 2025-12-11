import { type LucideProps, CandyIcon } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";

export default function SugarIcon(props: LucideProps) {
  return <CandyIcon color={getColor("sugar")} {...props} />;
}
