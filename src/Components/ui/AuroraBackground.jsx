import React from "react";

// Reusable animated aurora mesh: layered blurred gradient blobs + a fine grid,
// masked so it fades out toward the edges. Sits behind content (-z-10).
const AuroraBackground = ({ variant = "light", grid = true, className = "" }) => {
  const dark = variant === "dark";
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {grid && (
        <div
          className={`absolute inset-0 ${dark ? "opacity-[0.08]" : "opacity-[0.5]"} bg-grid`}
          style={{
            maskImage: "radial-gradient(ellipse 75% 60% at 50% 0%, #000 45%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 0%, #000 45%, transparent 100%)",
          }}
        />
      )}

      {/* Aurora blobs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[40rem]">
        <div className="absolute left-0 top-0 w-[34rem] h-[34rem] rounded-full blur-[120px] animate-aurora"
             style={{ background: "radial-gradient(circle, rgba(37,99,235,0.45), transparent 65%)" }} />
        <div className="absolute right-0 top-10 w-[30rem] h-[30rem] rounded-full blur-[120px] animate-aurora"
             style={{ background: "radial-gradient(circle, rgba(99,102,241,0.40), transparent 65%)", animationDelay: "-7s" }} />
        <div className="absolute left-1/3 top-24 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-aurora"
             style={{ background: "radial-gradient(circle, rgba(6,182,212,0.35), transparent 65%)", animationDelay: "-14s" }} />
      </div>
    </div>
  );
};

export default AuroraBackground;
