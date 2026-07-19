import { cookies } from "next/headers";
import { resolveLocale, getMessages, LOCALE_COOKIE } from "@/lib/i18n";

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, null);
  const m = getMessages(locale).notFound;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="font-serif text-3xl font-bold text-maroon-800">{m.title}</h1>
      <p className="max-w-md text-maroon-700/80">{m.body}</p>
    </div>
  );
}
