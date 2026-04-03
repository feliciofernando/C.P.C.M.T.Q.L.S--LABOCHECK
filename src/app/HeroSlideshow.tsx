'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  linkBotao: string;
  imagemBase64: string;
  imagemTipo: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
}

export default function HeroSlideshow() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch slides
  useEffect(() => {
    fetch('/api/slides')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data && Array.isArray(data.data)) {
          setSlides(data.data);
        }
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  // Auto-play
  const goToNext = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    if (slides.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 400);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused || isHovering || slides.length <= 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentSlide = slides[currentIndex];
    const timeout = currentSlide?.tempoTransicao || 5000;

    timerRef.current = setTimeout(goToNext, timeout);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, isHovering, slides, goToNext]);

  // Loading state
  if (!loaded) {
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

  // Fallback if no slides
  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden bg-[#0f3d1d]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d1d]/55 via-[#1a5c2e]/45 to-[#0f3d1d]/65" />
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

  const currentSlide = slides[currentIndex];
  const backgroundImage = currentSlide?.imagemBase64
    ? `data:${currentSlide.imagemTipo || 'image/png'};base64,${currentSlide.imagemBase64}`
    : null;

  return (
    <section
      className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60 z-20" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          opacity: isTransitioning ? 0 : 1,
        }}
      />

      {/* Green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d1d]/70 via-[#1a5c2e]/50 to-[#0f3d1d]/75" />
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content */}
      <div
        className="relative z-10 text-center text-white px-4 py-16 sm:py-20 max-w-4xl mx-auto transition-all duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider drop-shadow-lg leading-tight">
          {currentSlide?.titulo}
        </h2>
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-[1px] w-12 sm:w-20 bg-[#d4a017]/60" />
          <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
          <div className="h-[1px] w-12 sm:w-20 bg-[#d4a017]/60" />
        </div>
        <p className="text-sm sm:text-base lg:text-lg opacity-95 max-w-3xl mx-auto leading-relaxed font-medium">
          {currentSlide?.subtitulo}
        </p>
        {currentSlide?.textoBotao && currentSlide.textoBotao.trim() && (
          <p className="mt-8 text-sm sm:text-base lg:text-lg font-semibold tracking-widest uppercase text-[#d4a017] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            {currentSlide.textoBotao}
          </p>
        )}
      </div>

      {/* Left/Right Arrow Buttons */}
      <button
        onClick={goToPrev}
        className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
        aria-label="Proximo slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-3 bg-[#d4a017]'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60 z-20" />
    </section>
  );
}
