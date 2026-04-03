'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
    href: '/',
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: 'O Conselho',
    icon: <Info className="w-4 h-4" />,
    children: [
      { label: 'Mensagem do Presidente', href: '/paginas/6e83ee50-e486-44e8-b6d7-7a1c1102b0a9', desc: 'Palavras do lider', icon: <Users className="w-4 h-4" /> },
      { label: 'Sobre o Conselho', href: '/paginas/f0e3ce27-6776-44c1-a043-354a74d40509', desc: 'Quem somos', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Galeria de Diretores', href: '/paginas/8547b93c-4d8d-4db0-9b5c-7d1d0ab89bed', desc: 'Nossos diretores', icon: <Users className="w-4 h-4" /> },
      { label: 'Eventos', href: '/paginas/d465ae1c-6287-412b-9222-6b78ab5b083f', desc: 'Proximos eventos', icon: <Calendar className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Servicos',
    icon: <Briefcase className="w-4 h-4" />,
    children: [
      { label: 'Emissao de Licencas', href: '/servicos/641325e6-1e07-442f-9099-175f045dd068', desc: 'Licenca profissional PVC', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Registo de Condutores', href: '/servicos/e0f2332a-93c1-4f43-9318-cea989b2a0ec', desc: 'Inscreva-se agora', icon: <UserPlus className="w-4 h-4" /> },
      { label: 'Formacao Profissional', href: '/servicos/fbf2d960-178e-474a-a9f5-8ac2eb797cf2', desc: 'Cursos e capacitacao', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Consultoria e Apoio Legal', href: '/servicos/7bfad4bd-a923-4eef-a884-e1beaf5b5856', desc: 'Assistencia juridica', icon: <Scale className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Recursos',
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: 'Legislacao', href: '/paginas/5ed2189d-9c81-4b6c-a6bc-d58bc5ada1d9', desc: 'Leis e decretos', icon: <Scale className="w-4 h-4" /> },
      { label: 'Documentos', href: '/paginas/ae5d78e7-eba7-45dc-b7a2-c92e0671f302', desc: 'Formularios e guias', icon: <FileText className="w-4 h-4" /> },
      { label: 'Perguntas Frequentes', href: '/paginas/4c2d8ce4-3473-4125-9366-142d54754025', desc: 'Tire suas duvidas', icon: <HelpCircle className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Noticias',
    href: '/#noticias',
    icon: <Newspaper className="w-4 h-4" />,
  },
  {
    label: 'Consultar Ficha',
    href: '/#consultar',
    icon: <Search className="w-4 h-4" />,
  },
  {
    label: 'Contactos',
    href: '/#contactos',
    icon: <Phone className="w-4 h-4" />,
  },
];

/* ==============================
   DROPDOWN ITEM (reutilizavel)
   ============================== */
function DropdownItems({ items }: { items: SubMenuItem[] }) {
  return (
    <>
      {/* Gold top accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#d4a017] via-[#f0c040] to-[#d4a017]" />
      <div className="p-2">
        {items.map((sub, i) => {
          const Icon = sub.icon;
          return (
            <Link
              key={i}
              href={sub.href}
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
            </Link>
          );
        })}
      </div>
    </>
  );
}

/* ==============================
   DESKTOP DROPDOWN WRAPPER
   ============================== */
function NavDropdown({ item }: { item: MenuItem }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger button */}
      <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white/90 hover:text-white rounded-md transition-colors hover:bg-white/10">
        {item.icon}
        <span>{item.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-all duration-300 ${visible ? 'rotate-180 opacity-100' : 'opacity-60'}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 w-72 rounded-b-xl bg-white shadow-2xl shadow-black/20 border border-gray-100 border-t-0 overflow-hidden z-[60]
          transition-all duration-200 origin-top
          ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <DropdownItems items={item.children!} />
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
      if (window.innerWidth >= 1024) {
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
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#d4a017] rounded-full border-2 border-[#1a5c2e]" />
            </div>

          </button>

          {/* Desktop menu - centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
            {menuItems.map((item) => {
              if (item.children) {
                return (
                  <NavDropdown
                    key={item.label}
                    item={item}
                  />
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white/90 hover:text-white rounded-md transition-colors hover:bg-white/10"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
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
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-96 ml-4 border-l-2 border-[#d4a017]/30' : 'max-h-0 ml-4'
                      }`}
                    >
                      {item.children.map((sub, si) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={si}
                            href={sub.href}
                            onClick={() => { setOpen(false); setExpandedMobile(null); }}
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
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  href={item.href!}
                  onClick={() => { setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
