"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const storyLines = [
  "Két út találkozott egy csendes, sorsszeru pillanatban.",
  "A véletlenbol lassan otthon lett, a kalandból ígéret.",
  "Most egy új fejezet nyílik meg elottünk, ahol minden ösvény közös irányba vezet.",
];

const mapMarkers = [
  {
    label: "Miskolci Városháza",
    sublabel: "Szertartás",
    top: "32%",
    left: "44%",
  },
  {
    label: "Boróka Tábor",
    sublabel: "Lakoma és tábortuz",
    top: "68%",
    left: "60%",
  },
  {
    label: "Érkezés Kapuja",
    sublabel: "Vendégfogadás",
    top: "56%",
    left: "28%",
  },
];

const timelineItems = [
  {
    time: "13:00",
    title: "Esküvoi szertartás",
    description: "A fogadalmak a városháza termében csendülnek fel.",
  },
  {
    time: "16:00",
    title: "Lakoma és mulatság",
    description: "Parchment asztalok, gyertyafény és közös ünneplés.",
  },
  {
    time: "21:00",
    title: "Tábortuz",
    description: "A történet az esti fények között folytatódik tovább.",
  },
];

const particles = [
  { top: "12%", left: "18%", size: 5, duration: 4.6, drift: 18 },
  { top: "21%", left: "74%", size: 3, duration: 5.3, drift: 14 },
  { top: "36%", left: "55%", size: 4, duration: 6.1, drift: 20 },
  { top: "44%", left: "20%", size: 2, duration: 4.2, drift: 12 },
  { top: "58%", left: "82%", size: 4, duration: 5.7, drift: 18 },
  { top: "72%", left: "12%", size: 3, duration: 4.8, drift: 15 },
  { top: "83%", left: "64%", size: 5, duration: 6.4, drift: 22 },
];

