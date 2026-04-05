'use client';

import { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  LogOut,
  Phone,
  MapPin,
  Clock,
  Search,
  UserPlus,
  FileText,
  Bell,
  Settings,
  Newspaper,
  Briefcase,
  LayoutGrid,
  Loader2,
  ShieldCheck,
  Image as ImageIcon,
  Play,
  CircleDot,
  ClipboardList,
  Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import PainelConsultar from '../PainelConsultar';
import FormularioRegisto from '../FormularioRegisto';
import PainelVisualizar from '../PainelVisualizar';
import PainelAlertas from '../PainelAlertas';
import PainelConfiguracoes from '../PainelConfiguracoes';
import PainelNoticias from '../PainelNoticias';
import PainelServicos from '../PainelServicos';
import AdminCards from '../AdminCards';
import PainelHeroSlides from '../PainelHeroSlides';
import PainelLogs from '../PainelLogs';

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

interface OnlineAdmin {
  admin_id: string;
  admin_username: string;
  admin_nome: string;
  login_at: string;
  last_heartbeat: string;
}

/* ==============================
   LOGIN FORM (inline, não modal)
   ============================== */
function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Credenciais invalidas');
        setPassword('');
      } else {
        toast.success('Sessao iniciada com sucesso');
        setUsername('');
        setPassword('');
        // Recarregar a pagina para mostrar o dashboard
        window.location.replace('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Erro ao iniciar sessao. Verifique a sua ligacao.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] px-4">
      <Card className="w-full max-w-md border-[#d1d1cc] shadow-lg">
        <CardHeader className="bg-[#1a5c2e] text-white py-6 px-6">
          <CardTitle className="text-lg flex items-center gap-2 justify-center">
            <ShieldCheck className="w-6 h-6" />
            Acesso Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <img
              src="/logotipo.jpg"
              alt="C.P.C.M.T.Q.L.S"
              className="w-16 h-16 rounded-full border-2 border-[#d4a017] mx-auto mb-3"
            />
            <h2 className="text-base font-bold text-[#1a1a1a]">C.P.C.M.T.Q.L.S</h2>
            <p className="text-xs text-[#6b6b6b] mt-1">Painel de Gestao - Lunda Sul</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-user">Utilizador</Label>
              <Input
                id="admin-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Utilizador"
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Palavra-passe</Label>
              <Input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Palavra-passe"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 mr-2" />
              )}
              {loading ? 'A verificar...' : 'Entrar'}
            </Button>
          </form>
          <p className="text-[10px] text-center text-[#6b6b6b] mt-4">
            Acesso restrito a administradores autorizados
          </p>
        </CardContent>
      </Card>
    </div>
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
  const [onlineAdmins, setOnlineAdmins] = useState<OnlineAdmin[]>([]);
  const statsLoadedRef = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const loadOnlineAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/online');
      if (res.ok) {
        const data = await res.json();
        setOnlineAdmins(data.online || []);
      }
    } catch {
      // silent
    }
  }, []);

  // Heartbeat: register current admin as online
  const sendHeartbeat = useCallback(async () => {
    const name = session?.user?.name;
    if (!name) return;
    try {
      await fetch('/api/admin/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: name,
          adminNome: name,
        }),
      });
      // Also refresh online list
      loadOnlineAdmins();
    } catch {
      // silent
    }
  }, [session, loadOnlineAdmins]);

  if (statsLoadedRef.current == null) {
    statsLoadedRef.current = true;
    loadStats();
    loadAlertCount();
  }

  // Refresh alert count periodically
  useEffect(() => {
    const interval = setInterval(loadAlertCount, 60000);
    return () => clearInterval(interval);
  }, [loadAlertCount]);

  // Heartbeat every 15 seconds
  useEffect(() => {
    const id = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(id);
  }, [sendHeartbeat]);

  const handleRegistoSucesso = () => {
    loadStats();
    setActiveTab('visualizar');
    toast.success('Condutor registado com sucesso!');
  };

  const handleAlertCountUpdate = () => {
    loadAlertCount();
  };

  const handleLogout = async () => {
    const adminName = session?.user?.name || 'admin';

    // Remove online status
    try {
      await fetch(`/api/admin/online?username=${encodeURIComponent(adminName)}`, { method: 'DELETE' });
    } catch {
      // silent
    }

    // Log logout
    try {
      await fetch('/api/admin/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: adminName,
          adminNome: adminName,
          acao: 'LOGOUT',
          categoria: 'AUTENTICACAO',
          detalhes: 'Fim de sessao no painel administrativo',
        }),
      });
    } catch {
      // silent
    }

    // Clear cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('next-auth') || name.startsWith('__Secure-next-auth')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    // Clear heartbeat
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    await signOut({ redirect: false });
    window.location.replace('/');
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
          <div className="flex items-center gap-3 sm:ml-auto text-sm flex-wrap justify-center">
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

            {/* Online Admins */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                </span>
                <div className="flex items-center gap-1.5">
                  {onlineAdmins.length > 0 ? (
                    <>
                      <span className="text-xs font-medium text-white/90">
                        {onlineAdmins.map(a => a.admin_nome).join(' · ')}
                      </span>
                      {onlineAdmins.length > 1 && (
                        <span className="text-[10px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {onlineAdmins.length} online
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-medium text-white/90">
                      {session?.user?.name || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            </div>

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

      {/* Admin Nav */}
      <nav className="bg-[#0f3d1d] text-white no-print sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center overflow-x-auto no-scrollbar gap-1 py-1">
            <NavButton active={activeTab === 'slides'} onClick={() => setActiveTab('slides')} icon={<Play className="w-5 h-5" />} label="Slides" />
            <NavButton active={activeTab === 'inscrever'} onClick={() => setActiveTab('inscrever')} icon={<UserPlus className="w-5 h-5" />} label="Inscrever" />
            <NavButton active={activeTab === 'visualizar'} onClick={() => setActiveTab('visualizar')} icon={<FileText className="w-5 h-5" />} label="Base de Dados" />
            <NavButton active={activeTab === 'alertas'} onClick={() => setActiveTab('alertas')} icon={<Bell className="w-5 h-5" />} label="Alertas" badge={alertCount.PENDENTE > 0 ? alertCount.PENDENTE : undefined} />
            <NavButton active={activeTab === 'consultar'} onClick={() => setActiveTab('consultar')} icon={<Search className="w-5 h-5" />} label="Consultar" />
            <NavButton active={activeTab === 'noticias'} onClick={() => setActiveTab('noticias')} icon={<Newspaper className="w-5 h-5" />} label="Noticias" />
            <NavButton active={activeTab === 'servicos'} onClick={() => setActiveTab('servicos')} icon={<Briefcase className="w-5 h-5" />} label="Servicos" />
            <NavButton active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} icon={<LayoutGrid className="w-5 h-5" />} label="Cards" />
            <NavButton active={activeTab === 'registos'} onClick={() => setActiveTab('registos')} icon={<ClipboardList className="w-5 h-5" />} label="Registos" />
            <NavButton active={activeTab === 'configuracoes'} onClick={() => setActiveTab('configuracoes')} icon={<Settings className="w-5 h-5" />} label="Config" />
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="slides">
            <PainelHeroSlides />
          </TabsContent>

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
                  Sistema de Alertas - Validade de Licencas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelAlertas onUpdate={handleAlertCountUpdate} />
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

          <TabsContent value="noticias">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  Gestao de Noticias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelNoticias />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicos">
            <Card className="border-[#d1d1cc] shadow-sm">
              <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Gestao de Servicos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PainelServicos />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards">
            <AdminCards />
          </TabsContent>

          <TabsContent value="registos">
            <PainelLogs />
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
            Condutores organizados, transito mais seguro | Decreto Presidencial No 245/15
          </p>
        </div>
      </footer>
    </>
  );
}

/* ==============================
   ADMIN NAV BUTTON
   ============================== */
function NavButton({ active, onClick, icon, label, badge }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-[#1a5c2e] text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

/* ==============================
   MAIN ADMIN PAGE
   ============================== */
export default function AdminPage() {
  const { data: session, status } = useSession();

  // Se esta a carregar a sessao, mostrar loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e] mx-auto" />
          <p className="text-sm text-[#6b6b6b] mt-3">A carregar...</p>
        </div>
      </div>
    );
  }

  // Se nao esta autenticado, mostrar o formulario de login
  if (status === 'unauthenticated' || !session) {
    return <AdminLoginForm />;
  }

  // Se esta autenticado, mostrar o dashboard
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <AdminDashboard />
    </div>
  );
}
