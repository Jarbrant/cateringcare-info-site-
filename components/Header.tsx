"use client";

import { useState } from "react";

const navLinks = [
  { label: "Tjänster", href: "#tjanster" },
  { label: "Varför oss", href: "#varfor-oss" },
  { label: "Vanliga frågor", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold text-green-800">
            CateringCare
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-green-700 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#kontakt"
          className="hidden md:inline-block bg-green-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-800 transition-colors"
        >
          Kontakta oss
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Öppna meny"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-green-700 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="block bg-green-700 text-white text-center px-5 py-2 rounded-full font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Kontakta oss
          </a>
        </nav>
      )}
    </header>
  );
}
