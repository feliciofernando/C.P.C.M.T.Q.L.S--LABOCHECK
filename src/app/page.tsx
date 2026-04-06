'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Phone,
  MapPin,
  Clock,
  Search,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';

import PainelConsultar from './PainelConsultar';
import HeroSlideshow from './HeroSlideshow';
import Navbar from './Navbar';
import NoticiasSection from './NoticiasSection';
import ServicosSection from './ServicosSection';
import CardsSection from './CardsSection';

/* ==============================
   TYPES
   ============================== */
type ActiveDialog = 'contactos' | 'localizacao' | 'horario' | null;

/* ==============================
   WHATSAPP URL
   ============================== */
const WHATSAPP_URL =
  'https://wa.me/244941000517?text=Sauda%C3%A7%C3%B5es!%20Gostaria%20de%20solicitar%20os%20vossos%20servi%C3%A7os.%20Poderiam%20atender%20ao%20meu%20pedido%3F';

/* ==============================
   PUBLIC LANDING PAGE
   ============================== */
function PublicPage() {
  const searchParams = useSearchParams();
  const consultaBI = searchParams.get('consulta') || undefined;
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

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
            onClick={() => setActiveDialog('contactos')}
          />
          <InfoCard
            icon={<MapPin className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Localização"
            lines={['Lunda Sul', 'Cassengo, Bairro Social da Juventude', '1º Andar, Centro Comercial do Empório']}
            onClick={() => setActiveDialog('localizacao')}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5 lg:w-6 lg:h-6" />}
            title="Horário de Atendimento"
            lines={['Segunda a Sexta', '08:00 - 16:00', 'Decreto Presidencial Nº 245/15']}
            onClick={() => setActiveDialog('horario')}
          />
        </div>
      </section>

      {/* ============================
         DIALOGS
         ============================ */}

      {/* ---- Contactos Dialog ---- */}
      <Dialog
        open={activeDialog === 'contactos'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden border-[#d1d1cc]">
          {/* Green header bar */}
          <div className="bg-gradient-to-r from-[#1a5c2e] to-[#237a3e] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              Contactos
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Entre em contacto connosco
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            {/* Phone 1 */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f5f0]">
              <div className="w-10 h-10 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#1a5c2e]" />
              </div>
              <div>
                <p className="text-xs text-[#6b6b6b] font-medium">Telefone Principal</p>
                <p className="text-base font-semibold text-[#1a1a1a]">941-000-517</p>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f5f0]">
              <div className="w-10 h-10 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#1a5c2e]" />
              </div>
              <div>
                <p className="text-xs text-[#6b6b6b] font-medium">Telefone Alternativo</p>
                <p className="text-base font-semibold text-[#1a1a1a]">924-591-350</p>
              </div>
            </div>

            {/* WhatsApp button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar Mensagem no WhatsApp
            </a>

            <p className="text-center text-xs text-[#6b6b6b]">
              Resposta rápida via WhatsApp
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- Localização Dialog ---- */}
      <Dialog
        open={activeDialog === 'localizacao'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-0 overflow-hidden border-[#d1d1cc]">
          {/* Green header bar */}
          <div className="bg-gradient-to-r from-[#1a5c2e] to-[#237a3e] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              Localização
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Venha-nos visitar
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            {/* Address details */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#1a5c2e]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">Lunda Sul</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <ExternalLink className="w-4 h-4 text-[#1a5c2e]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">Cassengo, Bairro Social da Juventude</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#1a5c2e]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">1º Andar, Centro Comercial do Empório</p>
                </div>
              </div>
            </div>

            <Separator className="bg-[#e5e5e0]" />

            {/* Map embed */}
            <div className="rounded-xl overflow-hidden border border-[#d1d1cc] shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126832.60649635!2d20.2!3d-10.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a5e2e3c4d5f6e7f%3A0x0!2sCassengo%2C%20Lunda%20Sul%2C%20Angola!5e0!3m2!1spt-BR!2sao!4v1700000000000!5m2!1spt-BR!2sao"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização C.P.C.M.T.Q.L.S"
                className="w-full"
              />
            </div>

            <p className="text-center text-xs text-[#6b6b6b]">
              Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Empório
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- Horário Dialog ---- */}
      <Dialog
        open={activeDialog === 'horario'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden border-[#d1d1cc]">
          {/* Green header bar */}
          <div className="bg-gradient-to-r from-[#1a5c2e] to-[#237a3e] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              Horário de Atendimento
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              Quando pode nos visitar
            </DialogDescription>
          </div>

          <div className="p-6 space-y-5">
            {/* Main schedule card */}
            <div className="bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#1a5c2e] animate-pulse" />
                <span className="text-xs font-semibold text-[#1a5c2e] uppercase tracking-wider">Aberto Agora</span>
              </div>
              <p className="text-2xl font-bold text-[#1a5c2e]">08:00 — 16:00</p>
              <p className="text-sm text-[#2e7d32] mt-1">Segunda a Sexta</p>
            </div>

            {/* Week breakdown */}
            <div className="space-y-2.5">
              {[
                { day: 'Segunda', hours: '08:00 - 16:00', open: true },
                { day: 'Terça', hours: '08:00 - 16:00', open: true },
                { day: 'Quarta', hours: '08:00 - 16:00', open: true },
                { day: 'Quinta', hours: '08:00 - 16:00', open: true },
                { day: 'Sexta', hours: '08:00 - 16:00', open: true },
                { day: 'Sábado', hours: 'Fechado', open: false },
                { day: 'Domingo', hours: 'Fechado', open: false },
              ].map((row) => (
                <div
                  key={row.day}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                    row.open
                      ? 'bg-[#f5f5f0]'
                      : 'bg-red-50'
                  }`}
                >
                  <span className={`font-medium ${row.open ? 'text-[#1a1a1a]' : 'text-[#b91c1c]'}`}>
                    {row.day}
                  </span>
                  <span
                    className={`font-semibold ${
                      row.open ? 'text-[#1a5c2e]' : 'text-[#b91c1c]'
                    }`}
                  >
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-[#e5e5e0]" />

            {/* Legal reference */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f5f0]">
              <div className="w-8 h-8 bg-[#1a5c2e]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#1a5c2e]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>
              <div>
                <p className="text-xs text-[#6b6b6b]">Fundamentação Legal</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">Decreto Presidencial Nº 245/15</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            Lunda Sul (Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Empório, vulgo Janota)
          </p>
          <p className="opacity-50 text-xs lg:text-sm mt-2">
            Condutores organizados, trânsito mais seguro | Decreto Presidencial Nº 245/15
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
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="border-[#d1d1cc] shadow-md bg-white cursor-pointer
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-xl hover:border-[#1a5c2e]/30
        hover:bg-gradient-to-br hover:from-white hover:to-[#e8f5e9]/30
        active:translate-y-0 active:shadow-md
        group"
    >
      <CardContent className="p-5 lg:p-6 text-center">
        <div
          className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1a5c2e]/10 rounded-full
            flex items-center justify-center mx-auto mb-3 text-[#1a5c2e]
            transition-all duration-300
            group-hover:bg-[#1a5c2e] group-hover:text-white
            group-hover:scale-110 group-hover:shadow-lg"
        >
          {icon}
        </div>
        <h3 className="font-bold text-sm lg:text-lg text-[#1a1a1a] mb-2 group-hover:text-[#1a5c2e] transition-colors duration-300">
          {title}
        </h3>
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
