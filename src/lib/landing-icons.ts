import {
  Globe,
  FileText,
  Image as ImageIcon,
  MapPin,
  Bus,
  Mail,
  Phone,
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
  Calendar,
  ShoppingBag,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

export type LandingIconKey =
  | "globe"
  | "file"
  | "image"
  | "map"
  | "bus"
  | "mail"
  | "phone"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "youtube"
  | "calendar"
  | "shop"
  | "link";

export const LANDING_ICONS: Record<LandingIconKey, { Icon: LucideIcon; label: string }> = {
  globe: { Icon: Globe, label: "Sito web" },
  file: { Icon: FileText, label: "Documento / PDF" },
  image: { Icon: ImageIcon, label: "Volantino / Immagine" },
  map: { Icon: MapPin, label: "Mappa / Indicazioni" },
  bus: { Icon: Bus, label: "Trasporti / Navetta" },
  mail: { Icon: Mail, label: "Email" },
  phone: { Icon: Phone, label: "Telefono" },
  facebook: { Icon: Facebook, label: "Facebook" },
  instagram: { Icon: Instagram, label: "Instagram" },
  whatsapp: { Icon: MessageCircle, label: "WhatsApp" },
  youtube: { Icon: Youtube, label: "YouTube" },
  calendar: { Icon: Calendar, label: "Eventi / Calendario" },
  shop: { Icon: ShoppingBag, label: "Shop" },
  link: { Icon: LinkIcon, label: "Link generico" },
};

export const ICON_KEYS = Object.keys(LANDING_ICONS) as LandingIconKey[];

export function getLandingIcon(key: string | null | undefined): LucideIcon {
  if (key && key in LANDING_ICONS) return LANDING_ICONS[key as LandingIconKey].Icon;
  return LinkIcon;
}

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "chi-siamo",
  "circuito",
  "clienti",
  "contatti",
  "cookies",
  "dashboard",
  "forgot-password",
  "login",
  "llms.txt",
  "portfolio",
  "privacy",
  "reset-password",
  "robots.txt",
  "servizi",
  "sitemap.xml",
]);
