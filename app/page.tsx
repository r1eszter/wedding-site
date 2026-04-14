"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
  time: string;
  title: string;
  subtitle?: string;
  icon: string;
};

const timeline: TimelineItem[] = [
  {
    time: "13:00",
    title: "Polgári szertartás",
    subtitle: "Miskolci Városháza",
    icon: "💍",
  },
  {
    time: "16:00",
    title: "Vendégváró",
    subtitle: "Nagyvisnyó",
    icon: "🍷",
  },
  {
    time: "17:00",
    title: "Szertartás",
    subtitle: "A történet folytatódik",
    icon: "✨",
  },
  {
    time: "18:00",
    title: "Vacsora",
    subtitle: "Lakoma",
    icon: "🍽️",
  },
  {
    time: "19:00",
    title: "Ajándék / Fotózás",
    subtitle: "Emlékek és pillanatok",
    icon: "📷",
  },
  {
    time: "20:00",
    title: "Ünneplés",
    subtitle: "Mulatság hajnalig",
    icon: "🔥",
  },
];

const miskolcMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Miskolci+V%C3%A1rosh%C3%A1za";
const borokaMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Bor%C3%B3ka+T%C3%A1bor+Nagyvisny%C3%B3";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);

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

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-card",
        { opacity: 0, y: 42, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-panel",
            start: "top 75%",
          },
        }
      );

      gsap.to(".hero-bg", {
        scale: 1.08,
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-panel",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: ".hero-panel",
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });

      gsap.fromTo(
        ".map-card",
        { opacity: 0, y: 36, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".map-panel",
            start: "top 72%",
          },
        }
      );

      ScrollTrigger.create({
        trigger: ".map-panel",
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });

      gsap.to(".map-bg", {
        scale: 1.05,
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: ".map-panel",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".floating-place",
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.18,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".map-panel",
            start: "top 60%",
          },
        }
      );

      gsap.to(".float-miskolc", {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 2.6,
        ease: "sine.inOut",
      });

      gsap.to(".float-boroka", {
        y: -14,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".quest-title",
        { opacity: 0, y: 28, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".quest-panel",
            start: "top 82%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0.35,
            y: 26,
            boxShadow: "0 0 0 rgba(255,160,60,0)",
          },
          {
            opacity: 1,
            y: 0,
            boxShadow: "0 0 24px rgba(255,160,60,0.18)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 52%",
              scrub: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".rsvp-card",
        { opacity: 0, y: 44, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".rsvp-card",
            start: "top 88%",
          },
        }
      );

      gsap.to(".quest-bg", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".quest-panel",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".quest-glow", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".quest-panel",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isOpen, isMobile]);

  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
      },
    });

    tl.to(sealRef.current, {
      scale: 1.18,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    })
      .to(
        introTextRef.current,
        {
          opacity: 0,
          y: 10,
          duration: 0.25,
          ease: "power2.in",
        },
        "<"
      )
      .to(
        flapRef.current,
        {
          rotateX: -165,
          transformOrigin: "top center",
          duration: 0.95,
          ease: "power3.inOut",
        },
        "+=0.05"
      )
      .to(
        letterRef.current,
        {
          y: -145,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.28"
      )
      .to(
        letterRef.current,
        {
          scale: 1.02,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        "-=0.2"
      )
      .to(
        introRef.current,
        {
          opacity: 0,
          duration: 0.45,
          pointerEvents: "none",
        },
        "+=0.2"
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
          ref={introRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#140d09] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,80,0.08),transparent_55%)] pointer-events-none" />

          <div className="relative w-[330px] h-[560px] perspective-[1600px]">
            <div
              className="absolute inset-0 bg-center bg-cover drop-shadow-[0_30px_55px_rgba(0,0,0,0.45)]"
              style={{ backgroundImage: "url('/envelope-base.png')" }}
            />

            <div
              ref={letterRef}
              className="absolute left-1/2 bottom-[102px] -translate-x-1/2 w-[250px] h-[340px] z-10"
            >
              <div
                className="relative w-full h-full bg-center bg-cover bg-no-repeat drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                style={{ backgroundImage: "url('/letter-paper.png')" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <p
                    className="text-[#6b472f] text-[14px] mb-4 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Meghívó
                  </p>
                  <h2
                    className="text-[#3e2517] text-[34px] leading-none"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Eszter
                    <br />
                    &amp;
                    <br />
                    Péter
                  </h2>
                  <p
                    className="mt-5 text-[#6b472f] text-[16px]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    2026.10.03
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={flapRef}
              className="absolute left-1/2 top-[112px] -translate-x-1/2 w-[298px] h-[170px] z-20 origin-top"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src="/envelope-flap.png"
                alt="Boríték fedél"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>

            <div className="absolute left-1/2 top-[194px] -translate-x-1/2 z-30 flex flex-col items-center">
              <button
                ref={sealRef}
                onClick={handleOpen}
                className="w-28 h-28 active:scale-95 transition-transform drop-shadow-[0_12px_26px_rgba(0,0,0,0.45)]"
                aria-label="Boríték felnyitása"
              >
                <img
                  src="/seal.png"
                  alt="Pecsét"
                  className="w-full h-full object-contain"
                />
              </button>

              <div
                ref={introTextRef}
                className="mt-8 text-center"
              >
                <p
                  className="text-[#f2dfc2] text-[15px] mb-4 opacity-95"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Egy üzenet vár rád...
                </p>

                <button
                  onClick={handleOpen}
                  className="px-5 py-3 text-[#f6e6cb] border border-[#8d6039] bg-[#3a2417]/85 rounded-sm tracking-wide shadow-lg"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Törd meg a pecsétet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={isOpen ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        <section className="hero-panel relative h-screen w-full overflow-hidden">
          <div
            className="hero-bg absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,13,9,0.65),rgba(20,13,9,0.15),rgba(20,13,9,0.75))]" />
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.45)]" />

          <div className="relative z-10 h-full flex items-center justify-center px-5">
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
    </main>
  );
}