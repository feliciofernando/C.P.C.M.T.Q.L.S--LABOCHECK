'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre o Conselho', href: '#sobre' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Legislação', href: '#legislacao' },
  { label: 'Documentos', href: '#documentos' },
  { label: 'Contacto', href: '#contacto' },
];

const ctaItem: NavItem = {
  label: 'Consultar Minha Ficha',
  href: '#consultar',
  isButton: true,
};

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    const id = href.replace('#', '');
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled
          ? 'shadow-md'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-[#1a5c2e]"
            />
            <div className="hidden sm:block">
              <p className="text-sm lg:text-base font-bold text-[#1a1a1a] leading-tight tracking-wide">
                C.P.C.M.T.Q.L.S
              </p>
              <p className="text-[9px] lg:text-[10px] text-[#6b6b6b] leading-tight max-w-[180px] truncate">
                Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos
              </p>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="relative px-3 py-2 text-sm font-medium text-[#1a1a1a] hover:text-[#1a5c2e] transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a5c2e] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            ))}
            <a
              href={ctaItem.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(ctaItem.href);
              }}
              className="ml-3 px-5 py-2 text-sm font-semibold text-white bg-[#1a5c2e] hover:bg-[#0f3d1d] rounded-md transition-colors duration-200 shadow-sm hover:shadow"
            >
              {ctaItem.label}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#1a1a1a] hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-black/40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed top-16 right-0 bottom-0 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="py-4 px-4">
          {/* Logo for mobile */}
          <div className="flex items-center gap-3 mb-6 px-2 sm:hidden">
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-10 h-10 rounded-full border-2 border-[#1a5c2e]"
            />
            <div>
              <p className="text-sm font-bold text-[#1a1a1a] leading-tight">
                C.P.C.M.T.Q.L.S
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:text-[#1a5c2e] hover:bg-[#1a5c2e]/5 rounded-lg transition-colors duration-200"
              >
                <span>{item.label}</span>
                <ChevronDown className="w-4 h-4 opacity-40 rotate-[-90deg]" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-4 px-2">
            <a
              href={ctaItem.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(ctaItem.href);
              }}
              className="block w-full px-5 py-3 text-sm font-semibold text-white bg-[#1a5c2e] hover:bg-[#0f3d1d] rounded-lg transition-colors duration-200 text-center shadow-sm"
            >
              {ctaItem.label}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
