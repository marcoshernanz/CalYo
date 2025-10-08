import { type LucideProps } from "lucide-react-native";
import getColor from "../../../lib/ui/getColor";
import { IconAvocado } from "@tabler/icons-react-native";

export default function FatIcon(props: LucideProps) {
  return <IconAvocado color={getColor("fat")} {...props} />;
}
