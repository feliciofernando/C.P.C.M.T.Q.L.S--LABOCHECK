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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <InfoCard
            icon={<Phone className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Contactos"
            lines={['941-000-517', '924-591-350', 'WhatsApp: 941-000-517']}
          />
          <InfoCard
            icon={<MapPin className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Localizacao"
            lines={['Lunda Sul', 'Cassengo, Bairro Social da Juventude', '1o Andar, Centro Comercial do Emporio']}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Horario de Atendimento"
            lines={['Segunda a Sexta', '08:00 - 16:00', 'Decreto Presidencial No 245/15']}
          />
        </div>
      </section>

      {/* Servicos Section */}
      <ServicosSection />

      {/* Consultar Section */}
      <section id="consultar" className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
        <Card className="border-[#d1d1cc] shadow-md">
          <CardHeader className="bg-[#1a5c2e] text-white py-5 px-6 lg:py-6">
            <CardTitle className="text-lg lg:text-xl flex items-center gap-2 justify-center">
              <Search className="w-5 h-5 lg:w-6 lg:h-6" />
              Consultar a Minha Ficha
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <PainelConsultar autoSearch={consultaBI} />
          </CardContent>
        </Card>
      </section>

      {/* Noticias Section */}
      <NoticiasSection />

      {/* Cards Section with blur overlay */}
      <CardsSection />

      {/* Public Footer */}
      <footer id="contactos" className="bg-[#0f3d1d] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 text-center">
          <p className="font-semibold text-sm lg:text-base">C.P.C.M.T.Q.L.S</p>
          <p className="opacity-80 text-xs lg:text-sm mt-1">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
          </p>
          <Separator className="bg-white/20 my-3 max-w-xs mx-auto" />
          <p className="opacity-70 text-xs lg:text-sm">
            Contactos: 941-000-517 / 924-591-350 | WhatsApp: 941-000-517
          </p>
          <p className="opacity-60 text-xs lg:text-sm mt-1">
            Lunda Sul (Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Emporio, vulgo Janota)
          </p>
          <p className="opacity-50 text-xs lg:text-sm mt-2">
            Condutores organizados, transito mais seguro | Decreto Presidencial No 245/15
          </p>
        </div>
      </footer>

      {/* Botao Flutuante WhatsApp */}
      <a
        href={`https://wa.me/244941000517?text=${encodeURIComponent('Saudações! Gostaria de solicitar os vossos serviços. Poderiam atender ao meu pedido?')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar via WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 no-print"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
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
      <CardContent className="p-5 lg:p-6 text-center">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#1a5c2e]">
          {icon}
        </div>
        <h3 className="font-bold text-sm lg:text-lg text-[#1a1a1a] mb-2">{title}</h3>
        {lines.map((line, i) => (
          <p key={i} className="text-xs lg:text-sm text-[#6b6b6b] leading-relaxed">
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
