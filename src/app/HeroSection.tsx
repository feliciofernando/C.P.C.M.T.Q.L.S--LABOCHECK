'use client';

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.hero_imagem_base64) {
          const tipo = data.hero_imagem_tipo || 'image/png';
          setHeroImage(`data:${tipo};base64,${data.hero_imagem_base64}`);
        }
        setReady(true);
      })
      .catch(() => {
        setReady(true);
      });
  }, []);

  // Enquanto carrega, mostra apenas o fundo verde (sem imagem)
  if (!ready) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden bg-[#0f3d1d]">
        <div className="relative z-10 text-center text-white px-4 py-16 sm:py-20 opacity-0">
          <div className="mb-6 inline-block">
            <img src="/logotipo.jpg" alt="" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#d4a017]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider">C.P.C.M.T.Q.L.S</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Background Image - somente se houver no Supabase */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
      {/* Green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d1d]/55 via-[#1a5c2e]/45 to-[#0f3d1d]/65" />
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-16 sm:py-20">
        <div className="mb-6 inline-block">
          <img
            src="/logotipo.jpg"
            alt="Logotipo C.P.C.M.T.Q.L.S"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#d4a017] shadow-[0_0_30px_rgba(212,160,23,0.3)] mx-auto"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider drop-shadow-lg">
          C.P.C.M.T.Q.L.S
        </h2>
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-[1px] w-12 sm:w-20 bg-[#d4a017]/60" />
          <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
          <div className="h-[1px] w-12 sm:w-20 bg-[#d4a017]/60" />
        </div>
        <p className="text-sm sm:text-base lg:text-lg opacity-95 max-w-3xl mx-auto leading-relaxed font-medium">
          Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
        </p>
        <p className="text-sm sm:text-base mt-5 opacity-80 italic max-w-xl mx-auto font-light tracking-wide">
          &quot;Condutores organizados, transito mais seguro&quot;
        </p>
      </div>

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
    </section>
  );
}
