'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavBarProps {
  onNavigate: (section: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Menu data                                                          */
/* ------------------------------------------------------------------ */

interface SubItem {
  label: string;
  key: string;
}

interface MenuItem {
  label: string;
  key?: string;           // if present → direct link (no dropdown)
  children?: SubItem[];   // if present → dropdown
}

const NAV_ITEMS: MenuItem[] = [
  {
    label: 'Sobre Nós',
    children: [
      { label: 'Mensagem do Director', key: 'director-message' },
      { label: 'Sobre o Conselho', key: 'sobre' },
      { label: 'Galeria dos Directores', key: 'galeria' },
    ],
  },
  {
    label: 'Informações',
    children: [
      { label: 'Legislação', key: 'legislacao' },
      { label: 'Documentos', key: 'documentos' },
      { label: 'Perguntas Frequentes', key: 'faqs' },
    ],
  },
  {
    label: 'Notícias',
    children: [
      { label: 'Notícias', key: 'noticias' },
      { label: 'Eventos', key: 'eventos' },
    ],
  },
  {
    label: 'Consultar Ficha',
    key: 'consultar',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NavBar({ onNavigate }: NavBarProps) {
  // Mobile hamburger open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // Which parent submenu is expanded in mobile view (null = none)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNavigate = (key: string) => {
    onNavigate(key);
    setMobileOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  return (
    <nav className="w-full bg-white border-b border-[#d1d1cc] shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center justify-center h-12 gap-1">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              /* ---- Dropdown parent ---- */
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#1a1a1a] rounded-md hover:bg-[#1a5c2e]/5 hover:text-[#1a5c2e] transition-colors"
                >
                  {item.label}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown panel */}
                <div className="absolute left-0 top-full pt-1 hidden group-hover:block">
                  <div className="bg-white border border-[#d1d1cc] rounded-lg shadow-lg min-w-[220px] py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        onClick={() => handleNavigate(child.key)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#1a5c2e] hover:text-white transition-colors"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ---- Direct link ---- */
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.key!)}
                className="px-4 py-2 text-sm font-medium text-[#1a1a1a] rounded-md hover:bg-[#1a5c2e]/5 hover:text-[#1a5c2e] transition-colors"
              >
                {item.label}
              </button>
            ),
          )}
        </div>

        {/* ── Mobile hamburger button ── */}
        <div className="flex md:hidden items-center justify-between h-12">
          <span className="text-sm font-bold text-[#1a5c2e] tracking-wide">Menu</span>
          <button
            type="button"
            onClick={() => {
              setMobileOpen((v) => !v);
              if (mobileOpen) setOpenSubmenu(null);
            }}
            className="p-2 rounded-md text-[#1a1a1a] hover:bg-[#1a5c2e]/5 transition-colors"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown panel ── */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        <div className="border-t border-[#d1d1cc] bg-white px-4 py-2">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              /* ---- Mobile dropdown parent ---- */
              <div key={item.label} className="border-b border-[#d1d1cc]/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.label)}
                  className="flex items-center justify-between w-full py-3 text-sm font-medium text-[#1a1a1a]"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 text-[#d4a017] transition-transform duration-200 ${
                      openSubmenu === item.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Mobile submenu */}
                <div
                  className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
                    openSubmenu === item.label ? 'max-h-[300px]' : 'max-h-0'
                  }`}
                >
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        onClick={() => handleNavigate(child.key)}
                        className="block w-full text-left py-2 text-sm text-[#6b6b6b] hover:text-[#1a5c2e] transition-colors"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ---- Mobile direct link ---- */
              <div key={item.label} className="border-b border-[#d1d1cc]/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => handleNavigate(item.key!)}
                  className="block w-full text-left py-3 text-sm font-medium text-[#1a1a1a] hover:text-[#1a5c2e] transition-colors"
                >
                  {item.label}
                </button>
              </div>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
