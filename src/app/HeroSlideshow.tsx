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

  // Loading state — green alegre style
  if (!loaded) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
        {/* Light green gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#dcedc8]" />
        {/* Decorative blurred circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#a5d6a7]/30 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#c8e6c9]/40 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#dcedc8]/50 blur-3xl" />
        {/* Green accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a5c2e]/40 to-transparent z-20" />
        <div className="relative z-10 text-center text-[#1a3a24] px-4 py-16 sm:py-20 opacity-0">
          <div className="mb-6 inline-block">
            <img src="/logotipo.jpg" alt="" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#1a5c2e]/20" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider">C.P.C.M.T.Q.L.S</h2>
        </div>
      </section>
    );
  }

  // Fallback if no slides — green alegre style
  if (slides.length === 0) {
    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
        {/* Light green gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#dcedc8]" />
        {/* Decorative blurred circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#a5d6a7]/30 blur-3xl" />
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#c8e6c9]/40 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#dcedc8]/50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#e8f5e9]/60 blur-3xl" />
        </div>
        {/* Green accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a5c2e]/40 to-transparent z-20" />

        <div className="relative z-10 text-center text-[#1a3a24] px-4 py-16 sm:py-20">
          <div className="mb-6 inline-block">
            <img
              src="/logotipo.jpg"
              alt="Logotipo C.P.C.M.T.Q.L.S"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#1a5c2e]/20 shadow-lg shadow-green-900/10 mx-auto"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-[#1a3a24]">
            C.P.C.M.T.Q.L.S
          </h2>
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="block w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#1a5c2e]/40" />
            <span className="block w-2.5 h-2.5 rounded-full bg-[#1a5c2e]" />
            <span className="block w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#1a5c2e]/40" />
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-[#4a6b54] max-w-3xl mx-auto leading-relaxed font-medium">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
          </p>
          <p className="text-sm sm:text-base mt-5 text-[#4a6b54]/70 italic max-w-xl mx-auto font-light tracking-wide">
            &quot;Condutores organizados, trânsito mais seguro&quot;
          </p>
        </div>
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
      {/* Green accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a5c2e]/40 to-transparent z-20" />

      {/* Background Image (slide) */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: isTransitioning ? 0 : 1,
          }}
        />
      )}

      {/* Light green blur overlay on top of image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/15" />
      )}

      {/* Light green gradient (always present as base) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9]/90 to-[#dcedc8] transition-opacity duration-500 ${
          backgroundImage ? 'opacity-60' : 'opacity-100'
        }`}
      />

      {/* Subtle decorative blurred circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#a5d6a7]/30 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#c8e6c9]/40 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#dcedc8]/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#e8f5e9]/60 blur-3xl" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center text-[#1a3a24] px-4 py-16 sm:py-20 lg:max-w-6xl max-w-4xl mx-auto transition-all duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-wider text-[#1a3a24] leading-tight">
          {currentSlide?.titulo}
        </h2>
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="block w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#1a5c2e]/40" />
          <span className="block w-2.5 h-2.5 rounded-full bg-[#1a5c2e]" />
          <span className="block w-16 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#1a5c2e]/40" />
        </div>
        <p className="text-base sm:text-lg lg:text-2xl xl:text-3xl text-[#4a6b54] max-w-3xl lg:max-w-5xl mx-auto leading-relaxed font-medium">
          {currentSlide?.subtitulo}
        </p>
      </div>

      {/* Left/Right Arrow Buttons */}
      <button
        onClick={goToPrev}
        className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1a5c2e]/10 hover:bg-[#1a5c2e]/20 text-[#1a5c2e] flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1a5c2e]/10 hover:bg-[#1a5c2e]/20 text-[#1a5c2e] flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
        aria-label="Próximo slide"
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
                  ? 'w-8 h-3 bg-[#1a5c2e]'
                  : 'w-3 h-3 bg-[#1a5c2e]/25 hover:bg-[#1a5c2e]/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a5c2e]/30 to-transparent z-10" />
    </section>
  );
}
