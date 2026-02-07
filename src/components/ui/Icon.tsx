import { ICONS, IconName } from "@/lib/icons";
import type { LucideProps } from "lucide-react";

type Props = {
  name: IconName;
} & LucideProps;

export default function Icon({ name, ...props }: Props) {
  const Comp = ICONS[name];
  return <Comp {...props} />;
}
