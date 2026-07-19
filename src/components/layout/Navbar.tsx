"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteConfig } from "@/context/SiteConfigContext";
import Icon from "@/components/ui/Icon";
import { isIconName } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import LanguageToggle from "@/components/layout/LanguageToggle";
import type { SiteConfig } from "@/types/site-config";

type NavigationItem = SiteConfig["navigation"][number];

export default function Navbar() {
  const site = useSiteConfig();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-saffron-200/70 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={ROUTES.home} className="flex items-center gap-2.5">
          {site.meta.logo?.src && (
            <Image
              src={site.meta.logo.src}
              alt={site.meta.logo.alt}
              width={40}
              height={40}
              priority
              className="rounded-full ring-1 ring-saffron-200"
            />
          )}
          <span className="font-serif text-lg font-bold text-maroon-800 sm:text-xl">
            {site.meta.name}
          </span>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="p-2 text-maroon-800 lg:hidden"
        >
          ☰
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {site.navigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <span className="ml-2 border-l border-saffron-200 pl-2">
            <LanguageToggle />
          </span>
        </div>
      </nav>

      {open && (
        <div className="border-t border-saffron-200/70 bg-cream lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {site.navigation.map((item) => (
              <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />
            ))}
            <div className="pt-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ item, onClick }: { item: NavigationItem; onClick?: () => void }) {
  const isExternal = item.external;

  return (
    <a
      href={item.href}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-maroon-800 transition hover:bg-saffron-100 hover:text-maroon-900"
    >
      {item.icon && isIconName(item.icon) && <Icon name={item.icon} className="h-4 w-4" />}
      {item.label}
    </a>
  );
}
