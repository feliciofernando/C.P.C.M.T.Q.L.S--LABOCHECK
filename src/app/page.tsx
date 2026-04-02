'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  LogOut,
  Shield,
  Phone,
  MapPin,
  Clock,
  Search,
  UserPlus,
  FileText,
  CreditCard,
  Bell,
  Settings,
} from 'lucide-react';

import LoginModal from './LoginModal';
import PainelConsultar from './PainelConsultar';
import FormularioRegisto from './FormularioRegisto';
import PainelVisualizar from './PainelVisualizar';
import LicencaPVC from './LicencaPVC';
import PainelAlertas from './PainelAlertas';
import PainelConfiguracoes from './PainelConfiguracoes';
import HeroSection from './HeroSection';
import NavBar from './NavBar';
import ExploreSection from './ExploreSection';
import { SectionPageContent } from './SectionPages';

interface Stats {
  total: number;
  ativas: number;
  inativas: number;
}

interface AlertCount {
  total: number;
  PENDENTE: number;
  LIDA: number;
  RESOLVIDA: number;
}

/* ==============================
   PUBLIC LANDING PAGE
   ============================== */
function PublicPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const consultaBI = searchParams.get('consulta') || undefined;
  const isAdminRoute = pathname === '/admin';
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (status === 'authenticated' && session) {
    return <AdminDashboard />;
  }

  if (activeSection) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
        <SectionPageContent
          section={activeSection}
          onBack={() => setActiveSection(null)}
        />
      </div>
    );
  }

  const handleNavigate = (section: string) => {
    if (section === 'consultar') {
      const el = document.getElementById('consultar-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Public Header */}
      <header className="bg-[#1a5c2e] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-12 h-12 rounded-full border-2 border-[#d4a017]"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-wide leading-tight">
                C.P.C.M.T.Q.L.S
              </h1>
              <p className="text-[10px] sm:text-xs opacity-90 leading-tight hidden sm:block">
                Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar with Dropdowns */}
      <NavBar onNavigate={handleNavigate} />

      {/* Hero Section */}
      <HeroSection />

      {/* Info Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={<Phone className="w-5 h-5" />}
            title="Contactos"
            lines={['941-000-517', '924-591-350', 'WhatsApp: 941-000-517']}
          />
          <InfoCard
            icon={<MapPin className="w-5 h-5" />}
            title="Localização"
            lines={['Lunda Sul', 'Cassengo, Bairro Social da Juventude', '1o Andar, Centro Comercial do Emporio']}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5" />}
            title="Horario de Atendimento"
            lines={['Segunda a Sexta', '08:00 - 16:00', 'Decreto Presidencial Nº 245/15']}
          />
        </div>
      </section>

      {/* Consultar Section */}
      <section id="consultar-section" className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-[#d1d1cc] shadow-md">
          <CardHeader className="bg-[#1a5c2e] text-white py-5 px-6">
            <CardTitle className="text-lg flex items-center gap-2 justify-center">
              <Search className="w-5 h-5" />
              Consultar a Minha Ficha
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <PainelConsultar autoSearch={consultaBI} />
          </CardContent>
        </Card>
      </section>

      {/* Explore Section - 8 Cards */}
      <ExploreSection onNavigate={handleNavigate} />

      {/* Public Footer */}
      <footer className="bg-[#0f3d1d] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="font-semibold text-sm">C.P.C.M.T.Q.L.S</p>
          <p className="opacity-80 text-xs mt-1">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
          </p>
          <Separator className="bg-white/20 my-3 max-w-xs mx-auto" />
          <p className="opacity-70 text-xs">
            Contactos: 941-000-517 / 924-591-350 | WhatsApp: 941-000-517
          </p>
          <p className="opacity-60 text-xs mt-1">
            Lunda Sul (Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Emporio, vulgo Janota)
          </p>
          <p className="opacity-50 text-xs mt-2">
            Condutores organizados, trânsito mais seguro | Decreto Presidencial Nº 245/15
          </p>
        </div>
      </footer>

      {/* Login Modal - only visible on /admin route */}
      <LoginModal open={isAdminRoute} onOpenChange={() => {}} />
    </>
  );
}

/* ==============================
   ADMIN DASHBOARD
   ============================== */
function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('inscrever');
  const [stats, setStats] = useState<Stats>({ total: 0, ativas: 0, inativas: 0 });
  const [alertCount, setAlertCount] = useState<AlertCount>({ total: 0, PENDENTE: 0, LIDA: 0, RESOLVIDA: 0 });
  const statsLoadedRef = useRef(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/condutores/count');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // silent
    }
  }, []);

  const loadAlertCount = useCallback(async () => {
    try {
      const res = await fetch('/api/alertas/count');
      if (res.ok) {
        const data = await res.json();
        setAlertCount(data);
      }
    } catch {
      // silent
    }
  }, []);

  if (statsLoadedRef.current == null) {
    statsLoadedRef.current = true;
    loadStats();
    loadAlertCount();
  }

  // Refresh alert count periodically
  useEffect(() => {
    const interval = setInterval(loadAlertCount, 60000); // every 60s
    return () => clearInterval(interval);
  }, [loadAlertCount]);

  const handleRegistoSucesso = () => {
    loadStats();
    setActiveTab('visualizar');
    toast.success('Condutor registado com sucesso!');
  };

  const handleAlertCountUpdate = () => {
    loadAlertCount();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Admin Header */}
      <header className="bg-[#1a5c2e] text-white no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-11 h-11 rounded-full border-2 border-[#d4a017]"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight tracking-wide">
                C.P.C.M.T.Q.L.S
              </h1>
              <p className="text-[10px] sm:text-xs opacity-90 leading-tight hidden sm:block">
                Painel Administrativo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto text-sm">
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-xs px-2 py-0.5">
                Total: {stats.total}
              </Badge>
              <Badge className="bg-[#2d7a42] text-white text-xs px-2 py-0.5">
                Activas: {stats.ativas}
              </Badge>
              <Badge className="bg-[#c0392b] text-white text-xs px-2 py-0.5">
                Inactivas: {stats.inativas}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-6 bg-white/30 hidden sm:block" />
            <Badge className="bg-[#d4a017]/20 text-[#d4a017] border border-[#d4a017]/40 text-xs px-2 py-0.5">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-6 mb-6 bg-white border border-[#d1d1cc] h-auto p-1">
            <TabsTrigger
              value="inscrever"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <UserPlus className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Inscrever
            </TabsTrigger>
            <TabsTrigger
              value="visualizar"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Base de Dados
            </TabsTrigger>
            <TabsTrigger
              value="licenca"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <CreditCard className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Licença PVC
            </TabsTrigger>
            <TabsTrigger
              value="alertas"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none relative"
            >
              <Bell className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Alertas
              {alertCount.PENDENTE > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount.PENDENTE > 99 ? '99+' : alertCount.PENDENTE}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="consultar"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Search className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Consultar
            </TabsTrigger>
            <TabsTrigger
              value="configuracoes"
              className="text-sm py-2.5 data-[state=active]:bg-[#1a5c2e] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Settings className="w-4 h-4 mr-1.5 hidden sm:inline" />
              <span className="hidden sm:inline">Configurações</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inscrever">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg">Ficha de Registo do Condutor</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormularioRegisto onSucesso={handleRegistoSucesso} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualizar">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg">Base de Dados - Condutores</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelVisualizar />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Sistema de Alertas - Validade de Licenças
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelAlertas onUpdate={handleAlertCountUpdate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="licenca">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg">Licença Profissional - Cartão PVC</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <LicencaPVC />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultar">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg">Consultar a Minha Ficha</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelConsultar />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <PainelConfiguracoes />
          </TabsContent>
        </Tabs>
      </main>

      {/* Admin Footer */}
      <footer className="bg-[#0f3d1d] text-white no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-xs">
          <p className="font-semibold text-sm">C.P.C.M.T.Q.L.S - Painel Administrativo</p>
          <p className="opacity-60 text-xs mt-1">
            Condutores organizados, trânsito mais seguro | Decreto Presidencial Nº 245/15
          </p>
        </div>
      </footer>
    </>
  );
}

/* ==============================
   INFO CARD (public landing)
   ============================== */
function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <Card className="border-[#d1d1cc] shadow-md bg-white">
      <CardContent className="p-5 text-center">
        <div className="w-10 h-10 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#1a5c2e]">
          {icon}
        </div>
        <h3 className="font-bold text-sm text-[#1a1a1a] mb-2">{title}</h3>
        {lines.map((line, i) => (
          <p key={i} className="text-xs text-[#6b6b6b] leading-relaxed">
            {line}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

/* ==============================
   MAIN PAGE EXPORT
   ============================== */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Suspense>
        <PublicPage />
      </Suspense>
    </div>
  );
}
