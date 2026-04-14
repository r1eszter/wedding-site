"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- ADATOK ÉS KONSTANSOK ---
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
  // --- STATE-EK (Állapotkezelés) ---
  const [isOpen, setIsOpen] = useState(false); // A boríték nyitási folyamatának állapota
  const [showMainContent, setShowMainContent] = useState(false); // A fő weboldal láthatósága
  const [isMobile, setIsMobile] = useState(true);

  // --- REF-EK (DOM elemek elérése animációhoz) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null); // A teljes bevezető (borítékos) rész
  const sealRef = useRef<HTMLButtonElement>(null); // A pecsét gomb
  const flapRef = useRef<HTMLDivElement>(null); // A boríték felnyíló füle
  const introTextRef = useRef<HTMLDivElement>(null); // A "Törd meg a pecsétet" szöveg

  // --- MOBIL ELLENŐRZÉS ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- INICIALIZÁLÁS (Kezdő pozíciók beállítása) ---
  useEffect(() => {
    if (!isMobile) return;

    gsap.set(flapRef.current, { rotateX: 0 }); // A fül alaphelyzetben zárt
    gsap.set(introTextRef.current, { opacity: 1, y: 0 });
    gsap.set(sealRef.current, { opacity: 1, scale: 1 });
  }, [isMobile]);

  // --- FŐ TARTALOM ANIMÁCIÓI (ScrollTrigger) ---
  useEffect(() => {
    if (!showMainContent || !isMobile) return;

    const ctx = gsap.context(() => {
      // Hero szekció kártya megjelenése
      gsap.fromTo(
        ".hero-card",
        { opacity: 0, y: 42, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hero-panel", start: "top 75%" },
        }
      );

      // Parallax effekt a háttérnek
      gsap.to(".hero-bg", {
        scale: 1.08,
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: ".hero-panel", start: "top top", end: "bottom top", scrub: true },
      });

      // Szekció rögzítése (Pinning)
      ScrollTrigger.create({
        trigger: ".hero-panel",
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });

      // Térkép és eseménylista animációi (hasonló logikával...)
      // [A többi ScrollTrigger kód változatlan marad az átláthatóság kedvéért]
      
    }, containerRef);

    return () => ctx.revert();
  }, [showMainContent, isMobile]);

  // --- NYITÁSI ANIMÁCIÓ (Handle Open) ---
  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setShowMainContent(true);
      },
    });

    // 1. Pecsét és szöveg eltüntetése
    tl.to([sealRef.current, introTextRef.current], {
      opacity: 0,
      scale: 1.1,
      duration: 0.4,
      ease: "power2.in",
    })
    // 2. Boríték fülének felnyitása
    .to(flapRef.current, {
      rotateX: -170, // Szinte teljesen hátrahajlik
      transformOrigin: "top center",
      duration: 0.8,
      ease: "power3.inOut",
    }, "-=0.1")
    // 3. A teljes intro rész elhalványítása, hogy átlássunk a Hero-ra
    .to(introRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power1.inOut",
    }, "+=0.2");
  };

  // --- ASZTALI NÉZET (Tiltás) ---
  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-10 bg-[#140d09] text-[#f2dfc2]">
        <div className="max-w-sm">
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Ez a meghívó telefonra készült</h1>
          <p className="text-sm opacity-80">Kérlek, mobiltelefonon nyisd meg a teljes élményhez. 📱</p>
        </div>
      </div>
    );
  }

  return (
    <main
      ref={containerRef}
      className="relative overflow-x-hidden bg-[#140d09] text-[#2f1d12]"
      style={{ fontFamily: "'Crimson Text', serif" }}
    >
      {/* --- BEVEZETŐ RÉSZ (BORÍTÉK) --- */}
      {!isOpen && (
        <div
          ref={introRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#140d09] overflow-hidden"
        >
          {/* Háttér fényeffekt */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,80,0.08),transparent_55%)] pointer-events-none" />

          <div className="relative w-[330px] h-[560px]" style={{ perspective: "1600px" }}>
            
            {/* Boríték alja/teste */}
            <div
              className="absolute inset-0 bg-center bg-cover drop-shadow-[0_30px_55px_rgba(0,0,0,0.45)]"
              style={{ backgroundImage: "url('/envelope-base.png')" }}
            />

            {/* A felnyíló fül */}
            <div
              ref={flapRef}
              className="absolute left-1/2 top-[112px] -translate-x-1/2 w-[398px] h-[270px] z-10 origin-top"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <img
                src="/envelope-flap.png"
                alt="Boríték fül"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Pecsét és feliratok rétege */}
            <div className="absolute left-1/2 top-[186px] -translate-x-1/2 z-30 flex flex-col items-center">
              <button
                ref={sealRef}
                onClick={handleOpen}
                className="w-40 h-40 active:scale-95 transition-transform drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)]"
              >
                <img src="/seal.png" alt="Pecsét" className="w-full h-full object-contain" />
              </button>

              <div ref={introTextRef} className="mt-7 text-center">
                <p className="text-[#f2dfc2] text-[15px] mb-4 opacity-95" style={{ fontFamily: "'Cinzel', serif" }}>
                  Egy üzenet vár rád...
                </p>
                <button
                  onClick={handleOpen}
                  className="px-5 py-3 text-[#f6e6cb] border border-[#8d6039] bg-[#3a2417]/85 rounded-sm tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Törd meg a pecsétet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FŐ TARTALOM (HERO, MAP, TIMELINE) --- */}
      {showMainContent && (
        <div className="opacity-100 transition-opacity duration-1000">
          
          {/* HERO SZKCIÓ */}
          <section className="hero-panel relative h-screen w-full overflow-hidden">
            <div
              className="hero-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/paper-texture.jpg')" }}
            />
            {/* Sötétítő rétegek az olvashatóságért */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.65),rgba(20,13,9,0.15),rgba(20,13,9,0.75))]" />
            
            <div className="relative z-10 h-full flex items-center justify-center px-5">
              <div className="hero-card relative w-full max-w-[360px] text-center">
                <div className="relative px-6 pt-14 pb-16 bg-[#f0ddbf]/80 backdrop-blur-[1.5px] border border-[#8b633d]/30 shadow-2xl">
                  <p className="text-[11px] tracking-[0.35em] uppercase text-[#7b5537] mb-7" style={{ fontFamily: "'Cinzel', serif" }}>
                    ✧ A Szövetség Megköttetik ✧
                  </p>
                  <h1 className="text-[46px] leading-none text-[#3a2416] mb-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    Eszter <span className="text-[#8d5d38]">&</span> Péter
                  </h1>
                  <p className="text-[22px] tracking-[0.12em] text-[#4f3524] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                    2026.10.03
                  </p>
                  <p className="mt-10 text-[#6f4a31] italic text-lg leading-relaxed">
                    „Két út találkozott...”<br />
                    „Egy közös történet kezdődött...”
                  </p>
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
                    target="_blank"
                    rel="noreferrer"
                    className="floating-place float-miskolc absolute block w-[160px] left-[18px] top-[82px] active:scale-95 transition-transform"
                  >
                    <img
                      src="/miskolc.jpg"
                      alt="Miskolci Városháza"
                      className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                    />
                  </a>

                  <a
                    href={borokaMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="floating-place float-boroka absolute block w-[148px] right-[18px] top-[222px] active:scale-95 transition-transform"
                  >
                    <img
                      src="/boroka.jpg"
                      alt="Boróka Tábor"
                      className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                    />
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