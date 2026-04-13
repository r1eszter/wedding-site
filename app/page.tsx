"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false); // A tekercs állapota
  const [isMobile, setIsMobile] = useState(true);
  
  const sealRef = useRef(null);
  const leftPaperRef = useRef(null);
  const rightPaperRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Mobil ellenőrzés
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleOpen = () => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpen(true) // Miután lefutott, jöhet a fő tartalom
    });

    // 1. Pecsét leesik/eltörik és eltűnik
    tl.to(sealRef.current, { 
      scale: 1.5, 
      opacity: 0, 
      duration: 0.6, 
      ease: "back.in(1.7)" 
    })
    // 2. A két papírfél szétnyílik (mint egy kapu vagy tekercs)
    .to([leftPaperRef.current, rightPaperRef.current], {
      width: 0,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.1
    }, "-=0.2")
    // 3. Az egész fekete réteg elhalványul
    .to(wrapperRef.current, {
      opacity: 0,
      display: "none",
      duration: 0.5
    });
  };

  if (!isMobile) {
    return <div className="h-screen flex items-center justify-center">Csak mobilon elérhető 📱</div>;
  }

  return (
    <div className="relative overflow-x-hidden bg-[#1a120b]">
      
      {/* --- PARCHMENT OVERLAY (Az elején látszódik) --- */}
      {!isOpen && (
        <div 
          ref={wrapperRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a120b] overflow-hidden"
        >
          {/* Bal oldali papírfél */}
          <div 
            ref={leftPaperRef}
            className="absolute left-0 top-0 h-full w-1/2 bg-[#f4e4c1] border-r border-[#d4b896] shadow-2xl z-10"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />
          
          {/* Jobb oldali papírfél */}
          <div 
            ref={rightPaperRef}
            className="absolute right-0 top-0 h-full w-1/2 bg-[#f4e4c1] border-l border-[#d4b896] shadow-2xl z-10"
            style={{ backgroundImage: "url('/paper-texture.jpg')" }}
          />

          {/* A Pecsét (Kattintható) */}
          <div className="z-20 flex flex-col items-center">
            <div 
              ref={sealRef}
              onClick={handleOpen}
              className="w-32 h-32 bg-red-800 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer active:scale-90 transition-transform border-4 border-red-950"
            >
              <span className="text-[#f4e4c1] font-serif text-4xl select-none">E&P</span>
              {/* Ide jöhet a seal.png is: <img src="/seal.png" alt="Seal" /> */}
            </div>
            <p className="text-[#f4e4c1] mt-6 font-serif animate-pulse tracking-widest uppercase text-sm">
              Kattints a feltöréshez
            </p>
          </div>
        </div>
      )}

  return (
    <main ref={containerRef} className="bg-[#1a120b]">
      {/* 1. SECTION: HERO */}
      <section className="panel h-screen w-full flex items-center justify-center sticky top-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-[#f4e4c1]">
        <div className="content text-center p-8 border-2 border-[#d4b896] m-4 rounded-sm shadow-2xl">
          <h1 className="text-5xl font-serif mb-2">Eszter & Péter</h1>
          <div className="h-px w-20 bg-[#3b2a1a] mx-auto my-4"></div>
          <p className="text-xl tracking-widest uppercase">2026.10.03</p>
          <p className="italic mt-6 text-[#8b5e34]">A Gyűrű Szövetsége útnak indul</p>
        </div>
      </section>

      {/* 2. SECTION: STORY */}
      <section className="panel h-screen w-full flex items-center justify-center bg-[#fdf6e3] shadow-[0_-10px_50px_rgba(0,0,0,0.3)]">
        <div className="content p-10 text-center">
          <h2 className="text-3xl font-serif mb-6 text-[#5d4037]">Történetünk</h2>
          <p className="leading-relaxed text-lg italic text-[#3b2a1a]">
            "Nem mindenki téved el, aki vándorol..." <br/>
            Közös kalandunk új fejezetéhez érkeztünk.
          </p>
        </div>
      </section>

      {/* 3. SECTION: LOCATION */}
      <section className="panel h-screen w-full flex items-center justify-center bg-[#f4e4c1] shadow-[0_-10px_50px_rgba(0,0,0,0.3)]">
        <div className="content p-10 text-center border-x border-[#d4b896]">
          <h2 className="text-3xl font-serif mb-4">Helyszín</h2>
          <p className="font-bold uppercase tracking-tighter">Miskolci Városháza</p>
          <p className="mt-2 text-[#8b5e34]">Ezt követően: Boróka Tábor</p>
          <button className="mt-8 px-6 py-2 border border-[#3b2a1a] hover:bg-[#3b2a1a] hover:text-white transition-all uppercase text-sm tracking-widest">
            Térkép megnyitása
          </button>
        </div>
      </section>

      {/* 4. SECTION: RSVP */}
      <section className="panel h-screen w-full flex items-center justify-center bg-[#3b2a1a] text-[#f4e4c1]">
        <div className="content w-full max-w-xs text-center">
          <h2 className="text-3xl font-serif mb-8 text-[#d4b896]">Visszajelzés</h2>
          <div className="flex flex-col gap-4">
            <input 
              placeholder="Neved" 
              className="bg-transparent border-b border-[#d4b896] p-2 outline-none focus:border-white transition-colors"
            />
            <button className="mt-4 bg-[#d4b896] text-[#3b2a1a] py-3 font-bold uppercase tracking-widest active:scale-95 transition-transform">
              Ott leszek!
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
