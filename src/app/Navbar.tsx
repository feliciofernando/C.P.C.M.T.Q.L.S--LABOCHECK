'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Briefcase,
  CreditCard,
  UserPlus,
  GraduationCap,
  Scale,
  Search,
  Newspaper,
  Phone,
  Building2,
  Image,
  FileText,
  Calendar,
  HelpCircle,
  Users,
} from 'lucide-react';

/* ==============================
   MENU DATA (com submenus)
   ============================== */
interface SubMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  desc?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Inicio',
    href: '#inicio',
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: 'O Conselho',
    icon: <Info className="w-4 h-4" />,
    children: [
      { label: 'Mensagem do Presidente', href: '#sobre', desc: 'Palavras do lider', icon: <Users className="w-4 h-4" /> },
      { label: 'Sobre o Conselho', href: '#sobre', desc: 'Quem somos', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Galeria de Diretores', href: '#galeria', desc: 'Nossos diretores', icon: <Users className="w-4 h-4" /> },
      { label: 'Eventos', href: '#eventos', desc: 'Proximos eventos', icon: <Calendar className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Servicos',
    icon: <Briefcase className="w-4 h-4" />,
    children: [
      { label: 'Emissao de Licencas', href: '#servicos', desc: 'Licenca profissional PVC', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Registo de Condutores', href: '#consultar', desc: 'Inscreva-se agora', icon: <UserPlus className="w-4 h-4" /> },
      { label: 'Formacao Profissional', href: '#servicos', desc: 'Cursos e capacitacao', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Consultoria e Apoio Legal', href: '#servicos', desc: 'Assistencia juridica', icon: <Scale className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Recursos',
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: 'Legislacao', href: '#documentos', desc: 'Leis e decretos', icon: <Scale className="w-4 h-4" /> },
      { label: 'Documentos', href: '#documentos', desc: 'Formularios e guias', icon: <FileText className="w-4 h-4" /> },
      { label: 'Perguntas Frequentes', href: '#faq', desc: 'Tire suas duvidas', icon: <HelpCircle className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Noticias',
    href: '#noticias',
    icon: <Newspaper className="w-4 h-4" />,
  },
  {
    label: 'Consultar Ficha',
    href: '#consultar',
    icon: <Search className="w-4 h-4" />,
  },
  {
    label: 'Contactos',
    href: '#contactos',
    icon: <Phone className="w-4 h-4" />,
  },
];

/* ==============================
   DESKTOP SUBMENU COMPONENT
   ============================== */
function DesktopDropdown({ items }: { items: SubMenuItem[] }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl bg-white shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden z-[60]
          transition-all duration-200 origin-top
          ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {/* Gold top accent */}
        <div className="h-[2px] bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#d4a017]" />
        <div className="p-2">
          {items.map((sub, i) => {
            const Icon = sub.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  const el = document.querySelector(sub.href);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  setVisible(false);
                }}
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[#1a5c2e]/[0.07] transition-colors group/item"
              >
                {Icon && (
                  <div className="w-9 h-9 rounded-lg bg-[#1a5c2e]/[0.08] group-hover/item:bg-[#1a5c2e]/[0.15] flex items-center justify-center flex-shrink-0 text-[#1a5c2e] group-hover/item:text-[#d4a017] transition-colors mt-0.5">
                    {Icon}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#1a1a1a] group-hover/item:text-[#1a5c2e] transition-colors leading-tight">
                    {sub.label}
                  </div>
                  {sub.desc && (
                    <div className="text-xs text-[#6b6b6b] mt-0.5 leading-snug">
                      {sub.desc}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   MAIN NAVBAR
   ============================== */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
        setExpandedMobile(null);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    setExpandedMobile(null);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (href === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMobile = (label: string) => {
    setExpandedMobile((prev) => (prev === label ? null : label));
  };

  return (
    <nav
      className={`sticky top-0 z-50 no-print transition-all duration-300 ${
        scrolled
          ? 'bg-[#1a5c2e]/[0.97] backdrop-blur-md shadow-lg shadow-black/15'
          : 'bg-[#1a5c2e]'
      }`}
    >
      {/* Top gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4a017] to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-[60px]">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#inicio')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <img
                src="/logotipo.jpg"
                alt="C.P.C.M.T.Q.L.S"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#d4a017] group-hover:border-[#f0c040] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(212,160,23,0.4)]"
              />
              {/* Pulse dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#d4a017] rounded-full border-2 border-[#1a5c2e]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold tracking-wide leading-tight">
                C.P.C.M.T.Q.L.S
              </h1>
              <p className="text-[9px] md:text-[10px] text-[#d4a017]/90 font-medium tracking-wider leading-tight">
                LABOCHECK
              </p>
            </div>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-0.5">
            {menuItems.map((item) => {
              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="relative group"
                  >
                    <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white/90 hover:text-white rounded-md transition-colors group-hover:bg-white/10">
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
                    </button>
                    <DesktopDropdown items={item.children} />
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href!)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white/90 hover:text-white rounded-md transition-colors hover:bg-white/10"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? (
              <X className="w-6 h-6 text-[#d4a017]" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? 'max-h-[80vh] border-t border-white/10' : 'max-h-0'
          }`}
        >
          <div className="pb-4 pt-2 space-y-0.5">
            {menuItems.map((item, idx) => {
              if (item.children) {
                const isExpanded = expandedMobile === item.label;
                return (
                  <div key={idx}>
                    <button
                      onClick={() => toggleMobile(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#d4a017] transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {/* Submenu items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96 ml-4 border-l-2 border-[#d4a017]/30' : 'max-h-0 ml-4'
                      }`}
                    >
                      {item.children.map((sub, si) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={si}
                            onClick={() => handleNavClick(sub.href)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/[0.07] rounded-md transition-colors"
                          >
                            {SubIcon && (
                              <span className="text-[#d4a017]/70">{SubIcon}</span>
                            )}
                            <div className="text-left">
                              <div className="font-medium">{sub.label}</div>
                              {sub.desc && (
                                <div className="text-[10px] text-white/50 mt-0.5">
                                  {sub.desc}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item.href!)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
