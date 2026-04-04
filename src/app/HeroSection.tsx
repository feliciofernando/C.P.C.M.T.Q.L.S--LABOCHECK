'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagemBase64: string;
  imagemTipo: string;
  textoBotao: string;
  linkBotao: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ready, setReady] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  // Fetch slides and hero settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesRes, settingsRes] = await Promise.all([
          fetch('/api/slides'),
          fetch('/api/site-settings'),
        ]);

        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          const activeSlides = (slidesData.data || []).filter((s: Slide) => s.activo);
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data?.hero_imagem_base64) {
            const tipo = data.hero_imagem_tipo || 'image/png';
            setHeroImage(`data:${tipo};base64,${data.hero_imagem_base64}`);
          }
        }
      } catch {
        // silent
      } finally {
        setReady(true);
      }
    };
    fetchData();
  }, []);

  // Auto-transition
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, slides[currentIndex]?.tempoTransicao || 5000);
  }, [slides, currentIndex]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
    isPausedRef.current = true;
    setTimeout(() => { isPausedRef.current = false; }, 10000);
  };

  const goPrev = () => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    goToSlide((currentIndex + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  // Loading state
  if (!ready) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <div className="relative z-10 text-center text-white px-4 py-16 sm:py-20 opacity-0">
          <div className="mb-6 inline-block">
            <img src="/logotipo.jpg" alt="" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#d4a017]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider">C.P.C.M.T.Q.L.S</h2>
        </div>
      </section>
    );
  }

  // Static fallback if no slides
  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
      </section>
    );
  }

  // Slideshow
  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden select-none">
      {/* Slide Background Image */}
      {currentSlide?.imagemBase64 && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(data:${currentSlide.imagemTipo || 'image/jpeg'};base64,${currentSlide.imagemBase64})`,
            opacity: isTransitioning ? 0 : 1,
          }}
        />
      )}

      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />

      {/* Slide Content */}
      <div
        className="relative z-10 text-center text-white px-4 py-16 sm:py-20 w-full max-w-4xl lg:max-w-6xl mx-auto transition-all duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
        }}
      >
        {/* Logo on every slide */}
        <div className="mb-6 inline-block">
          <img
            src="/logotipo.jpg"
            alt="Logotipo C.P.C.M.T.Q.L.S"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#d4a017] shadow-[0_0_30px_rgba(212,160,23,0.3)] mx-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-6xl xl:text-7xl font-extrabold tracking-wider drop-shadow-lg mb-3">
          {currentSlide?.titulo || ''}
        </h2>

        {/* Subtitle with gold accents */}
        {currentSlide?.subtitulo && (
          <>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-10 sm:w-16 bg-[#d4a017]/60" />
              <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
              <div className="h-[1px] w-10 sm:w-16 bg-[#d4a017]/60" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#d4a017] mb-2">
              {currentSlide.subtitulo}
            </h3>
          </>
        )}

        {/* Description */}
        {currentSlide?.descricao && (
          <p className="text-sm sm:text-base opacity-90 max-w-2xl mx-auto leading-relaxed font-medium mb-4">
            {currentSlide.descricao}
          </p>
        )}

        {/* CTA Button */}
        {currentSlide?.linkBotao && currentSlide.linkBotao !== '#' && (
          <a
            href={currentSlide.linkBotao}
            className="inline-block mt-3 px-6 py-2.5 bg-[#d4a017] text-[#0f3d1d] font-bold text-sm rounded-full hover:bg-[#e8b82e] transition-colors shadow-lg"
          >
            {currentSlide.textoBotao || 'Saber Mais'}
          </a>
        )}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white flex items-center justify-center transition-all"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white flex items-center justify-center transition-all"
            aria-label="Proximo slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2.5 bg-[#d4a017]'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
    </section>
  );
}
