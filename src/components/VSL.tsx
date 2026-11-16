import { Play } from "./Icons";

function toEmbed(url: string): { kind: "iframe" | "video"; src: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0` };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  return { kind: "iframe", src: url };
}

export default function VSL({ url, title }: { url: string; title: string }) {
  if (!url) {
    return (
      <div className="vsl">
        <div className="vsl-empty">
          <div>
            <div className="play"><Play /></div>
            <p className="h-sm" style={{ fontFamily: "var(--fh)", fontWeight: 800, textTransform: "uppercase" }}>{title}</p>
            <p className="muted" style={{ marginTop: 6 }}>Video coming soon</p>
          </div>
        </div>
      </div>
    );
  }
  const e = toEmbed(url);
  return (
    <div className="vsl">
      {e.kind === "video" ? (
        <video src={e.src} controls playsInline preload="metadata" />
      ) : (
        <iframe src={e.src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen loading="lazy" />
      )}
    </div>
  );
}
