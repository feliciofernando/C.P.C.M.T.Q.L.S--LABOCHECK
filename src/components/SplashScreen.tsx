'use client';

import { useState, useEffect, useRef } from 'react';

const SPLASH_MIN_DURATION = 2200;
const SPLASH_MAX_DURATION = 3000;

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  /* ---- sempre visivel a cada carregamento ---- */
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible');

  /* ---- run once on mount only ---- */
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (phase !== 'visible') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const onReady = () => {
      const elapsed = performance.now() - (window as any).__splashStart;
      const remaining = Math.max(0, SPLASH_MIN_DURATION - elapsed);

      /* fade out after remaining time */
      timers.push(
        setTimeout(() => setPhase('fading'), remaining)
      );
      /* fully hidden after fade animation (500ms) */
      timers.push(
        setTimeout(() => {
          setPhase('done');
        }, remaining + 500)
      );
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady);
    }

    /* safety: never exceed max duration */
    timers.push(
      setTimeout(() => {
        setPhase('done');
      }, SPLASH_MAX_DURATION)
    );

    /* cleanup: only remove event listener, NOT the timers */
    return () => {
      window.removeEventListener('load', onReady);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* when done, render children normally */
  if (phase === 'done') return <>{children}</>;

  const isFading = phase === 'fading';

  return (
    <>
      {/* ===== SPLASH SCREEN ===== */}
      <div
        className={`splash-overlay ${isFading ? 'splash-fade-out' : 'splash-fade-in'}`}
        aria-hidden="true"
      >
        {/* blurred gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f3d1d] via-[#1a5c2e] via-[#2d7a42] to-[#e8f5e9] animate-splash-shift" />

        {/* soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,122,66,0.4)_0%,transparent_70%)]" />

        {/* subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          {/* animated spinning circle */}
          <div className="mb-10 relative">
            {/* outer glow ring */}
            <div className="absolute -inset-4 rounded-full animate-splash-pulse opacity-30 bg-gradient-to-tr from-amber-300/40 via-white/20 to-emerald-300/40 blur-md" />

            {/* main spinning circle */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full animate-splash-spin border-[3px] border-white/10 relative overflow-hidden">
              {/* gradient arc */}
              <div className="absolute inset-0 animate-splash-spin rounded-full" style={{
                background: 'conic-gradient(from 0deg, transparent 0%, #facc15 25%, #ffffff 50%, #1a5c2e 75%, transparent 100%)',
              }} />
              {/* inner circle mask */}
              <div className="absolute inset-[3px] rounded-full bg-[#0f3d1d]/80 backdrop-blur-sm" />
              {/* small center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-300 to-white animate-splash-pulse" />
              </div>
            </div>
          </div>

          {/* main title text with yellow-white gradient */}
          <h1 className="splash-title text-center leading-tight max-w-3xl">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e
            Quadriciclos da Lunda Sul
          </h1>

          {/* subtle subtitle */}
          <p className="mt-4 text-white/40 text-xs sm:text-sm tracking-[0.2em] uppercase font-light animate-splash-subtitle">
            C.P.C.M.T.Q.L.S
          </p>
        </div>
      </div>

      {/* ===== ACTUAL CONTENT (hidden behind splash) ===== */}
      <div className={isFading ? '' : 'invisible'}>
        {children}
      </div>
    </>
  );
}

/* ---- record splash start time ASAP ---- */
if (typeof window !== 'undefined') {
  (window as any).__splashStart = (window as any).__splashStart || performance.now();
}
