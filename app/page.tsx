"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Refek az animációkhoz
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const leftPaperRef = useRef<HTMLDivElement>(null);
  const rightPaperRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Csak ha már kinyitották a tekercset ÉS mobil
    if (isOpen && isMobile) {
      const sections = gsap.utils.toArray(".panel");
      
      sections.forEach((panel: any) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: false,
          snap: 1,
        });

        gsap.fromTo(
          panel.querySelector(".content"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("resize", checkMobile);
    };
  }, [isOpen, isMobile]);

  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(true),
    });

    tl.to(sealRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.6,
      ease: "back.in(1.7)",
    })
    .to([leftPaperRef.current, rightPaperRef.current], {
      width: 0,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.1,
    }, "-=0.2")
    .to(wrapperRef.current, {
      opacity: 0,
      display: "none",
      duration: 0.5,
    });
  };

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-10 bg-[#1a120b] text-[#f4e4c1]">
        <h1 className="text-2xl font-serif">Kérlek, mobil eszközön nézd meg a meghívót! 📱</h1>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="bg-[#1a120b] relative overflow-x-hidden">
      
      {/* 1. PARCHMENT OVERLAY (Az elején látszódik) */}
      {!isOpen && (
        <div 
          ref={wrapperRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a120b] overflow-hidden"
        >
          <div 
            ref={leftPaperRef}
            className="absolute left-0 top-0 h-full w-1/2 bg-[#f4e4c1] border-r border-[#d4b896] shadow-2xl z-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
          />
          <div 
            ref={rightPaperRef}
            className="absolute right-0 top-0 h-full w-1/2 bg-[#f4e4c1] border-l border-[#d4b896] shadow-2xl z-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
          />

          {/* pecsét */} 
          <div className="z-20 flex flex-col items-center">
            <div 
              ref={sealRef}
              onClick={handleOpen}
              className="w-40 h-40 cursor-pointer active:scale-95 transition-transform drop-shadow-2xl"
            >
              {/* A kép beillesztése */}
              <img 
                src="/seal.png" 
                alt="Wedding Seal" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[#f4e4c1] mt-6 font-serif animate-pulse tracking-widest uppercase text-sm">
              Kattints a pecsétre
            </p>
          </div>
        </div>
      )}

      {/* 2. FŐ TARTALOM (Csak nyitás után) */}
      <div className={isOpen ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        
        {/* HERO SECTION */}
        <section className="panel h-screen w-full flex items-center justify-center bg-[#f4e4c1] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
          <div className="content text-center p-8 border-2 border-[#d4b896] m-4 rounded-sm shadow-xl">
            <h1 className="text-5xl font-serif mb-2 text-[#3b2a1a]">Eszter & Péter</h1>
            <div className="h-px w-20 bg-[#3b2a1a] mx-auto my-4"></div>
            <p className="text-xl tracking-widest uppercase text-[#3b2a1a]">2026.10.03</p>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="panel h-screen w-full flex items-center justify-center bg-[#fdf6e3] shadow-[0_-10px_50px_rgba(0,0,0,0.3)]">
          <div className="content p-10 text-center">
            <h2 className="text-3xl font-serif mb-6 text-[#5d4037]">Történetünk</h2>
            <p className="leading-relaxed text-lg italic text-[#3b2a1a]">
              Minden egy véletlen találkozással kezdődött...
            </p>
          </div>
        </section>

        {/* RSVP SECTION */}
        <section className="panel h-screen w-full flex items-center justify-center bg-[#3b2a1a] text-[#f4e4c1]">
          <div className="content w-full max-w-xs text-center">
            <h2 className="text-3xl font-serif mb-8 text-[#d4b896]">Ott lesztek?</h2>
            <button className="bg-[#d4b896] text-[#3b2a1a] px-8 py-3 font-bold uppercase tracking-widest">
              Visszajelzés
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
