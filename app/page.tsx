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
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: ".quest-panel",
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2, // Ez adja meg a sorozatos késleltetést
        ease: "power2.out"
      });
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

          {/* --- HERO SECTION --- */}
          <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 overflow-hidden border-b border-[#8b633d]/20">
            {/* Fix Háttér */}
            <div className="fixed inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center brightness-[0.7] sepia-[0.15]"
                style={{ backgroundImage: "url('/paper-texture.jpg')" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(10,8,5,0.4)_100%)]" />
            </div>

            {/* Meghívó panel tartalma - Itt a justify-center és a h-full biztosítja a középre zárást */}
            <div className="relative z-10 w-full max-w-[370px] flex flex-col items-center justify-center min-h-screen">
              
              {/* Mini heading */}
              <p
                className="text-[9px] tracking-[0.34em] uppercase text-[#e0d6ce] opacity-75 mb-8"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                ✧ A Szövetség Megköttetik ✧
              </p>

              {/* Fő név */}
              <h1
                className="text-[42px] leading-[1.02] text-[#e0d6ce] mb-6 text-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Eszter & Péter
              </h1>

              {/* Díszítő sor */}
              <div className="flex items-center justify-center gap-3 mb-7">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#e0d6ce]/70" />
                <div className="w-[6px] h-[6px] rotate-45 border border-[#e0d6ce]/70" />
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#e0d6ce]/70" />
              </div>

              {/* Dátum */}
              <p
                className="text-[21px] tracking-[0.10em] uppercase text-[#e0d6ce] mb-8 text-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                2026.10.03
              </p>

              {/* Második díszítő sor */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-[1px] w-10 bg-[#e0d6ce]/28" />
                <div className="text-[#e0d6ce]/55 text-[11px]">✦</div>
                <div className="h-[1px] w-10 bg-[#e0d6ce]/28" />
              </div>

              {/* Idézet */}
              <div className="text-[#e0d6ce] italic text-[17px] leading-[1.9] text-center">
                <p>„Két út találkozott...”</p>
                <p>„Egy közös történet kezdődött...”</p>
              </div>

              {/* Görgetés jelző - absolute pozícióval az aljára, hogy ne tolja el a fenti szöveget */}
              <div className="absolute bottom-10 flex flex-col items-center gap-4 animate-pulse">
                <div
                  className="text-[11px] tracking-[0.2em] text-[#e0d6ce] uppercase opacity-60"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Haladj tovább
                </div>
                <div className="w-[1px] h-12 bg-gradient-to-b to-transparent opacity-40" />
              </div>
            </div>

          </section>



      {/* --- BIRODALOM SZABÁLYAI (CENTERED VERSION) --- */}
        <section className="relative w-full flex flex-col items-center bg-[#0d0a08]">

          {/* Fix Háttér (Papír textúra) */}
          <div className="fixed inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.7] sepia-[0.15]"
              style={{ backgroundImage: "url('/paper-texture.jpg')" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(10,8,5,0.4)_100%)]" />
          </div>
          
          {/* A KÉP KONTEINER */}
          <div className="relative w-full max-w-[500px] flex flex-col items-center rounded-3xl overflow-hidden shadow-2xl">            
           
            {/* A háttérkép - h-auto-val őrzi az arányait */}
            <img 
              src="/rule.png" 
              alt="Birodalmi Törvények" 
              className="w-full h-auto block shadow-2xl" 
            />

            {/* A SZÖVEG RÉTEG - justify-center: függőleges közép, items-center: vízszintes közép */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10">
              
              {/* Szabályok listája - Itt a gap-8 vagy gap-10 segít, hogy beleférjen a kép közepébe */}
              <div className="flex flex-col gap-8 w-full text-[#2a1a0f] max-w-[260px]">
                
                {/* 1. Szabály */}
                <div className="text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#3a2416]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Ⅰ. A Kiválasztottak Rendje
                  </h3>
                  <p className="text-[12px] italic leading-relaxed opacity-95">
                    A birodalom kapui csak a személyesen meghívott vendégek előtt nyílnak meg. NO +1
                  </p>
                </div>

                {/* 2. Szabály */}
                <div className="text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#3a2416]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Ⅱ. A Megjelenés Törvénye
                  </h3>
                  <p className="text-[12px] italic leading-relaxed opacity-95">
                    Kérünk benneteket, hogy megjelenésetekkel emeljétek az alkalom fényét. Kerüljétek a rikító színeket.
                  </p>
                </div>

                {/* 3. Szabály */}
                <div className="text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#3a2416]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Ⅲ. A Kincstár Hozzájárulása
                  </h3>
                  <p className="text-[12px] italic leading-relaxed opacity-95">
                    Ha támogatnátok utunkat, kalandunkhoz aranyérméknek örülünk leginkább.
                  </p>
                </div>

                {/* 4. Szabály */}
                <div className="text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#3a2416]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Ⅳ. A Megpihenés Joga
                  </h3>
                  <p className="text-[12px] italic leading-relaxed opacity-95">
                    Minden vándorunk számára biztosítunk éjszakai szállást a helyszínen.
                  </p>
                </div>

                {/* 5. Zene */}
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-[#3a2416]" style={{ fontFamily: "'Cinzel', serif" }}>
                    Ⅴ. A Vigasság Dallamai
                  </h3>
                  <a 
                    href="YOUR_LINK_HERE" 
                    target="_blank"
                    className="relative group active:scale-90 transition-transform block"
                  >
                    <img src="/seal.png" className="w-12 h-12 drop-shadow-lg mx-auto" alt="Zenei pecsét" />
                  </a>
                </div>

              </div>
            </div>
          </div>

          
        </section>


          {/* TÉRKÉP SZEKCIÓ (Az eredeti kódból maradt) */}
          <section className="map-panel relative h-screen w-full overflow-hidden">

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
                    className="floating-place float-boroka animate-float-delayed absolute block w-[148px] right-[18px] top-[260px] active:scale-95 transition-transform"
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
            
            
            <div className="relative z-10 px-5 pt-20 pb-20">
              <div className="max-w-[360px] mx-auto">
                <h2
                  className="quest-title text-center text-[#f6e5ca] text-[35px] mb-8"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  A Küldetés Menete
                </h2>

                <div className="relative pl-5">
                  {/* Idővonal vonal */}
                  <div className="absolute left-[10px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-[#8b5d37] via-[#d6a06f] to-[#8b5d37]" />

                  <div className="space-y-6"> {/* Kicsit nagyobb helyet hagytam köztük, h jobban érvényesüljön a kép */}
                    {timeline.map((item, index) => (
                      <div
                        key={`${item.time}-${index}`}
                        className="timeline-item relative rounded-2xl border border-[#8a603b]/40 overflow-hidden ml-4 shadow-xl"
                        style={{ 
                          backgroundImage: "url('/story-landscape.jpg')",
                          backgroundAttachment: 'fixed', // <--- Ez teszi folytonossá a képet
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Sötétítő réteg és blur - hogy a szöveg kiemelkedjen a háttérből */}
                        <div className="absolute inset-0 bg-[#140d09]/65 backdrop-blur-[2px]" />

                        {/* Tartalom */}
                        <div className="relative z-10 px-5 py-5 flex gap-4">
                          {/* Pont az idővonalon */}
                          <div className="absolute -left-[25px] top-7 w-3.5 h-3.5 rounded-full bg-[#f3c188] border-2 border-[#140d09] shadow-[0_0_15px_rgba(255,168,90,0.7)]" />
                          
                          <div className="text-3xl leading-none mt-1 shrink-0 filter drop-shadow-md">{item.icon}</div>
                          
                          <div className="flex flex-col">
                            <p
                              className="text-[#f8e7ce] text-xl font-bold tracking-tight"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              {item.time}
                            </p>
                            <p className="text-[#f5e0c3] text-lg leading-snug font-semibold mt-0.5">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className="text-[#d7b38d] text-sm mt-1.5 opacity-90 italic leading-tight">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-[#ecd0ac] text-[20px] mt-7 tracking-wide">
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

                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </main>
  );
}