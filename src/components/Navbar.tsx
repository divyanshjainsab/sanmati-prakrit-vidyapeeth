"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    {
      name: "9826181265",
      href: "https://wa.link/6zkrpq",
      isWhatsapp: true,
    },
  ];

  const logo = "/images/logo.jpeg";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Sanmati Prakrit Vidyapeeth"
            className="h-10 w-auto hover:scale-105 transition-transform"
          />
          <h1 className="hidden sm:block text-lg font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            Sanmati Prakrit Vidyapeeth
          </h1>
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-3">
          {navLinks.map((link) =>
            link.isWhatsapp ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-500/10 transition"
              >
                <WhatsappIcon />
                {link.name}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-500/10 hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden rounded-lg p-2 hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-2 border-t border-gray-200 bg-white/95 px-4 py-4">
          {navLinks.map((link) =>
            link.isWhatsapp ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-green-700 hover:bg-green-500/10 transition"
              >
                <WhatsappIcon />
                {link.name}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-blue-500/10 hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}

/* WhatsApp Icon */
function WhatsappIcon() {
  return (
    <svg
      className="h-5 w-5 text-green-600"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16 .3C7.3.3.3 7.3.3 16c0 2.8.7 5.4 2.1 7.8L0 32l8.4-2.2c2.3 1.3 4.9 2 7.6 2h.1c8.7 0 15.7-7 15.7-15.7C31.7 7.3 24.7.3 16 .3zm0 28.8c-2.4 0-4.8-.6-6.9-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5c-1.3-2.1-2-4.6-2-7.1C2.6 8.9 8.9 2.6 16 2.6S29.4 8.9 29.4 16 23.1 29.1 16 29.1zm7.5-9.5c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.3-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.6c.2.2 2.4 3.6 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z" />
    </svg>
  );
}
