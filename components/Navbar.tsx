"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "🟢📞 9826181265", href: "https://wa.link/6zkrpq" },
  ];

const logo = "/images/logo.jpeg";


  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid rgba(200,200,200,0.6)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 16px",
          height: "64px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "None" }}>
          <img
            src={logo}
            alt="Sanmati-Prakrit-Vidyapeeth"
            style={{ height: "40px", transition: "transform 0.3s" }}
          />
          <h1
            style={{
              fontWeight: 700,
              fontSize: "20px",
              background:
                "linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            Sanmati Prakrit Vidyapeeth
          </h1>
        </Link>

        {!isMobile && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              width="24"
              height="24"
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
        )}
      </nav>

      {isMobile && menuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            backgroundColor: "rgba(255,255,255,0.95)",
            borderTop: "1px solid rgba(200,200,200,0.6)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 500,
                color: "#374151",
                textDecoration: "none",
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
