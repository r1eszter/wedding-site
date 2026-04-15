"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- ADATOK ---
type TimelineItem = {
  time: string;
  title: string;
  subtitle?: string;
  icon: string;
};

const timeline: TimelineItem[] = [
  { time: "13:00", title: "Polgári szertartás", subtitle: "Miskolci Városháza", icon: "💍" },
  { time: "16:00", title: "Vendégváró", subtitle: "Nagyvisnyó", icon: "🍷" },
  { time: "17:00", title: "Szertartás", subtitle: "A történet folytatódik", icon: "✨" },
  { time: "18:00", title: "Vacsora", subtitle: "Lakoma", icon: "🍽️" },
  { time: "19:00", title: "Ajándék / Fotózás", subtitle: "Emlékek és pillanatok", icon: "📷" },
  { time: "20:00", title: "Ünneplés", subtitle: "Mulatság hajnalig", icon: "🔥" },
];

const miskolcMapsUrl = "https://www.google.com/maps/search/?api=1&query=Miskolci+V%C3%A1rosh%C3%A1za";
const borokaMapsUrl = "https://www.google.com/maps/search/?api=1&query=Bor%C3%B3ka+T%C3%A1bor+Nagyvisny%C3%B3";

export default function Home() {
  // --- ÁLLAPOTOK ---
  const [isOpen, setIsOpen] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // --- REF-EK ---
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null); // Bal oldali boríték fél
  const rightPartRef = useRef<HTMLDivElement>(null); // Jobb oldali boríték fél
  const sealRef = useRef<HTMLButtonElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);

  // Mobil ellenőrzés
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- NYITÁSI ANIMÁCIÓ ---
  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setShowMainContent(true);
      },
    });

    // 1. Pecsét és szöveg eltűnik
    tl.to([sealRef.current, introTextRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in",
    })
    // 2. A két oldal szétcsúszik balra és jobbra
    .to(leftPartRef.current, {
      xPercent: -100,
      duration: 1,
      ease: "power3.inOut"
    })
    .to(rightPartRef.current, {
      xPercent: 100,
      duration: 1,
      ease: "power3.inOut"
    }, "<"); // A két mozgás egyszerre történik
  };

  // --- GÖRDÜLÉSI ANIMÁCIÓK (ScrollTrigger) ---
  useEffect(() => {
    if (!showMainContent || !isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-card", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: ".hero-panel", start: "top 80%" } }
      );
      // Itt tarthatod a többi szekció (map, timeline) animációját...
    }, containerRef);

    return () => ctx.revert();
  }, [showMainContent, isMobile]);

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#140d09] text-[#f2dfc2] p-10 text-center">
        <div>
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Ez a meghívó telefonra készült</h1>
          <p className="opacity-80">Kérlek, mobiltelefonon nyisd meg! 📱</p>
        </div>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="relative overflow-x-hidden bg-[#140d09]">
      
      {/* --- INTRO RÉTEG (Boríték szétnyílása) --- */}
      {!isOpen && (
        <div className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none">
          
          {/* Bal fél javított árnyékkal és vignettával */}
          <div 
            ref={leftPartRef}
            className="relative w-1/2 h-full bg-cover bg-center pointer-events-auto"
            style={{ 
              backgroundImage: "url('/intro.png')",
            }}
          >
            {/* Sötétítő réteg a széleken */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          </div>


          {/* Jobb fél */}
          <div 
            ref={rightPartRef}
            className="relative w-1/2 h-full bg-cover bg-center pointer-events-auto"
            style={{ 
              backgroundImage: "url('/intro.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-transparent" />
          </div>


          {/* Középső tartalom (Pecsét és felirat) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <button
              ref={sealRef}
              onClick={handleOpen}
              className="w-44 h-44 active:scale-95 transition-transform drop-shadow-2xl pointer-events-auto"
            >
              <img src="/seal.png" alt="Pecsét" className="w-full h-full object-contain" />
            </button>

            <div ref={introTextRef} className="mt-10 text-center pointer-events-auto">
              <button
                onClick={handleOpen}
                className="w-[280px] transition-transform duration-300 hover:scale-105 active:scale-95 ease-out"
              >
                <img 
                  src="/title.png" 
                  alt="Törd meg a pecsétet" 
                  className="w-full h-auto drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FŐ TARTALOM --- */}
      {showMainContent && (
        <div className="animate-in fade-in duration-1000">

          {/* HERO */}
          <section className="relative min-h-screen w-full flex items-center justify-center px-5 py-8 overflow-hidden">
            {/* Háttér - Teljes papír textúra Elden Ring stílusú árnyékolással */}
            <div className="fixed inset-0 z-0">
              {/* Az alap textúra - magasabb opacitással, hogy ez legyen a fő látvány */}
              <div
                className="absolute inset-0 bg-cover bg-center brightness-[0.7] sepia-[0.15]"
                style={{ backgroundImage: "url('/paper-texture.jpg')" }}
              />
            </div>

            {/* Meghívó panel */}
            <div className="relative z-10 w-full max-w-[370px]">

              <div
                className="relative overflow-hidden rounded-[3px] px-7 pt-12 pb-12 text-center"
              >

                {/* mini heading */}
                <p
                  className="text-[9px] tracking-[0.34em] uppercase text-[#422e1d] opacity-75 mb-8"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ✧ A Szövetség Megköttetik ✧
                </p>

                {/* fő név */}
                <h1
                  className="text-[42px] leading-[1.02] text-[#422e1d] mb-6"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Eszter & Péter
                </h1>

                {/* díszítő sor */}
                <div className="flex items-center justify-center gap-3 mb-7">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#241a11]/70" />
                  <div className="w-[6px] h-[6px] rotate-45 border border-[#241a11]/70" />
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#241a11]/70" />
                </div>

                {/* dátum */}
                <p
                  className="text-[21px] tracking-[0.10em] uppercase text-[#4e3424] mb-8"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  2026.10.03
                </p>

                {/* második díszítő sor */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="h-[1px] w-10 bg-[#241a11]/28" />
                  <div className="text-[#241a11]/55 text-[11px]">✦</div>
                  <div className="h-[1px] w-10 bg-[#241a11]/28" />
                </div>

                {/* idézet */}
                <div className="text-[#36281d] italic text-[17px] leading-[1.9]">
                  <p>„Két út találkozott...”</p>
                  <p>„Egy közös történet kezdődött...”</p>
                </div>

                {/* scroll hint */}
                <div
                  className="mt-10 text-[13px] tracking-[0.18em] text-[#4a3626] opacity-80"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  -- Görgess tovább --
                </div>
              </div>
            </div>
          </section>



          {/* TÉRKÉP SZEKCIÓ (Az eredeti kódból maradt) */}
          <section className="map-panel relative h-screen w-full overflow-hidden">
            <div
              className="map-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/map.jpg')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.18),rgba(20,13,9,0.28),rgba(20,13,9,0.42))]" />
            <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.36)]" />

            <div className="relative z-10 h-full flex items-center justify-center px-4">
              <div className="map-card relative w-full max-w-[365px] rounded-sm border border-[#7d5a39]/30 bg-[#ead5b3]/72 backdrop-blur-[1px] px-4 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
                <h2
                  className="text-center text-[#4a2f1d] text-[28px] mb-4"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  A Térkép
                </h2>

                <div className="relative h-[430px] rounded-sm overflow-hidden border border-[#8b633d]/25 bg-[#d8bc92]/35">
                  <img
                    src="/map.jpg"
                    alt="Térkép"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,240,215,0.06),transparent,rgba(20,13,9,0.1))]" />

                  <a
                    href={miskolcMapsUrl}
                    className="floating-place float-miskolc animate-float absolute block w-[160px] left-[18px] top-[140px] active:scale-95 transition-transform"
                  >
                    <img src="/miskolc.jpg" alt="Miskolci Városháza" className="w-full h-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.45)]" />
                  </a>

                  <a
                    href={borokaMapsUrl}
                    className="floating-place float-boroka animate-float-delayed absolute block w-[148px] right-[18px] top-[270px] active:scale-95 transition-transform"
                  >
                    <img src="/boroka.jpg" alt="Boróka Tábor" className="w-full h-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.45)]" />
                  </a>
                </div>

                <p className="mt-4 text-center text-[#5b3a25] text-sm leading-relaxed">
                  Érintsd meg a helyszíneket a pontos útvonalhoz.
                </p>
              </div>
            </div>
          </section>
          


          {/* MENETREND SZEKCIÓ (Az eredeti kódból maradt) */}
          <section className="quest-panel relative min-h-[175vh] w-full overflow-hidden">
            <div
              className="quest-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/story-landscape.jpg')" }}
            />
            <div className="quest-glow absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,180,90,0.10),transparent_35%),linear-gradient(to_bottom,rgba(20,13,9,0.28),rgba(20,13,9,0.42),rgba(20,13,9,0.72))]" />
            <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.45)]" />

            <div className="relative z-10 px-5 pt-20 pb-20">
              <div className="max-w-[360px] mx-auto">
                <h2
                  className="quest-title text-center text-[#f6e5ca] text-[30px] mb-8"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  A Küldetés Menete
                </h2>

                <div className="relative pl-5">
                  <div className="absolute left-[10px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-[#8b5d37] via-[#d6a06f] to-[#8b5d37]" />

                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div
                        key={`${item.time}-${index}`}
                        className="timeline-item relative rounded-sm border border-[#8a603b]/30 bg-[#1f140d]/50 backdrop-blur-[1px] px-4 py-4 ml-4"
                      >
                        <div className="absolute -left-[18px] top-6 w-3 h-3 rounded-full bg-[#f3c188] border border-[#f8e3c2] shadow-[0_0_16px_rgba(255,168,90,0.45)]" />
                        <div className="flex gap-3">
                          <div className="text-2xl leading-none mt-1">{item.icon}</div>
                          <div>
                            <p
                              className="text-[#f8e7ce] text-lg"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              {item.time}
                            </p>
                            <p className="text-[#f5e0c3] text-base leading-snug">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className="text-[#d7b38d] text-sm mt-1 opacity-90">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-[#ecd0ac] text-sm mt-7 tracking-wide">
                  Visszajelzés határideje: 2026.08.15
                </p>

                <div className="h-20" />

                <div className="rsvp-card w-full text-center border border-[#8b633d]/30 bg-[#eed9ba]/78 px-6 py-10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                  <h2
                    className="text-[#402719] text-[30px] mb-5"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Válaszolj a hívásra
                  </h2>

                  <p className="text-[#68452d] leading-relaxed mb-8 text-base">
                    Ha velünk tartanátok ezen a közös kalandon, kérlek jelezzetek vissza időben.
                  </p>

                  <button
                    className="px-8 py-3 bg-[#4a2d1c] text-[#f5e4ca] border border-[#8d633c] shadow-lg tracking-wide"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Visszajelzés
                  </button>

                  <p className="mt-6 text-[#795338] text-sm opacity-90">
                    Jelenlétetek a legnagyobb ajándék számunkra.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </main>
  );
}