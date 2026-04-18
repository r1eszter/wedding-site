"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- KOMPONENS: LEBEGŐ POR / PARÁZS ---
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let particles: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    class Particle {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      size = Math.random() * 1.5 + 0.5;
      speedY = Math.random() * -0.5 - 0.2;
      speedX = Math.random() * 0.4 - 0.2;
      opacity = Math.random() * 0.5 + 0.1;
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < 0) this.y = window.innerHeight;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(252, 242, 230, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    window.addEventListener("resize", resize);
    resize(); animate();
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[80] opacity-40" />;
};

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



type RuleItem = {
  id: string;
  title: string;
  text: string;
  icon: string;
};

const rules: RuleItem[] = [
  {
    id: "invite",
    title: "A Kiválasztottak Rendje",
    text: "A birodalom kapui csak a személyesen meghívott vendégek előtt nyílnak meg. NO +1",
    icon: "/icons/seal-rule.png",
  },
  {
    id: "dress",
    title: "A Megjelenés Törvénye",
    text: "Kérünk benneteket, hogy megjelenésetekkel emeljétek az alkalom fényét. Kerüljétek a rikító színeket.",
    icon: "/icons/crown-rule.png",
  },
  {
    id: "gift",
    title: "A Kincstár Hozzájárulása",
    text: "Ha támogatnátok utunkat, kalandunkhoz aranyérméknek örülünk leginkább.",
    icon: "/icons/pouch-rule.png",
  },
  {
    id: "stay",
    title: "A Megpihenés Joga",
    text: "Minden vándorunk számára biztosítunk éjszakai szállást a helyszínen.",
    icon: "/icons/house-rule.png",
  },
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
  const rulesImgRef = useRef<HTMLImageElement>(null);
  const globalBgRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const heroDividerRef = useRef<HTMLDivElement>(null);
  const heroDateRef = useRef<HTMLParagraphElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);


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
      const heroTl = gsap.timeline({ delay: 0.5 });
      heroTl.from(heroNameRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      })
      .from(heroDividerRef.current, {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.6")
      .from(heroDateRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-extra", {
        opacity: 0,
        y: 10,
        stagger: 0.2,
        duration: 1
      }, "-=0.5")
      .from(heroScrollRef.current, {
        opacity: 0,
        duration: 1.5
      }, "-=0.2");
      // 1. Lassú Globális Háttér Parallax
      gsap.to(globalBgRef.current, {
        y: "-5%", // Csak kicsit mozdul el
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Simított mozgás
        }
      });

      // 2. Szabályok képének parallax mozgása (kép a keretben)
      gsap.to(rulesImgRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".rules-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // 3. Idővonal elemek megjelenése
      if (isMobile) {
        gsap.from(".timeline-item", {
          scrollTrigger: {
            trigger: ".quest-panel",
            start: "top 70%",
          },
          x: -50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        });
      }
    }, containerRef);

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
      <Particles />
      
      {/* --- INTRO RÉTEG (Boríték szétnyílása) --- */}
      {!isOpen && (
        <div className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none">
          <Particles />
          
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
        <div className="relative">
		    <Particles />
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div ref={globalBgRef} className="absolute -top-[5%] left-0 w-full h-[110%] bg-cover bg-center brightness-[0.6] sepia-[0.2]" style={{ backgroundImage: "url('/paper-texture.jpg')" }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_10%,rgba(10,8,5,0.6)_100%)]" />
          </div>

          {/* --- HERO SECTION --- */}
          <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-5">
            
            {/* KÖZÉPSŐ GLOW EFFEKT */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-[400px] bg-[#e0d6ce]/5 blur-[80px] rounded-full pointer-events-none z-0" />

            <div ref={heroContentRef} className="relative z-10 w-full max-w-[370px] flex flex-col items-center">
              <p className="hero-extra text-[9px] tracking-[0.4em] uppercase text-[#e0d6ce] opacity-70 mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
                ✧ A Szövetség Megköttetik ✧
              </p>

              <h1 ref={heroNameRef} className="text-[44px] leading-[1.1] text-[#e0d6ce] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                Eszter & Péter
              </h1>

              {/* ANIMÁLT DIVIDER */}
              <div className="relative flex items-center justify-center w-full mb-7">
                <div ref={heroDividerRef} className="flex items-center justify-center gap-3 w-full origin-center">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#e0d6ce]/60" />
                    <div className="w-[6px] h-[6px] rotate-45 border border-[#e0d6ce]/60" />
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#e0d6ce]/60" />
                </div>
              </div>

              <p ref={heroDateRef} className="text-[22px] tracking-[0.15em] uppercase text-[#e0d6ce] mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
                2026.10.03
              </p>

              <div className="hero-extra text-[#e0d6ce] italic text-[17px] leading-[1.9] text-center opacity-90">
                <p>„Két út találkozott...”</p>
                <p>„Egy közös történet kezdődött...”</p>
              </div>

              {/* STÍLUSOSABB GÖRGETÉS JELZŐ */}
              <div ref={heroScrollRef} className="absolute -bottom-24 flex flex-col items-center gap-4">
                <div className="text-[10px] tracking-[0.3em] text-[#e0d6ce] uppercase opacity-50 italic" style={{ fontFamily: "'Cinzel', serif" }}>
                   A történet folytatódik
                </div>

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

              {/* A háttérkép */}
              <img
                src="/rule.png"
                alt="Birodalmi Törvények"
                className="w-full h-auto block"
              />

              {/* A SZÖVEG RÉTEG */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10">

                {/* Szabályok listája - Árnyék hozzáadva az egész tárolóhoz */}
                <div className="flex flex-col gap-8 w-full text-[#f7f6f5] max-w-[260px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">

                  {/* 1. Szabály */}
                  <div className="text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ⅰ. A Kiválasztottak Rendje
                    </h3>
                    <p className="text-[12px] italic leading-relaxed font-medium">
                      A birodalom kapui csak a személyesen meghívott vendégek előtt nyílnak meg. NO +1
                    </p>
                  </div>

                  {/* 2. Szabály */}
                  <div className="text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ⅱ. A Megjelenés Törvénye
                    </h3>
                    <p className="text-[12px] italic leading-relaxed font-medium">
                      Kérünk benneteket, hogy megjelenésetekkel emeljétek az alkalom fényét. Kerüljétek a rikító színeket.
                    </p>
                  </div>

                  {/* 3. Szabály */}
                  <div className="text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ⅲ. A Kincstár Hozzájárulása
                    </h3>
                    <p className="text-[12px] italic leading-relaxed font-medium">
                      Ha támogatnátok utunkat, kalandunkhoz aranyérméknek örülünk leginkább.
                    </p>
                  </div>

                  {/* 4. Szabály */}
                  <div className="text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ⅳ. A Megpihenés Joga
                    </h3>
                    <p className="text-[12px] italic leading-relaxed font-medium">
                      Minden vándorunk számára biztosítunk éjszakai szállást a helyszínen.
                    </p>
                  </div>

                  {/* 5. Zene */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ⅴ. A Vigasság Dallamai
                    </h3>
                    <a
                      href="https://www.youtube.com/playlist?list=PLrlyZC8nNT0C4smDEY5K4MZZ8lqPNY-oz&jct=ZHcHxgsEnRlw4-QI9UZJJQ"
                      target="_blank"
                      className="relative group active:scale-90 transition-transform block"
                    >
                      <img src="/youtube.png" className="w-15 h-12 drop-shadow-xl mx-auto" alt="Zenei pecsét" />
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

                <div className="relative pl-5 timeline-container">

                {/* 1. Statikus alapvonal (halvány) */}
                <div className="absolute left-[10px] top-0 bottom-0 w-[1px] bg-[#8b5d37]/30" />

                {/* 2. Aktív, feltöltődő vonal (GSAP-pel animálva) */}
                <div 
                  className="timeline-progress-line absolute left-[10px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#f3c188] via-[#d6a06f] to-[#f3c188] origin-top scale-y-0 shadow-[0_0_10px_rgba(243,193,136,0.5)]" 
                />

                <div className="space-y-8"> {/* Kicsit nagyobb helyet hagytam köztük, h jobban érvényesüljön a kép */}
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
                      <div className="absolute inset-0 bg-[#140d09]/50 backdrop-blur-[1px]" />

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
                  ✧ Visszajelzés határideje: 2026.08.15 ✧
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

                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeWMXCiXBlZ40cuEOiJEPK4qnLdKlKOpqHk28XbLJVnKz2jdg/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-[#4a2d1c] text-[#f5e4ca] border border-[#8d633c] shadow-lg tracking-wide active:scale-95 transition-transform"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Visszajelzés
                  </a>

                </div>
              </div>
            </div>
          </section>

        </div>
      )}
      <style jsx global>{`
        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .animate-scroll-line {
          animation: scroll-line 2.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </main>
  );
}