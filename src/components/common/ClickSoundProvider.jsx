import { useEffect } from "react";

function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // audio not supported
  }
}

export default function ClickSoundProvider({ children }) {
  useEffect(() => {
    const handler = (e) => {
      let el = e.target;
      let isButton = false;
      while (el && el !== document.body) {
        if (
          el.tagName === "BUTTON" ||
          el.getAttribute("role") === "button" ||
          el.classList.contains("cursor-pointer")
        ) {
          isButton = true;
          break;
        }
        el = el.parentElement;
      }
      if (isButton) {
        playClickSound();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return children;
}
