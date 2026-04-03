'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

const menuItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre Nos', href: '#sobre' },
  { label: 'Servicos', href: '#servicos' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Consultar Ficha', href: '#consultar' },
  { label: 'Contactos', href: '#contactos' },
];

export default function Navbar() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (href === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-[#1a5c2e] text-white transition-shadow duration-300 no-print"
      style={{
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4a017] to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#inicio')}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#d4a017] group-hover:border-[#f0c040] transition-colors"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold tracking-wide leading-tight">
                C.P.C.M.T.Q.L.S
              </h1>
              <p className="text-[9px] md:text-[10px] opacity-80 leading-tight">
                LABOCHECK
              </p>
            </div>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="md:hidden border-t border-white/10 pb-3">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
