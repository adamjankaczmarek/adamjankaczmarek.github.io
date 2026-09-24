import { useEffect, useRef } from "react";

type Theme = "dark" | "light";

function cssVarToHexNumber(varName: string): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0xffffff;
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return (r << 16) | (g << 8) | b;
}

// Mid-lightness gray-blue tones (not the bright teal primary) so the lit surface
// reads as a subtle gray backdrop rather than a loud color block.
const WAVE_COLOR: Record<Theme, number> = {
  dark: 0x2f3947,
  light: 0x94a3b8,
};

export function VantaWavesBackground({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [THREE, { default: WAVES }] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.waves.min"),
      ]);
      if (cancelled || !ref.current) return;

      effect = WAVES({
        THREE,
        el: ref.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundAlpha: 0,
        backgroundColor: cssVarToHexNumber("--background"),
        color: WAVE_COLOR[theme],
        shininess: 18,
        waveHeight: 15,
        waveSpeed: 0.8,
        zoom: 1,
      });
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, [theme]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-30 pointer-events-none"
      style={{
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)",
        opacity: theme === "dark" ? 0.35 : 0.4,
      }}
    />
  );
}
