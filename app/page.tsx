"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Marker = {
  id: string;
  label: string;
  top: string;
  left: string;
};

type TimelineItem = {
  time: string;
  title: string;
  subtitle?: string;
  icon: string;
};

const markers: Marker[] = [
  {
    id: "varoshaza",
    label: "Miskolci Városháza",
    top: "38%",
    left: "35%",
  },
  {
    id: "boroka",
    label: "Boróka Tábor",
    top: "64%",
    left: "60%",
  },
];

const timeline: TimelineItem[] = [
  { time: "13:00", title: "Polgári szertartás", subtitle: "Miskolci Városháza", icon: "💍" },
  { time: "16:00", title: "Vendégváró", subtitle: "Nagyvisnyó", icon: "🍷" },
  { time: "17:00", title: "Szertartás", subtitle: "A történet folytatódik", icon: "✨" },
  { time: "18:00", title: "Vacsora", subtitle: "Lakoma", icon: "🍽️" },
  { time: "19:00", title: "Ajándék / Fotózás", subtitle: "Emlékek és pillanatok", icon: "📷" },
  { time: "20:00", title: "Ünneplés", subtitle: "Mulatság hajnalig", icon: "🔥" },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const leftPaperRef = useRef<HTMLDivElement>(null);
  const rightPaperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".panel");

      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: true,
        });

        const content = panel.querySelector(".content");
        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            }
          );
        }
      });

      gsap.fromTo(
        ".hero-card",
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-panel",
            start: "top 80%",
          },
        }
      );

      gsap.to(".hero-bg", {
        scale: 1.08,
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-panel",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".story-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 24, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".story-panel",
              start: "top 65%",
            },
          }
        );
      });

      gsap.fromTo(
        ".map-card",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".map-panel",
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".map-marker",
        { opacity: 0, scale: 0, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.25,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".map-panel",
            start: "top 55%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0.35,
            y: 30,
            boxShadow: "0 0 0 rgba(255,180,80,0)",
          },
          {
            opacity: 1,
            y: 0,
            boxShadow: "0 0 24px rgba(255,160,60,0.18)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 45%",
              scrub: true,
            },
          }
        );
      });

      gsap.to(".embers", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-panel",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".fog-layer", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-panel",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isOpen, isMobile]);

  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(true),
    });

    tl.to(sealRef.current, {
      scale: 1.35,
      opacity: 0,
      duration: 0.45,
      ease: "back.in(1.8)",
    })
      .to(
        leftPaperRef.current,
        {
          xPercent: -100,
          duration: 1.15,
          ease: "power3.inOut",
        },
        "-=0.05"
      )
      .to(
        rightPaperRef.current,
        {
          xPercent: 100,
          duration: 1.15,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(
        wrapperRef.current,
        {
          opacity: 0,
          duration: 0.35,
          pointerEvents: "none",
        },
        "-=0.25"
      );
  };

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-10 bg-[#140d09] text-[#f2dfc2]">
        <div className="max-w-sm">
          <h1
            className="text-2xl mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Ez a meghívó telefonra készült
          </h1>
          <p
            className="text-sm leading-relaxed opacity-80"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            Kérlek, mobiltelefonon nyisd meg a teljes élményhez. 📱
          </p>
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
      {!isOpen && (
        <div
          ref={wrapperRef}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#140d09]"
        >
          <div
            ref={leftPaperRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-cover bg-center shadow-2xl border-r border-[#7d5937]/40"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />
          <div
            ref={rightPaperRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center shadow-2xl border-l border-[#7d5937]/40"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,80,0.08),transparent_55%)] pointer-events-none" />

          <div className="z-20 flex flex-col items-center px-6 text-center">
            <p
              className="text-[#f2dfc2] text-[15px] mb-8 opacity-90"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Egy üzenet vár rád...
            </p>

            <div
              ref={sealRef}
              onClick={handleOpen}
              className="w-36 h-36 cursor-pointer active:scale-95 transition-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
            >
              <img
                src="/seal.png"
                alt="Pecsét"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              onClick={handleOpen}
              className="mt-8 px-6 py-3 text-[#f6e6cb] border border-[#8d6039] bg-[#3a2417]/80 rounded-sm tracking-wide shadow-lg"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Törd meg a pecsétet
            </button>
          </div>
        </div>
      )}

      <div className={isOpen ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        <section className="panel hero-panel relative h-screen w-full overflow-hidden">
          <div
            className="hero-bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.65),rgba(20,13,9,0.15),rgba(20,13,9,0.75))]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.45)]" />

          <div className="content relative z-10 h-full flex items-center justify-center px-5">
            <div className="hero-card relative w-full max-w-[360px] mx-auto text-center">
              <div className="absolute -inset-3 border border-[#87613f]/25 pointer-events-none" />

              <div className="relative px-6 pt-14 pb-16 bg-[#f0ddbf]/80 backdrop-blur-[1.5px] border border-[#8b633d]/30 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[78%] h-6 rounded-b-full bg-[#9b6f45]/10 blur-md" />
                <div className="absolute -top-5 left-0 right-0 mx-auto h-10 w-[82%] rounded-full bg-[#c69a67]/18 blur-xl" />

                <p
                  className="text-[11px] tracking-[0.35em] uppercase text-[#7b5537] opacity-90 mb-7"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ✧ A Szövetség Megköttetik ✧
                </p>

                <h1
                  className="text-[46px] leading-none text-[#3a2416] mb-5"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Eszter <span className="text-[#8d5d38]">&</span> Péter
                </h1>

                <div className="flex items-center justify-center gap-3 my-7">
                  <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#8b5d37]" />
                  <div className="w-2 h-2 rotate-45 border border-[#8b5d37]" />
                  <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#8b5d37]" />
                </div>

                <p
                  className="text-[22px] tracking-[0.12em] text-[#4f3524] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  2026.10.03
                </p>

                <p className="mt-10 text-[#6f4a31] italic text-lg leading-relaxed">
                  „Két út találkozott...”
                  <br />
                  „Egy közös történet kezdődött...”
                </p>

                <div
                  className="mt-12 text-[13px] tracking-[0.25em] uppercase text-[#7a5434] opacity-80"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Görgess tovább
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel story-panel relative h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/story-landscape.jpg')" }}
          />
          <div className="fog-layer absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,244,220,0.16),rgba(255,244,220,0.03),rgba(20,13,9,0.35))]" />
          <div className="embers absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,168,90,0.12),transparent_18%),radial-gradient(circle_at_75%_30%,rgba(255,168,90,0.08),transparent_16%),radial-gradient(circle_at_50%_80%,rgba(255,168,90,0.09),transparent_15%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.42)]" />

          <div className="content relative z-10 h-full flex items-center justify-center px-8">
            <div className="text-center max-w-[320px]">
              <p
                className="story-line text-[#f8e8cd] text-[18px] mb-6 italic"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Két út találkozott...
              </p>
              <p className="story-line text-[#f8ead6] text-[28px] leading-snug mb-6">
                Egy közös történet
                <br />
                kezdődött...
              </p>
              <p className="story-line text-[#ecd6ba] text-base leading-relaxed opacity-90">
                Egy új fejezet nyílik meg egy világban,
                ahol a szeretet erősebb minden varázslatnál.
              </p>
            </div>
          </div>
        </section>

        <section className="panel map-panel relative h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/map.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.18),rgba(20,13,9,0.28),rgba(20,13,9,0.42))]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.36)]" />

          <div className="content relative z-10 h-full flex items-center justify-center px-4">
            <div className="map-card relative w-full max-w-[360px] rounded-sm border border-[#7d5a39]/30 bg-[#ead5b3]/72 backdrop-blur-[1px] px-5 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
              <h2
                className="text-center text-[#4a2f1d] text-[28px] mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                A Térkép
              </h2>

              <div className="relative h-[420px] rounded-sm overflow-hidden border border-[#8b633d]/25 bg-[#d8bc92]/35">
                <img
                  src="/map.jpg"
                  alt="Térkép"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,240,215,0.08),transparent,rgba(20,13,9,0.1))]" />

                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="map-marker absolute"
                    style={{ top: marker.top, left: marker.left }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 rounded-full bg-[#9e3d22] border-2 border-[#f7d7ae] shadow-[0_0_18px_rgba(255,135,60,0.55)]" />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-[12px] text-[#3c2416] bg-[#f3dfc0] border border-[#8b633d]/30 shadow-md">
                        {marker.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-[#5b3a25] text-sm leading-relaxed">
                Polgári: Miskolci Városháza
                <br />
                Ünneplés: Boróka Tábor, Nagyvisnyó
              </p>
            </div>
          </div>
        </section>

        <section className="panel timeline-panel relative h-screen w-full overflow-hidden bg-[#1d120c]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,180,90,0.08),transparent_45%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.5)]" />

          <div className="content relative z-10 h-full flex items-center justify-center px-5">
            <div className="w-full max-w-[360px]">
              <h2
                className="text-center text-[#f2dfc1] text-[30px] mb-6"
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
                      className="timeline-item relative rounded-sm border border-[#8a603b]/30 bg-[#f2dec0]/9 backdrop-blur-[1px] px-4 py-4 ml-4"
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

              <p className="text-center text-[#d8b48b] text-sm mt-6 tracking-wide">
                Visszajelzés határideje: 2026.08.15
              </p>
            </div>
          </div>
        </section>

        <section className="panel rsvp-panel relative h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/envelope-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.58),rgba(20,13,9,0.25),rgba(20,13,9,0.74))]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.5)]" />

          <div className="content relative z-10 h-full flex items-center justify-center px-5">
            <div className="w-full max-w-[350px] text-center border border-[#8b633d]/30 bg-[#eed9ba]/78 px-6 py-10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
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
        </section>
      </div>
    </main>
  );
}