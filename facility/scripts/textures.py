"""Procedural textures for the Suite 204 facility model (tileable where it matters)."""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

REPO = "/home/user/ballout"
OUT = sys.argv[1] if len(sys.argv) > 1 else "tex"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(204)
FONT_BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONT_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FONT_XB = "/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf"


def fnoise(size, beta, aniso=(1.0, 1.0)):
    """Tileable 1/f^beta noise in 0..1. aniso stretches frequencies (x, y)."""
    w = rng.standard_normal((size, size))
    F = np.fft.fft2(w)
    fy = np.fft.fftfreq(size)[:, None] * aniso[1]
    fx = np.fft.fftfreq(size)[None, :] * aniso[0]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1
    F /= f ** beta
    F[0, 0] = 0
    n = np.real(np.fft.ifft2(F))
    n -= n.min()
    n /= n.max()
    return n


def save_rgb(arr, name, q=90):
    arr = np.clip(arr, 0, 1)
    im = Image.fromarray((arr * 255).astype(np.uint8), "RGB")
    path = os.path.join(OUT, name)
    if name.endswith(".jpg"):
        im.save(path, quality=q)
    else:
        im.save(path)


def normal_from_height(h, strength):
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    nx, ny, nz = -dx * strength, dy * strength, np.ones_like(h)
    l = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    n = np.stack([nx / l, ny / l, nz / l], -1)
    return n * 0.5 + 0.5


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def colorize(t, c0, c1):
    t = t[..., None]
    return hexc(c0) * (1 - t) + hexc(c1) * t


S = 1024

# ---------- Turf (tile = 6 ft) ----------
blades = fnoise(S, 0.15)
mid = fnoise(S, 1.2)
low = fnoise(S, 2.2)
t = 0.55 * blades + 0.25 * mid + 0.20 * low
turf = colorize(t, "#1f5a22", "#4f9a3c")
# faint lane stitching every 2 ft (seams between turf rolls)
yy = np.arange(S)[:, None] * np.ones((1, S))
turf *= (1 - 0.06 * (np.abs(((yy / (S / 3)) % 1) - 0.5) > 0.497))[..., None]
save_rgb(turf, "turf.jpg")
save_rgb(normal_from_height(blades * 0.7 + mid * 0.3, 6.0), "turf_n.jpg")

