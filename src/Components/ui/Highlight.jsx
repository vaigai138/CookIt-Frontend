import React from "react";

// The original CookIT accent: a key phrase with a soft multicolor glow behind it.
// Usage: <Highlight>grow your business</Highlight>
const Highlight = ({ children, className = "" }) => (
  <span className={`hl ${className}`}>
    <span className="hl-bg" aria-hidden="true" />
    <span className="hl-fg">{children}</span>
  </span>
);

export default Highlight;
