import React from "react";
import styled from "styled-components";
import followerImg from "../assets/orange.png";

/** Tunables */
const TRAIL_LENGTH = 8;     // how many ghosts follow
const TRAIL_DELAY = 1;      // frames skipped between trail samples (higher = more spaced)
const OFFSET = { x: 0, y: 0 }; // pixel offset from the real cursor
const BASE_SIZE = 84;       // px width of the main follower image
const SCALE_FALLOFF = 0.08; // how much each ghost shrinks
const OPACITY_FALLOFF = 0.11; // how much each ghost fades

const Layer = styled.img`
  position: fixed;
  width: ${p => p.$w || BASE_SIZE}px;
  height: auto;
  left: 0; top: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) translate(${p => p.$x}px, ${p => p.$y}px) scale(${p => p.$scale || 1});
  opacity: ${p => p.$opacity ?? 1};
  z-index: ${p => p.$z || 9999};
  filter: drop-shadow(0 8px 16px rgba(0,0,0,.45));
  will-change: transform, opacity;
`;

export default function CursorFollower() {
  const mainRef = React.useRef(null);
  const ghostsRef = React.useRef(Array.from({ length: TRAIL_LENGTH }, () => React.createRef()));

  const target = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = React.useRef({ x: target.current.x, y: target.current.y });

  const frameRef = React.useRef(0);
  const tickRef = React.useRef(0);

  // trail buffers store previous positions
  const trail = React.useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: target.current.x, y: target.current.y })));

  React.useEffect(() => {
    const onMove = e => {
      target.current.x = e.clientX + OFFSET.x;
      target.current.y = e.clientY + OFFSET.y;
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      // ease main follower toward target
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;

      // update main follower
      if (mainRef.current) {
        mainRef.current.style.transform =
          `translate(-50%, -50%) translate(${pos.current.x}px, ${pos.current.y}px) scale(1)`;
      }

      // every TRAIL_DELAY frames, push current pos to the trail
      if ((tickRef.current++ % TRAIL_DELAY) === 0) {
        trail.current.pop(); // drop oldest
        trail.current.unshift({ x: pos.current.x, y: pos.current.y }); // add newest to front
      }

      // paint ghosts with falloff
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const g = ghostsRef.current[i].current;
        const sample = trail.current[i];
        if (!g || !sample) continue;

        const scale = 1 - (i + 1) * SCALE_FALLOFF;
        const opacity = Math.max(0, 1 - (i + 1) * OPACITY_FALLOFF);
        g.style.transform =
          `translate(-50%, -50%) translate(${sample.x}px, ${sample.y}px) scale(${scale})`;
        g.style.opacity = String(opacity);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // hide on touch devices
  React.useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      if (mainRef.current) mainRef.current.style.display = "none";
      ghostsRef.current.forEach(r => r.current && (r.current.style.display = "none"));
    }
  }, []);

  return (
    <>
      {/* main follower */}
      <Layer ref={mainRef} src={followerImg} alt="" aria-hidden="true" $w={BASE_SIZE} $z={10000} />
      {/* ghost trail */}
      {ghostsRef.current.map((ref, i) => (
        <Layer key={i} ref={ref} src={followerImg} alt="" aria-hidden="true" $w={BASE_SIZE} $z={9998 - i} />
      ))}
    </>
  );
}
