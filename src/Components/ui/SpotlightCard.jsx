import React, { useRef, useState } from "react";

// A card with a soft radial glow that follows the cursor, plus a subtle lift.
// Pure CSS/JS (no deps). Compose by passing className + children.
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(37,99,235,0.16)", as: Tag = "div", ...rest }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`group relative overflow-hidden transition-all duration-300 ${className}`}
      {...rest}
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
};

export default SpotlightCard;
