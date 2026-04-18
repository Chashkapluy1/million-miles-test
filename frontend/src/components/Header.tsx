"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["Catalog", "Services", "About", "Contact"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-border bg-dark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-dark font-black text-sm">M</span>
            </div>
            <span className="font-bold text-lg tracking-wider">
              MILLION<span className="gold-text">MILES</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#catalog"
                className="text-sm font-medium text-gray-400 hover:text-gold transition-colors tracking-wide"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#catalog"
              className="gold-gradient text-dark font-semibold px-5 py-2.5 rounded text-sm hover:opacity-90 transition-opacity"
            >
              Find a Car
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark/95 glass">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#catalog"
                className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-gold rounded transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}
            <a
              href="#catalog"
              className="block gold-gradient text-dark font-semibold px-3 py-2.5 rounded text-sm text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Find a Car
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
