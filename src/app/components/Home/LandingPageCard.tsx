"use client";

import { useState, useRef, useEffect } from "react";
import { NavbarLink } from "../Navbar";
import * as THREE from "three";

export const LandingPageCard = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    const initializeVanta = async () => {
      const FOG = await import("vanta/dist/vanta.fog.min");
      if (!vantaEffect) {
        setVantaEffect(
          FOG.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            highlightColor: 0x8f0098,
            midtoneColor: 0x2b005c,
            lowlightColor: 0x12002d,
            baseColor: 0xe002a,
            blurFactor: 0.75,
            speed: 2.0,
            zoom: 0.25,
          }),
        );
      }
    };

    initializeVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      className="flex flex-col items-center gap-12 px-48 py-20 w-fit m-auto border-2 rounded-3xl border-primary-light bg-[#170021] overflow-hidden shadow-neon"
      ref={vantaRef}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold">
          Build in <span className="underline">seconds</span> your Shopify frame
        </h1>
        <h2 className="text-3xl text-default-600">
          Let users fill their 🛒 directly on{" "}
          <span className="text-primary font-bold">Farcaster</span>
        </h2>
      </div>
      <div className="flex gap-2">
        <p className="text-xl text-default-600">Start now and</p>
        <NavbarLink
          href={"/dashboard"}
          isSelected={false}
          className="text-xl font-bold"
        >
          create
        </NavbarLink>{" "}
        <p className="text-xl text-default-600">your first Showcase</p>
      </div>
    </div>
  );
};
