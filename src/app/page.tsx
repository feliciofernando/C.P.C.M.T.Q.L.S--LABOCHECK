'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  MapPin,
  Clock,
  Search,
} from 'lucide-react';

import PainelConsultar from './PainelConsultar';
import HeroSlideshow from './HeroSlideshow';
import Navbar from './Navbar';
import NoticiasSection from './NoticiasSection';
import ServicosSection from './ServicosSection';
import CardsSection from './CardsSection';

/* ==============================
   PUBLIC LANDING PAGE
   ============================== */
function PublicPage() {
  const searchParams = useSearchParams();
  const consultaBI = searchParams.get('consulta') || undefined;

  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <div id="inicio">
        <HeroSlideshow />
      </div>

      {/* Info Cards */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={<Phone className="w-5 h-5" />}
            title="Contactos"
            lines={['941-000-517', '924-591-350', 'WhatsApp: 941-000-517']}
          />
          <InfoCard
            icon={<MapPin className="w-5 h-5" />}
            title="Localizacao"
            lines={['Lunda Sul', 'Cassengo, Bairro Social da Juventude', '1o Andar, Centro Comercial do Emporio']}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5" />}
            title="Horario de Atendimento"
            lines={['Segunda a Sexta', '08:00 - 16:00', 'Decreto Presidencial No 245/15']}
          />
        </div>
      </section>

      {/* Servicos Section */}
      <ServicosSection />

      {/* Consultar Section */}
      <section id="consultar" className="max-w-4xl mx-auto px-4 py-12">
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

      {/* Cards Section with blur overlay */}
      <CardsSection />

      {/* Noticias Section */}
      <NoticiasSection />

      {/* Public Footer */}
      <footer id="contactos" className="bg-[#0f3d1d] text-white mt-auto">
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
            Condutores organizados, transito mais seguro | Decreto Presidencial No 245/15
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