# ---------- Rubber flooring (tile = 4 ft, 4x4 tiles of 1 ft? we do 2x2 ft mats) ----------
base = fnoise(S, 0.8) * 0.5 + fnoise(S, 2.0) * 0.5
rub = colorize(base, "#16181c", "#24272c")
fleck = rng.random((S, S))
spk = Image.fromarray(((fleck > 0.985) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
spk = np.asarray(spk) / 255.0
colsel = rng.random((S, S))
gray = (spk > 0) & (colsel < 0.7)
blue = (spk > 0) & (colsel >= 0.7)
rub[gray] = rub[gray] * 0.3 + hexc("#5d636c") * 0.7
rub[blue] = rub[blue] * 0.3 + hexc("#1d58b8") * 0.7
# mat seams (4ft tile => 2 mats each way)
seam = np.zeros((S, S))
for k in range(2):
    p = int(k * S / 2)
    seam[:, max(p - 1, 0):p + 2] = 1
    seam[max(p - 1, 0):p + 2, :] = 1
rub *= (1 - 0.35 * seam)[..., None]
save_rgb(rub, "rubber.jpg")
save_rgb(normal_from_height(fnoise(S, 0.4) - seam * 0.6, 3.0), "rubber_n.jpg")


# ---------- Wood planks (generic) ----------
def planks(c0, c1, plank_w, plank_l, groove=0.55, grain_dark=0.35, gray_var=0.15):
    img = np.zeros((S, S, 3))
    h = np.zeros((S, S))
    grain = fnoise(S, 1.1, aniso=(0.08, 1.0))
    fine = fnoise(S, 0.5, aniso=(0.15, 1.0))
    rows = int(round(S / plank_w))
    for r in range(rows):
        y0, y1 = int(r * S / rows), int((r + 1) * S / rows)
        off = rng.integers(0, plank_l)
        x = 0 - off
        while x < S:
            ln = plank_l
            tone = rng.random()
            c = hexc(c0) * (1 - tone) + hexc(c1) * tone
            xs = np.arange(x, x + ln) % S
            seg_g = grain[y0:y1][:, xs]
            seg_f = fine[y0:y1][:, xs]
            col = c[None, None, :] * (1 - grain_dark * (seg_g - 0.5) - 0.18 * (seg_f - 0.5))[..., None]
            img[y0:y1][:, xs] = col
            h[y0:y1][:, xs] = 0.6 + 0.2 * seg_f
            # end joint
            img[y0:y1, xs[0]] *= groove
            h[y0:y1, xs[0]] = 0
            x += ln
        img[y0:y0 + 2] *= groove
        h[y0:y0 + 2] = 0
    return img, h


wood, wh = planks("#a8743e", "#c99256", S // 6, S // 2)
save_rgb(wood, "wood_platform.jpg")
lvp, lh = planks("#736a60", "#857b70", S // 14, int(S / 1.6), groove=0.78, grain_dark=0.3)
save_rgb(lvp, "lvp.jpg")
save_rgb(normal_from_height(lh, 2.0), "lvp_n.jpg")
lounge, loh = planks("#7a5232", "#a1703f", S // 12, S // 2, groove=0.6, grain_dark=0.45)
save_rgb(lounge, "wood_lounge.jpg")

# ---------- Restroom tile (tile = 4 ft => 2x2 of 24in) ----------
tl = colorize(fnoise(S, 1.5), "#cfd2d4", "#e4e6e7")
gr = np.zeros((S, S))
for k in range(2):
    p = int(k * S / 2)
    gr[:, max(p - 2, 0):p + 3] = 1
    gr[max(p - 2, 0):p + 3, :] = 1
tl[gr > 0] = hexc("#9a9ea2")
save_rgb(tl, "tile.jpg")

# ---------- Sealed concrete (tile = 12 ft) ----------
c = 0.5 * fnoise(S, 1.6) + 0.3 * fnoise(S, 2.6) + 0.2 * fnoise(S, 0.6)
conc = colorize(c, "#8f9295", "#b7b9bb")
save_rgb(conc, "concrete.jpg")

# ---------- Painted walls ----------
w = 0.6 * fnoise(512, 1.4) + 0.4 * fnoise(512, 0.5)
S0 = S
save_rgb(colorize(w, "#1d2025", "#262a30")[:512, :512] if False else colorize(w, "#1d2025", "#262a30"), "wall_dark.jpg")
save_rgb(colorize(w, "#c3c6c7", "#cdd0d1"), "wall_light.jpg")

# ---------- Corrugated metal (door + deck): height stripes ----------
ys = np.arange(S)
prof = 0.5 + 0.5 * np.sin(ys / S * 2 * np.pi * 16)
h = np.repeat(prof[:, None], S, 1)
save_rgb(normal_from_height(h, 25.0), "corrugated_n.jpg")

# ---------- Net (RGBA, tile = 2 ft, 1.75in mesh) ----------
NS = 512
net = np.zeros((NS, NS, 4), np.uint8)
net[..., 3] = 22
cells = 14
lw = 5
for k in range(cells):
    p = int(k * NS / cells)
    net[:, p:p + lw, :3] = 12
    net[:, p:p + lw, 3] = 255
    net[p:p + lw, :, :3] = 12
    net[p:p + lw, :, 3] = 255
# knots
for i in range(cells):
    for j in range(cells):
        x, y = int(i * NS / cells), int(j * NS / cells)
        net[max(y - 2, 0):y + lw + 2, max(x - 2, 0):x + lw + 2, 3] = 255
Image.fromarray(net, "RGBA").save(os.path.join(OUT, "net.png"))

# ---------- Keep clear hatch (RGBA) ----------
KS = 512
xx, yy = np.meshgrid(np.arange(KS), np.arange(KS))
stripe = (((xx + yy) // 32) % 2 == 0)
hatch = np.zeros((KS, KS, 4), np.uint8)
hatch[stripe] = [242, 196, 26, 235]
hatch[~stripe] = [242, 196, 26, 40]
Image.fromarray(hatch, "RGBA").save(os.path.join(OUT, "hatch.png"))


# ---------- Logo decal (brightened ATHLETICS blue) ----------
def logo_rgba(path, blue_to=(36, 112, 222)):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    isblue = (b > r + 40) & (a[..., 3] > 10)
    a[isblue, 0] = a[isblue, 0] * 0.3 + blue_to[0] * 0.7
    a[isblue, 1] = a[isblue, 1] * 0.3 + blue_to[1] * 0.7
    a[isblue, 2] = a[isblue, 2] * 0.3 + blue_to[2] * 0.7
    return Image.fromarray(a.astype(np.uint8), "RGBA")


logo = logo_rgba(f"{REPO}/public/brand/logo-transparent.png")
W = 2048
logo_big = logo.resize((W, int(W * logo.height / logo.width)), Image.LANCZOS)
# Logo + tagline stacked
tag = "BUILDING THE FOUNDATION OF AN ELITE ATHLETE"
font = ImageFont.truetype(FONT_XB, 70)
spacing = 12
tw = sum(font.getlength(ch) + spacing for ch in tag) - spacing
CW = int(max(W, tw + 40))
canvas = Image.new("RGBA", (CW, logo_big.height + 170), (0, 0, 0, 0))
canvas.paste(logo_big, ((CW - W) // 2, 0), logo_big)
d = ImageDraw.Draw(canvas)
x = (CW - tw) / 2
for ch in tag:
    d.text((x, logo_big.height + 50), ch, font=font, fill=(255, 255, 255, 235))
    x += font.getlength(ch) + spacing
canvas.save(os.path.join(OUT, "logo_wall.png"))
logo_big.save(os.path.join(OUT, "logo.png"))
print("logo_wall aspect", canvas.width / canvas.height, "logo aspect", logo_big.width / logo_big.height)

# Program banner for lobby: "THE ROTATIONAL FORCE BLUEPRINT"
bn = Image.new("RGBA", (2048, 512), (0, 0, 0, 0))
d = ImageDraw.Draw(bn)
f1 = ImageFont.truetype(FONT_BOLD, 64)
f2 = ImageFont.truetype(FONT_BLACK, 150)
d.text((1024, 120), "BALLOUTBOYS ATHLETICS PRESENTS", font=f1, fill=(120, 170, 255, 255), anchor="mm")
d.text((1024, 300), "THE ROTATIONAL FORCE", font=f2, fill=(255, 255, 255, 255), anchor="mm")
d.text((1024, 440), "BLUEPRINT™", font=f2, fill=(255, 255, 255, 255), anchor="mm")
bn.save(os.path.join(OUT, "banner.png"))


# ---------- Screens ----------
def screen_spray(path):
    Wd, Ht = 1280, 720
    im = Image.new("RGB", (Wd, Ht), (8, 14, 24))
    d = ImageDraw.Draw(im)
    cx, cy = 430, 660
    d.pieslice([cx - 560, cy - 560, cx + 560, cy + 560], 225, 315, fill=(30, 92, 46))
    d.pieslice([cx - 300, cy - 300, cx + 300, cy + 300], 225, 315, fill=(150, 104, 62))
    d.pieslice([cx - 230, cy - 230, cx + 230, cy + 230], 225, 315, fill=(36, 108, 54))
    d.line([cx, cy, cx - 396, cy - 396], fill=(240, 240, 240), width=3)
    d.line([cx, cy, cx + 396, cy - 396], fill=(240, 240, 240), width=3)
    rr = np.random.default_rng(3)
    for _ in range(26):
        ang = np.radians(rr.uniform(232, 308))
        dist = rr.uniform(120, 520)
        px, py = cx + dist * np.cos(ang), cy + dist * np.sin(ang)
        col = (255, 210, 60) if dist > 380 else (90, 160, 255)
        d.ellipse([px - 8, py - 8, px + 8, py + 8], fill=col)
    fb = ImageFont.truetype(FONT_BLACK, 64)
    fs = ImageFont.truetype(FONT_BOLD, 26)
    stats = [("EXIT VELO", "94.2", "MPH"), ("LAUNCH", "17°", "ANGLE"), ("DISTANCE", "352", "FT")]
    for i, (a, b, c) in enumerate(stats):
        y = 70 + i * 200
        d.rounded_rectangle([900, y, 1230, y + 170], 18, fill=(18, 30, 48), outline=(36, 112, 222), width=3)
        d.text((925, y + 18), a, font=fs, fill=(150, 175, 210))
        d.text((925, y + 55), b, font=fb, fill=(255, 255, 255))
        d.text((925 + fb.getlength(b) + 14, y + 92), c, font=fs, fill=(150, 175, 210))
    d.text((40, 30), "SESSION  •  CAGE 1", font=fs, fill=(150, 175, 210))
    im.save(path, quality=92)


screen_spray(os.path.join(OUT, "screen_spray.jpg"))


def screen_logo(path):
    Wd, Ht = 1280, 720
    g = np.linspace(0, 1, Ht)[:, None, None]
    bg = (hexc("#06142e") * (1 - g) + hexc("#0a3f91") * g) * np.ones((Ht, Wd, 3))
    im = Image.fromarray((bg * 255).astype(np.uint8))
    lg = logo.resize((1000, int(1000 * logo.height / logo.width)), Image.LANCZOS)
    im.paste(lg, ((Wd - lg.width) // 2, 170), lg)
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FONT_XB, 40)
    d.text((Wd // 2, 560), "BUILDING THE FOUNDATION OF AN ELITE ATHLETE", font=f, fill=(255, 255, 255), anchor="mm")
    im.save(path, quality=92)


screen_logo(os.path.join(OUT, "screen_logo.jpg"))


def screen_photo(src, path):
    im = Image.open(src).convert("RGB")
    im = ImageOps.fit(im, (1280, 720), Image.LANCZOS)
    im.save(path, quality=90)


screen_photo(f"{REPO}/public/media/athletes/team-champions.jpg", os.path.join(OUT, "screen_team.jpg"))
screen_photo(f"{REPO}/public/media/athletes/power-swing.jpg", os.path.join(OUT, "screen_swing.jpg"))

# ---------- Vending front ----------
Vw, Vh = 256, 512
im = Image.new("RGB", (Vw, Vh), (230, 238, 246))
d = ImageDraw.Draw(im)
cols = [(220, 40, 40), (30, 110, 220), (250, 190, 30), (40, 170, 90), (240, 120, 30), (150, 60, 200)]
for r in range(6):
    y = 20 + r * 76
    d.rectangle([10, y + 62, 246, y + 66], fill=(160, 170, 180))
    for cidx in range(6):
        x = 18 + cidx * 38
        c = cols[(r * 2 + cidx) % len(cols)]
        d.rounded_rectangle([x, y + 8, x + 26, y + 60], 6, fill=c)
        d.rectangle([x + 8, y, x + 18, y + 10], fill=c)
im.save(os.path.join(OUT, "vending.jpg"), quality=90)

# ---------- Weight room floor decal ----------
dec = Image.new("RGBA", (2048, 256), (0, 0, 0, 0))
d = ImageDraw.Draw(dec)
f = ImageFont.truetype(FONT_BLACK, 200)
d.text((1024, 128), "WEIGHT ROOM", font=f, fill=(255, 255, 255, 215), anchor="mm")
dec.save(os.path.join(OUT, "decal_weightroom.png"))

print("done", sorted(os.listdir(OUT)))
