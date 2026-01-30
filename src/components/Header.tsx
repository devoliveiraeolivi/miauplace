'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">
              🐱
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              MiauPlace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/gatos"
              className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
            >
              Gatos
            </Link>
            <Link
              href="/como-funciona"
              className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
            >
              Como Funciona
            </Link>
            <Link
              href="/sobre"
              className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
            >
              Sobre
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5">
              Doar um Gato
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/gatos"
                className="px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Gatos
              </Link>
              <Link
                href="/como-funciona"
                className="px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Como Funciona
              </Link>
              <Link
                href="/sobre"
                className="px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Sobre
              </Link>
              <button className="mt-2 mx-4 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium">
                Doar um Gato
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
