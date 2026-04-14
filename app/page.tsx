"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const sealRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isOpen && isMobile) {
      // HERO CINEMATIC
      gsap.to(".hero-bg", {
        scale: 1.2,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
        },
      });

      gsap.fromTo(".hero-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".hero",
            start: "top 60%",
            scrub: true,
          },
        }
      );

      // STORY TEXT REVEAL
      gsap.utils.toArray(".story-line").forEach((line: any) => {
        gsap.fromTo(line,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              scrub: true,
            },
          }
        );
      });

      // MAP MARKERS
      gsap.fromTo(".map-marker",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".map-section",
            start: "top center",
          },
        }
      );

      // TIMELINE GLOW
      gsap.utils.toArray(".timeline-item").forEach((item: any) => {
        gsap.fromTo(item,
          { opacity: 0.3 },
          {
            opacity: 1,
            boxShadow: "0 0 20px rgba(212,184,150,0.6)",
            scrollTrigger: {
              trigger: item,
              start: "top 70%",
              scrub: true,
            },
          }
        );
      });

      // PARALLAX
      gsap.to(".parallax-back", {
        y: -80,
        scrollTrigger: {
          trigger: ".story",
          scrub: true,
        },
      });

      gsap.to(".parallax-front", {
        y: 80,
        scrollTrigger: {
          trigger: ".story",
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener("resize", checkMobile);
    };
  }, [isOpen]);

  const handleOpen = () => {
    gsap.to(sealRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.6,
      onComplete: () => setIsOpen(true),
    });
  };

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a120b] text-[#f4e4c1]">
        Mobile only experience 📱
      </div>
    );
  }

  return (
    <main className="bg-[#1a120b] text-[#3b2a1a] overflow-x-hidden">

      {/* OPENING */}
      {!isOpen && (
        <div ref={wrapperRef} className="fixed inset-0 flex items-center justify-center bg-[#1a120b] z-50">
          <div className="text-center">
            <div ref={sealRef} onClick={handleOpen} className="w-32 h-32 mx-auto cursor-pointer">
              <img src="/seal.png" />
            </div>
            <p className="text-[#f4e4c1] mt-4">Fogadd el a hívást</p>
          </div>
        </div>
      )}

      {isOpen && (
        <>
          {/* HERO */}
          <section className="hero h-screen relative overflow-hidden">
            <div className="hero-bg absolute inset-0 bg-[url('/paper-texture.jpg')] bg-cover" />
            
            <div className="hero-content relative z-10 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-5xl font-serif">Eszter & Péter</h1>
              <p className="mt-4">2026.10.03</p>
            </div>
          </section>

          {/* STORY */}
          <section className="story h-screen relative flex items-center justify-center overflow-hidden">
            <div className="parallax-back absolute inset-0 bg-[url('/fog.png')] opacity-30" />
            <div className="parallax-front absolute inset-0 bg-[url('/texture.png')] opacity-20" />

            <div className="relative z-10 text-center">
              <p className="story-line">Két út találkozott...</p>
              <p className="story-line">Egy történet kezdődött...</p>
            </div>
          </section>

          {/* MAP */}
          <section className="map-section h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('/map.jpg')] bg-cover opacity-70" />
            
            <div className="relative z-10">
              <div className="map-marker absolute top-[40%] left-[40%] bg-[#d4b896] px-3 py-1">Városháza</div>
              <div className="map-marker absolute top-[60%] left-[60%] bg-[#d4b896] px-3 py-1">Boróka Tábor</div>
            </div>
          </section>

          {/* TIMELINE */}
          <section className="h-screen flex flex-col justify-center items-center gap-4">
            {[
              "13:00 Polgári",
              "16:00 Vendégváró",
              "17:00 Szertartás",
              "18:00 Vacsora",
              "20:00 Ünneplés"
            ].map((item, i) => (
              <div key={i} className="timeline-item px-6 py-3 border border-[#d4b896]">
                {item}
              </div>
            ))}
          </section>

          {/* RSVP */}
          <section className="h-screen flex flex-col items-center justify-center">
            <h2 className="text-3xl mb-6">Válaszolj a hívásra</h2>
            <button className="bg-[#d4b896] px-6 py-3">RSVP</button>
          </section>
        </>
      )}
    </main>
  );
}