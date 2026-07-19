import { cookies } from "next/headers";
import { getRequestSiteConfig } from "@/lib/request-config";
import { resolveLocale, getMessages, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n";
import { getPreferences, localizeSiteConfig } from "@/lib/localize";
import type { Messages } from "@/lib/messages/types";
import type { SiteConfig } from "@/types/site-config";

/**
 * Everything an App Router server render needs for the current request: the
 * resolved tenant, the locale (cookie override → tenant default → Hindi), the
 * UI message catalog, and the site config with content overlaid for that locale.
 */
export async function getRequestContext(): Promise<{
  tenant: string;
  site: SiteConfig;
  locale: Locale;
  messages: Messages;
}> {
  const { tenant, site } = await getRequestSiteConfig();
  const cookieStore = await cookies();
  const prefs = getPreferences(site);
  const locale = resolveLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    isLocale(prefs.locale) ? prefs.locale : undefined
  );

  return {
    tenant,
    site: localizeSiteConfig(site, locale),
    locale,
    messages: getMessages(locale),
  };
}
