import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { asset } from '../lib/asset.js';

// Inline info icon that reveals helper text.
//   • Desktop / web: hovering the icon shows the tooltip (CSS :hover).
//   • Touch / app build: tapping toggles it (the `open` state + class), since
//     touch devices have no hover. The same markup serves both triggers.
// Each line is shown with a leading "*" footnote marker, normalised so the
// source i18n strings can include or omit their own asterisk. On hover/open the
// popover is clamped horizontally so it never spills outside the .page frame.
export default function InfoTip({ lines, label = 'More info' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const popRef = useRef(null);
  const items = (Array.isArray(lines) ? lines : [lines])
    .filter(Boolean)
    .map((line) => `* ${String(line).replace(/^\*\s*/, '')}`);

  // Keep the popover inside the phone frame: measure it centred, then push it
  // back in if either edge would overflow the .page bounds (falls back to the
  // viewport). Runs on hover-enter and whenever it opens by tap.
  const clamp = useCallback(() => {
    const pop = popRef.current;
    if (!pop) return;
    pop.style.setProperty('--tip-dx', '0px');
    const r = pop.getBoundingClientRect();
    const page = pop.closest('.page');
    const b = page ? page.getBoundingClientRect() : { left: 0, right: window.innerWidth };
    const margin = 8;
    let dx = 0;
    if (r.left < b.left + margin) dx = (b.left + margin) - r.left;
    else if (r.right > b.right - margin) dx = (b.right - margin) - r.right;
    pop.style.setProperty('--tip-dx', `${Math.round(dx)}px`);
  }, []);

  useLayoutEffect(() => { if (open) clamp(); }, [open, clamp]);

  // Tap-to-open needs tap-elsewhere-to-close, else a touch-opened tooltip stays
  // pinned after the user's attention moves on.
  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointer);
    return () => document.removeEventListener('pointerdown', onDocPointer);
  }, [open]);

  return (
    <span
      className={`infotip${open ? ' open' : ''}`}
      ref={wrapRef}
      onMouseEnter={clamp}
    >
      <button
        type="button"
        className="infotip-btn"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <img className="infotip-icon" src={asset('info.png')} alt="" aria-hidden />
      </button>
      <span className="infotip-pop" role="tooltip" ref={popRef}>
        {items.map((line, i) => (
          <span className="infotip-line" key={i}>{line}</span>
        ))}
      </span>
    </span>
  );
}
