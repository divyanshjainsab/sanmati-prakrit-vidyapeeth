import type { LucideIcon } from "lucide-react";
import {
  Home,
  Image,
  MessageCircle,
  Phone,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";

export const ICONS = {
  home: Home,
  gallery: Image,
  whatsapp: MessageCircle,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
