import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { isIconName } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import { SITE_TAGLINE } from "@/lib/site";
import type { Messages } from "@/lib/messages/types";
import type { PlatformSettings } from "@/lib/platform-settings";
import type { SiteConfig } from "@/types/site-config";

const SOCIAL_ICON: Record<SiteConfig["socials"][number]["type"], string> = {
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
};

export default function Footer({
  site,
  messages,
  platform,
}: {
  site: SiteConfig;
  messages: Messages;
  platform: PlatformSettings;
}) {
  const year = 2026;

  return (
    <footer className="mt-auto bg-maroon-900 text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {/* Brand */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-cream">{site.meta.name}</h3>
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">{SITE_TAGLINE}</p>
        </div>

        {/* Explore */}
        <nav aria-label={messages.footer.explore} className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">
            {messages.footer.explore}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={ROUTES.home} className="transition hover:text-saffron-300">
                {messages.nav.home}
              </Link>
            </li>
            <li>
              <Link href={ROUTES.gallery} className="transition hover:text-saffron-300">
                {messages.nav.gallery}
              </Link>
            </li>
            {site.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="transition hover:text-saffron-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">
            {messages.footer.contact}
          </h4>
          <ul className="space-y-2 text-sm">
            {site.contact.phone && (
              <li>
                <a href={`tel:${site.contact.phone}`} className="transition hover:text-saffron-300">
                  {site.contact.phone}
                </a>
              </li>
            )}
            {site.contact.whatsapp?.url && (
              <li>
                <a
                  href={site.contact.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-saffron-300"
                >
                  {site.contact.whatsapp.label || "WhatsApp"}
                </a>
              </li>
            )}
          </ul>

          {site.socials?.length > 0 && (
            <div className="flex gap-3 pt-2">
              {site.socials.map((social) => {
                const iconName = SOCIAL_ICON[social.type];
                return (
                  <a
                    key={social.type + social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.type}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-saffron-500 hover:text-maroon-900"
                  >
                    {isIconName(iconName) && <Icon name={iconName} className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Platform-wide footer note (managed by the super-admin, shown on every tenant). */}
      <div className="space-y-1 border-t border-cream/10 px-5 py-6 text-center text-xs text-cream/60 sm:px-8">
        {platform.enrollNote && <p className="text-cream/80">{platform.enrollNote}</p>}
        <p>{platform.copyright || `© ${year} ${site.meta.name}. ${messages.footer.rights}`}</p>
      </div>
    </footer>
  );
}