function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <span
          key={`${particle.top}-${particle.left}-${index}`}
          data-drift={particle.drift}
          data-duration={particle.duration}
          className="ambient-particle absolute rounded-full bg-[radial-gradient(circle,_rgba(253,233,195,0.92)_0%,_rgba(199,118,57,0.38)_45%,_transparent_78%)] opacity-40 blur-[1px]"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size * 4}px`,
            height: `${particle.size * 4}px`,
          }}
        />
      ))}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-[#7b5236]/80">
      <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#9f7352] to-transparent" />
      <span className="text-xs tracking-[0.5em]">✦</span>
      <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#9f7352] to-transparent" />
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const leftPaperRef = useRef<HTMLDivElement>(null);
  const rightPaperRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(coarsePointer && window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "" : "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isOpen || !isMobile || !containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".story-panel");

      panels.forEach((panel) => {
        const content = panel.querySelector<HTMLElement>("[data-panel-content]");
        const layers = panel.querySelectorAll<HTMLElement>(".parallax-layer");

        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        });

        if (content) {
          gsap.fromTo(
            content,
            { autoAlpha: 0, y: 44, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 78%",
                end: "top 38%",
                scrub: true,
              },
            }
          );
        }

        layers.forEach((layer, index) => {
          gsap.fromTo(
            layer,
            { y: index * 10, scale: 1 + index * 0.02 },
            {
              y: -50 - index * 24,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      gsap.fromTo(
        ".hero-sigil",
        { autoAlpha: 0, scale: 0.72, y: 24 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-panel",
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".story-line",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.22,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".story-copy",
            start: "top 78%",
          },
        }
      );

      gsap.fromTo(
        ".map-path",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".map-panel",
            start: "top 65%",
            end: "bottom 42%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".map-marker").forEach((marker, index) => {
        gsap.fromTo(
          marker,
          { autoAlpha: 0, y: 18, scale: 0.84 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            delay: index * 0.08,
            duration: 0.7,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: ".map-panel",
              start: "top 55%",
            },
          }
        );
      });

      gsap.fromTo(
        ".timeline-progress",
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-track",
            start: "top 72%",
            end: "bottom 35%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, x: 18 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
            },
          }
        );
      });

      gsap.fromTo(
        ".cta-card",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".rsvp-panel",
            start: "top 70%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".ambient-particle").forEach((particle) => {
        const drift = Number(particle.dataset.drift ?? 14);
        const duration = Number(particle.dataset.duration ?? 5);

        gsap.to(particle, {
          y: -drift,
          x: drift / 3,
          opacity: 0.72,
          duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen, isMobile]);

  const handleOpen = () => {
    if (openingRef.current) {
      return;
    }

    openingRef.current = true;

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        window.setTimeout(() => {
          window.scrollTo(0, 0);
          ScrollTrigger.refresh();
        }, 40);
      },
    });

    timeline
      .to(sealRef.current, {
        scale: 0.9,
        rotate: -7,
        duration: 0.18,
        ease: "power1.inOut",
      })
      .to(sealRef.current, {
        scale: 1.2,
        rotate: 8,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.6)",
      })
      .to(
        [leftPaperRef.current, rightPaperRef.current],
        {
          width: 0,
          duration: 1.25,
          ease: "power2.inOut",
          stagger: 0.06,
        },
        "-=0.12"
      )
      .to(
        wrapperRef.current,
        {
          autoAlpha: 0,
          duration: 0.42,
          ease: "power2.out",
        },
        "-=0.3"
      );
  };

  if (isMobile === null) {
    return <main className="min-h-screen bg-[#120d09]" />;
  }

  if (!isMobile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(106,64,33,0.35),_transparent_40%),_#120d09] px-6 text-center text-[#f3dfbf]">
        <div className="parchment-card max-w-sm px-8 py-12">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#a9805e]">
            Mobil meghívó
          </p>
          <h1 className="mt-5 font-display text-3xl text-[#2f1b11]">
            Ez a meghívó telefonra készült
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#5f3d28]">
            A teljes élmény álló tájolású mobilképernyon bontakozik ki, görgetett
            történetként.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden bg-[#120d09] text-[#f4e5c8]"
    >
      {!isOpen && (
        <div
          ref={wrapperRef}
          className="fixed inset-0 z-[100] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(110,66,34,0.28),_transparent_35%),_#120d09]"
        >
          <AmbientParticles />
          <div
            ref={leftPaperRef}
            className="paper-texture absolute inset-y-0 left-0 z-10 w-1/2 border-r border-[#9f7352]/30 shadow-[18px_0_40px_rgba(0,0,0,0.35)]"
          />
          <div
            ref={rightPaperRef}
            className="paper-texture absolute inset-y-0 right-0 z-10 w-1/2 border-l border-[#9f7352]/30 shadow-[-18px_0_40px_rgba(0,0,0,0.35)]"
          />

          <div className="relative z-20 flex h-full flex-col items-center justify-center px-8 text-center">
            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-[#e7d0b0]/70">
              Egy üzenet vár rád
            </p>
            <button
              ref={sealRef}
              type="button"
              onClick={handleOpen}
              className="relative h-36 w-36 cursor-pointer transition-transform duration-200 active:scale-95"
              aria-label="Pecsét felnyitása"
            >
              <Image
                src="/seal.png"
                alt="Esküvői pecsét"
                fill
                sizes="144px"
                className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]"
                priority
              />
            </button>
            <p className="mt-8 max-w-[15rem] text-sm uppercase tracking-[0.3em] text-[#f0dfc6] animate-pulse">
              Törd fel a pecsétet, és kezdetét veszi a történet
            </p>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-1000 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <section className="story-panel hero-panel relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,_rgba(247,218,170,0.12),_transparent_30%),_linear-gradient(180deg,_rgba(17,10,7,0.76)_0%,_rgba(33,20,12,0.6)_26%,_rgba(56,34,20,0.36)_52%,_rgba(18,13,9,0.9)_100%)]" />
          <div className="parallax-layer absolute inset-x-0 top-0 h-[43%] bg-[radial-gradient(circle_at_top,_rgba(243,223,191,0.22),_transparent_58%)] opacity-80" />
          <div className="parallax-layer absolute inset-x-[-12%] bottom-[22%] h-[36%] rounded-[50%] bg-[radial-gradient(circle,_rgba(80,52,31,0.9),_rgba(28,18,12,0)_72%)] blur-2xl" />
          <div className="parallax-layer absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,_transparent_0%,_rgba(18,13,9,0.25)_20%,_rgba(18,13,9,0.92)_100%)]" />
          <AmbientParticles />

          <div className="relative flex h-full items-center justify-center px-5 pb-12 pt-20">
            <div
              data-panel-content
              className="parchment-card hero-sigil relative w-full max-w-sm overflow-hidden px-6 pb-12 pt-14 text-center"
            >
              <div className="absolute inset-x-6 top-3 h-10 rounded-full bg-[radial-gradient(circle,_rgba(255,245,221,0.48),_transparent_72%)] blur-xl" />
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#8b6143]">
                A szövetség megköttetik
              </p>
              <h1 className="mt-7 font-display text-[2.6rem] leading-none text-[#2d1a11]">
                Eszti
                <span className="mx-3 inline-block text-[#8b6143]">&</span>
                Peti
              </h1>
              <div className="my-7">
                <SectionDivider />
              </div>
              <p className="font-display text-lg uppercase tracking-[0.25em] text-[#5d3a26]">
                2026.10.03
              </p>
              <p className="mt-8 text-sm leading-7 text-[#5a3d2b]">
                Gyertyafényben, ősi papírlapok között hívunk benneteket arra az
                útra, ahol a fogadalmak mesévé válnak.
              </p>
              <p className="mt-10 font-serif text-base italic text-[#7a5336]">
                &ldquo;Nem mindenki téved el, aki vándorol.&rdquo;
              </p>
            </div>
          </div>
        </section>

        <section className="story-panel relative h-[100svh] w-full overflow-hidden">
          <div className="paper-texture absolute inset-0 opacity-[0.96]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(35,21,14,0.16)_0%,_rgba(80,50,31,0.08)_24%,_rgba(19,12,8,0.68)_100%)]" />
          <div className="parallax-layer absolute inset-x-0 top-[-6%] h-[52%] bg-[radial-gradient(circle_at_50%_15%,_rgba(255,242,213,0.32),_transparent_58%)] opacity-70" />
          <div className="parallax-layer absolute bottom-[-4%] left-[-18%] h-[44%] w-[74%] rounded-[50%] bg-[radial-gradient(circle,_rgba(71,47,31,0.58),_rgba(71,47,31,0)_68%)] blur-2xl" />
          <div className="parallax-layer absolute bottom-[-8%] right-[-15%] h-[48%] w-[62%] rounded-[50%] bg-[radial-gradient(circle,_rgba(92,61,38,0.42),_rgba(92,61,38,0)_70%)] blur-3xl" />
          <AmbientParticles />

          <div className="relative flex h-full items-center justify-center px-5 py-12">
            <div
              data-panel-content
              className="story-copy parchment-card w-full max-w-sm px-6 py-12 text-center"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[#8b6143]">
                Történetünk
              </p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-tight text-[#2b1a11]">
                Két út találkozott, és közös történetté vált
              </h2>
              <div className="my-6">
                <SectionDivider />
              </div>
              <div className="space-y-5 text-[1rem] leading-8 text-[#563727]">
                {storyLines.map((line) => (
                  <p key={line} className="story-line">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-panel map-panel relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,223,187,0.15),_transparent_38%),_linear-gradient(180deg,_#26160f_0%,_#3b2417_42%,_#16100c_100%)]" />
          <div className="paper-texture absolute inset-[8%_6%] rounded-[2.1rem] opacity-[0.82] shadow-[0_20px_45px_rgba(0,0,0,0.35)]" />
          <div className="absolute inset-[8%_6%] rounded-[2.1rem] border border-[#b48b63]/25" />
          <div className="parallax-layer absolute inset-x-[12%] top-[18%] h-[20%] rounded-[50%] bg-[radial-gradient(circle,_rgba(121,89,54,0.34),_rgba(121,89,54,0)_72%)] blur-3xl" />
          <div className="parallax-layer absolute inset-x-[18%] bottom-[14%] h-[18%] rounded-[50%] bg-[radial-gradient(circle,_rgba(73,48,30,0.45),_rgba(73,48,30,0)_72%)] blur-2xl" />
          <AmbientParticles />

          <div className="relative flex h-full items-center justify-center px-5 py-10">
            <div
              data-panel-content
              className="relative w-full max-w-sm rounded-[2rem] px-8 py-12 text-[#352115]"
            >
              <p className="text-center text-[0.65rem] uppercase tracking-[0.42em] text-[#b08a65]">
                A térkép
              </p>
              <h2 className="mt-4 text-center font-display text-[2.15rem] leading-tight text-[#f2ddbf]">
                Kövessétek az útvonalat a fogadalmaktól az esti fényekig
              </h2>

              <div className="relative mt-9 h-[23rem] rounded-[1.7rem] border border-[#8d6446]/35 bg-[linear-gradient(180deg,_rgba(238,218,183,0.94),_rgba(198,165,126,0.88))] shadow-[inset_0_0_0_1px_rgba(255,248,230,0.18),_0_18px_30px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-4 rounded-[1.4rem] border border-dashed border-[#8b6143]/35" />
                <div className="absolute left-[18%] top-[19%] h-[18%] w-[28%] rounded-[45%] bg-[#7d9656]/60 blur-[2px] opacity-70" />
                <div className="absolute right-[16%] top-[28%] h-[24%] w-[30%] rounded-[50%] bg-[#9a8553]/45 blur-[2px] opacity-75" />
                <div className="absolute bottom-[18%] left-[24%] h-[26%] w-[34%] rounded-[46%] bg-[#6d8651]/55 blur-[2px] opacity-70" />
                <div className="absolute left-[17%] top-[56%] h-[11%] w-[68%] rotate-[-9deg] rounded-full bg-[#6b8ba5]/35 blur-[1px]" />

                <div className="map-path absolute left-[49%] top-[22%] h-[48%] w-[3px] origin-top bg-[linear-gradient(180deg,_rgba(119,76,44,0),_rgba(119,76,44,0.95)_18%,_rgba(119,76,44,0.95)_82%,_rgba(119,76,44,0))] shadow-[0_0_18px_rgba(127,87,49,0.35)]" />

                {mapMarkers.map((marker) => (
                  <div
                    key={marker.label}
                    className="map-marker absolute"
                    style={{ top: marker.top, left: marker.left }}
                  >
                    <div className="relative">
                      <span className="absolute left-1/2 top-5 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-[#774c2c] to-transparent" />
                      <span className="block h-4 w-4 rounded-full border border-[#fce7c7]/50 bg-[#a4512a] shadow-[0_0_16px_rgba(183,95,44,0.55)]" />
                      <div className="mt-5 w-28 rounded-2xl border border-[#82593d]/30 bg-[#f4e3c3]/90 px-3 py-2 shadow-lg">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#734b31]">
                          {marker.sublabel}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#4a2d1d]">
                          {marker.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-panel relative h-[100svh] w-full overflow-hidden">
          <div className="paper-texture absolute inset-0 opacity-[0.92]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(28,16,10,0.3)_0%,_rgba(61,38,24,0.15)_28%,_rgba(20,13,9,0.76)_100%)]" />
          <div className="parallax-layer absolute inset-x-[-8%] top-[8%] h-[20%] rounded-[50%] bg-[radial-gradient(circle,_rgba(251,236,205,0.22),_rgba(251,236,205,0)_72%)] blur-3xl" />
          <div className="parallax-layer absolute bottom-[-7%] left-[-10%] h-[28%] w-[64%] rounded-[50%] bg-[radial-gradient(circle,_rgba(91,58,36,0.46),_rgba(91,58,36,0)_72%)] blur-2xl" />
          <AmbientParticles />

          <div className="relative flex h-full items-center justify-center px-5 py-10">
            <div
              data-panel-content
              className="parchment-card w-full max-w-sm px-6 py-12 text-center"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[#8b6143]">
                Az ünnep rendje
              </p>
              <h2 className="mt-5 font-display text-[2.15rem] leading-tight text-[#2e1b12]">
                A nap fényről fényre halad tovább
              </h2>

              <div className="timeline-track relative mt-10 space-y-7 pl-8 text-left">
                <div className="absolute bottom-0 left-[0.45rem] top-2 w-[2px] rounded-full bg-[#c7a17b]/35" />
                <div className="timeline-progress absolute left-[0.45rem] top-2 w-[2px] rounded-full bg-[linear-gradient(180deg,_#f3deb8_0%,_#c66f38_100%)] shadow-[0_0_14px_rgba(198,111,56,0.45)]" />

                {timelineItems.map((item) => (
                  <div key={item.time} className="timeline-item relative">
                    <span className="absolute left-[-2rem] top-2 h-4 w-4 rounded-full border border-[#f7e7cb]/55 bg-[#9e532a] shadow-[0_0_16px_rgba(198,111,56,0.5)]" />
                    <p className="font-display text-lg tracking-[0.18em] text-[#6b452d]">
                      {item.time}
                    </p>
                    <h3 className="mt-2 text-base font-semibold uppercase tracking-[0.14em] text-[#2f1b11]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5a3b2a]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-panel rsvp-panel relative h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(248,222,182,0.14),_transparent_26%),_linear-gradient(180deg,_#1b120d_0%,_#2a1b13_34%,_#120d09_100%)]" />
          <div className="parallax-layer absolute bottom-[14%] left-[-12%] h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(204,114,49,0.48),_rgba(204,114,49,0)_72%)] blur-2xl" />
          <div className="parallax-layer absolute bottom-[12%] right-[-12%] h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(204,114,49,0.42),_rgba(204,114,49,0)_72%)] blur-2xl" />
          <div className="absolute bottom-[10%] left-5 h-24 w-10 rounded-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,231,190,0.78),_rgba(255,231,190,0.1)_26%,_rgba(50,27,15,0)_72%)] blur-md" />
          <div className="absolute bottom-[10%] right-5 h-24 w-10 rounded-full bg-[radial-gradient(circle_at_50%_0%,_rgba(255,231,190,0.78),_rgba(255,231,190,0.1)_26%,_rgba(50,27,15,0)_72%)] blur-md" />
          <AmbientParticles />

          <div className="relative flex h-full items-center justify-center px-5 py-12">
            <div
              data-panel-content
              className="cta-card w-full max-w-sm rounded-[2rem] border border-[#9b7151]/28 bg-[linear-gradient(180deg,_rgba(245,229,199,0.12),_rgba(61,38,24,0.22))] px-6 py-12 text-center shadow-[0_22px_60px_rgba(0,0,0,0.36)] backdrop-blur-[2px]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[#ba9670]">
                Válasz a hívásra
              </p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-tight text-[#f3dfbf]">
                Velünk tartotok ezen az úton?
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#dcc2a2]">
                Hamarosan elküldjük a visszajelzés részleteit is. Addig őrizzétek
                meg ezt a meghívót, mint a történet nyitó lapját.
              </p>
              <button
                type="button"
                className="mt-9 rounded-full border border-[#d4b18f]/35 bg-[linear-gradient(180deg,_#f0dfbf_0%,_#d4bb98_100%)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3d2417] shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 active:scale-95"
              >
                Visszajelzés
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
