"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteConfig } from "@/context/SiteConfigContext";
import Icon from "@/components/ui/Icon";

export default function Navbar() {
  const site = useSiteConfig();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={site.meta.logo.src}
            alt={site.meta.logo.alt}
            width={36}
            height={36}
            priority
          />
          <span className="sm:block font-semibold">
            {site.meta.name}
          </span>
        </Link>

        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden p-2"
        >
          ☰
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {site.navigation.map(item => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t bg-white">
          <div className="flex flex-col px-4 py-3 gap-1">
            {site.navigation.map(item => (
              <NavLink
                key={item.href}
                item={item}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ item, onClick }: any) {
  const isExternal = item.external;

  return (
    <a
      href={item.href}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
    >
      {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
      {item.label}
    </a>
  );
}
