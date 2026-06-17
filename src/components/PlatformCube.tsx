"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

const faces = [
  { name: "TG", label: "Telegram", side: "front", color: "#31a8ff" },
  { name: "IG", label: "Instagram", side: "right", color: "#ff6faa" },
  { name: "FB", label: "Facebook", side: "back", color: "#5f8cff" },
  { name: "TT", label: "TikTok", side: "left", color: "#28e6c3" },
  { name: "G", label: "Google", side: "top", color: "#f8d66d" },
  { name: "ADS", label: "Traffic", side: "bottom", color: "#7667ff" },
] as const;

const orbit = [
  { name: "tg", color: "#31a8ff", angle: 0 },
  { name: "fb", color: "#5f8cff", angle: 60 },
  { name: "inst", color: "#ff6faa", angle: 120 },
  { name: "tik tok", color: "#28e6c3", angle: 180 },
  { name: "google", color: "#f8d66d", angle: 240 },
  { name: "tg ads", color: "#78d7ff", angle: 300 },
];

export default function PlatformCube() {
  const [tilt, setTilt] = useState({ x: -8, y: 24 });

  return (
    <div
      className="relative mx-auto flex h-[min(55vw,620px)] min-h-[500px] w-full max-w-[780px] items-center justify-center"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: -8 + py * -12, y: 24 + px * 22 });
      }}
      onMouseLeave={() => setTilt({ x: -8, y: 24 })}
    >
      <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_52%_30%,rgba(49,168,255,0.24),transparent_33%),radial-gradient(circle_at_68%_62%,rgba(118,103,255,0.24),transparent_38%),radial-gradient(circle_at_40%_70%,rgba(40,230,195,0.12),transparent_34%)] blur-2xl" />

      <div className="absolute bottom-[7%] h-[18%] w-[68%] rounded-[50%] border border-cyan-200/28 bg-[radial-gradient(ellipse_at_center,rgba(120,215,255,0.34),rgba(49,168,255,0.12)_38%,rgba(0,0,0,0)_70%)] shadow-[0_0_70px_rgba(49,168,255,0.35)]" />
      <div className="absolute bottom-[12%] h-[2px] w-[46%] rounded-full bg-cyan-200/70 shadow-[0_0_32px_rgba(120,215,255,0.85)]" />

      <div className="cube-scene relative z-10 h-[390px] w-[390px] sm:h-[470px] sm:w-[470px]">
        <div
          className="cube-wrap"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <div className="cube-auto">
            {faces.map((face) => (
              <div
                key={face.side}
                className={`cube-face cube-face-${face.side}`}
                style={{ "--face-color": face.color } as CSSProperties}
              >
                <div className="face-ring" />
                <LogoMark name={face.name} color={face.color} />
                <span>{face.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="platform-orbit" aria-hidden="true">
          {orbit.map((item) => (
            <span
              key={`${item.name}-${item.angle}`}
              className="platform-chip"
              style={
                {
                  "--angle": `${item.angle}deg`,
                  "--chip-color": item.color,
                } as CSSProperties
              }
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute right-3 top-5 rounded-full border border-white/12 bg-white/[0.055] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-50/80 backdrop-blur-xl">
        draggable cube / live
      </div>
    </div>
  );
}

function LogoMark({ name, color }: { name: string; color: string }) {
  if (name === "TG") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <path
          d="M8 29 56 10 45 54 31 41 22 49 24 36 8 29Z"
          fill={color}
          opacity="0.95"
        />
        <path d="M24 36 45 18 31 41" fill="#fff" opacity="0.23" />
      </svg>
    );
  }

  if (name === "IG") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <rect x="12" y="12" width="40" height="40" rx="12" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="32" cy="32" r="9" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="44" cy="20" r="3.2" fill={color} />
      </svg>
    );
  }

  return (
    <div className="font-hero text-[4rem] font-black leading-none" style={{ color }}>
      {name}
    </div>
  );
}
