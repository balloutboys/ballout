import { site } from "@/site.config";

const name = (src: string) => src.split("/").pop()!.replace(/(-v)?\.mp4$/, "");

export type Place = { tx: number; ty: number; zoom: number; gap: number };

/**
 * Size and place a background clip so the hitter (site.clipFocus) lands at a target point:
 * tx = fraction of box width, ty = pixels from the top, zoom = extra scale over "cover",
 * gap = how far (px) the clip may slide right, leaving open space on the left behind the text.
 */
export function placeVideo(v: HTMLVideoElement, box: HTMLElement, p: Place) {
  const vw = v.videoWidth, vh = v.videoHeight;
  if (!vw || !vh) return;
  const src = v.getAttribute("src") || "";
  const f = site.clipFocus[name(src)];
  const vertical = /-v\.mp4$/.test(src) || vh > vw;
  const fx = f ? (vertical ? f.vx ?? 0.5 : f.x) : 0.5;
  const fy = f ? (vertical ? f.vy : f.y) : 0.5;
  const W = box.clientWidth, H = box.clientHeight;
  const s = Math.max(W / vw, H / vh) * p.zoom;
  const dw = vw * s, dh = vh * s;
  const left = Math.min(Math.max(p.tx * W - fx * dw, W - dw), p.gap);
  const top = Math.min(Math.max(p.ty - fy * dh, H - dh), 0);
  Object.assign(v.style, { inset: "auto", left: `${left}px`, top: `${top}px`, width: `${dw}px`, height: `${dh}px`, objectFit: "fill" });
  v.classList.toggle("edge-fade", left > 1);
}

/** Place every clip in a box now, when each clip loads, and when the box resizes. */
export function bindPlacement(box: HTMLElement, place: () => Place) {
  const run = () => { const p = place(); box.querySelectorAll("video").forEach((v) => placeVideo(v, box, p)); };
  const vids = [...box.querySelectorAll("video")];
  vids.forEach((v) => v.addEventListener("loadedmetadata", run));
  const ro = new ResizeObserver(run);
  ro.observe(box);
  run();
  return () => { vids.forEach((v) => v.removeEventListener("loadedmetadata", run)); ro.disconnect(); };
}

export const isPhone = () => window.matchMedia("(max-width: 760px) and (orientation: portrait)").matches;
