"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Mobil check
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) {
      const sections = gsap.utils.toArray(".panel");
      
      sections.forEach((panel: any, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true, // Itt rögzítjük a szekciót
          pinSpacing: false, // Ez engedi, hogy a következő rácsússzon
          snap: 1, // "Odaragad" a kártya széle a tetejéhez
        });

        // Belső tartalom animációja, ahogy ráúszik a következő
        gsap.fromTo(panel.querySelector(".content"), 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-10 bg-[#1a120b] text-[#f4e4c1]">
        <h1 className="text-2xl font-serif">Ezt az élményt mobilra terveztük. Kérlek, nyisd meg telefonon! 📱</h1>
      </div>
    );
  }

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
