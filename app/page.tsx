"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isMobile, setIsMobile] = useState(true);
  const sectionsRef = useRef([]);
  const heroRef = useRef(null);
  const parchmentRef = useRef(null);

  useEffect(() => {
    // MOBILE CHECK
    if (window.innerWidth > 768) {
      setIsMobile(false);
    }

    // SCROLL ANIMATIONS
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });

// PARCHMENT OPEN
    gsap.fromTo(
      parchmentRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power4.out",
      }
    );

    // PARALLAX
    gsap.to(heroRef.current, {
      backgroundPosition: "50% 70%",
      scrollTrigger: {
        trigger: heroRef.current,
        scrub: true,
      },
    });
  }, []);

  const addRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  if (!isMobile) {
    return (
      <div className="h-screen flex items-center justify-center text-center p-10">
        <h1>This experience is designed for mobile devices 📱</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#f4e4c1] text-[#3b2a1a] font-serif">
      {/* HERO */}
      <section
        ref={heroRef}
        className="h-screen flex items-center justify-center bg-[url('/paper.jpg')] bg-cover"
      >
        <div
          ref={parchmentRef}
          className="bg-[#f4e4c1]/90 p-8 rounded-xl shadow-xl border border-[#d4b896] text-center"
        >
          <h1 className="text-4xl font-bold">Eszter & Péter</h1>
          <p className="mt-2">2026.10.03</p>
          <p className="italic mt-4">The Fellowship Begins</p>
        </div>
      </section>

      {/* STORY */}
      <section ref={addRef} className="h-screen flex items-center justify-center p-6 text-center">
        <p>Our story begins...</p>
      </section>

      {/* LOCATION */}
      <section ref={addRef} className="h-screen flex flex-col items-center justify-center p-6">
        <h2>The Map</h2>
        <p>Miskolci Városháza</p>
        <p>Boróka Tábor</p>
      </section>

      {/* SCHEDULE */}
      <section ref={addRef} className="h-screen flex flex-col items-center justify-center">
        <h2>The Quest</h2>
        <p>13:00 Polgári</p>
        <p>16:00 Vendégváró</p>
        <p>17:00 Szertartás</p>
      </section>

      {/* RSVP */}
      <section ref={addRef} className="h-screen flex flex-col items-center justify-center p-6">
        <h2>Answer the Call</h2>
        <input placeholder="Name" className="p-2 border" />
        <button className="mt-3 p-2 bg-black text-white">Send</button>
      </section>
    </div>
  );
}