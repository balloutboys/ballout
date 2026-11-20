/**
 * iPhone Safari only autoplays a video that is muted *before* it loads. React doesn't write the
 * `muted` HTML attribute, so set it (and its friends) directly on the element.
 */
export function prepAutoplay(v: HTMLVideoElement | null) {
  if (!v) return;
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
}

/** Try to play; if the phone refuses (e.g. before any interaction), retry on the first touch/scroll/return to tab. */
export function playWithRetry(get: () => HTMLVideoElement | null | undefined) {
  const tryPlay = () => {
    const v = get();
    if (!v) return;
    prepAutoplay(v);
    const p = v.play();
    if (p) p.catch(() => {});
  };
  tryPlay();
  const events = ["touchstart", "scroll", "click"] as const;
  const once = () => { tryPlay(); events.forEach((e) => window.removeEventListener(e, once)); };
  events.forEach((e) => window.addEventListener(e, once, { passive: true, once: true }));
  const vis = () => { if (document.visibilityState === "visible") tryPlay(); };
  document.addEventListener("visibilitychange", vis);
  return () => {
    events.forEach((e) => window.removeEventListener(e, once));
    document.removeEventListener("visibilitychange", vis);
  };
}
