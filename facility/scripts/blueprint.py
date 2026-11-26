"""Suite 204 layout v7: 2D floor plan drawn to scale from the same numbers as build.py.

python blueprint.py out.png
"""
import math, sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
S = 2                                   # supersample
W0, H0 = 1851, 2000
PX = 19.82                              # px per ft (same scale as layout v6)
OX, OY = 82, 280                        # plan origin (top-left = back-left corner)

FONT = "/usr/share/fonts/opentype/inter/"
def F(size, w="Bold"):
    name = {"Black": "InterDisplay-Black.otf", "XB": "InterDisplay-ExtraBold.otf", "Bold": "Inter-Bold.otf",
            "Semi": "Inter-SemiBold.otf", "Med": "Inter-Medium.otf", "Reg": "Inter-Regular.otf"}[w]
    return ImageFont.truetype(FONT + name, int(size * S))

BLUE = (11, 79, 160)
BLUE_D = (0, 60, 133)
BLACK = (10, 10, 12)
INK = (30, 32, 36)
MUTED = (90, 96, 104)
YEL = (247, 200, 40)
TURF = (62, 160, 72)
TURF_L = (82, 178, 90)
RUBBER = (44, 48, 56)
RUBBER_DOT = (78, 84, 94)
WOOD = (205, 158, 104)
WOOD_L = (188, 140, 88)
PLAT = (139, 90, 50)
LVP = (196, 186, 172)
LVP_L = (178, 168, 154)
TILE = (238, 241, 244)
TILE_L = (205, 210, 216)
CONC = (222, 224, 227)
CLAY = (190, 104, 64)
COUCH = (29, 90, 180)
DARKF = (52, 56, 64)
WHITE = (255, 255, 255)

img = Image.new("RGB", (W0 * S, H0 * S), WHITE)
d = ImageDraw.Draw(img)


def X(x): return (OX + x * PX) * S
def Y(y): return (OY + (77 - y) * PX) * S
def R(x0, y0, x1, y1): return [X(min(x0, x1)), Y(max(y0, y1)), X(max(x0, x1)), Y(min(y0, y1))]


def rect(x0, y0, x1, y1, fill=None, outline=None, width=2, radius=0):
    if radius:
        d.rounded_rectangle(R(x0, y0, x1, y1), radius * S, fill=fill, outline=outline, width=width * S if outline else 0)
    else:
        d.rectangle(R(x0, y0, x1, y1), fill=fill, outline=outline, width=width * S if outline else 0)


def text(x, y, s, size=12, w="Bold", fill=WHITE, anchor="mm", plan=True, rot=0):
    f = F(size, w)
    px, py = (X(x), Y(y)) if plan else (x * S, y * S)
    if rot:
        bb = d.textbbox((0, 0), s, font=f)
        tw, th = bb[2] - bb[0] + 8 * S, bb[3] - bb[1] + 8 * S
        t = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((tw / 2, th / 2), s, font=f, fill=fill, anchor="mm")
        t = t.rotate(rot, expand=True)
        img.paste(t, (int(px - t.width / 2), int(py - t.height / 2)), t)
    else:
        d.text((px, py), s, font=f, fill=fill, anchor=anchor)


def dashed(p0, p1, color, width=3, dash=10, gap=7):
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0)
    n = max(1, int(L / ((dash + gap) * S)))
    for i in range(n + 1):
        a = i * (dash + gap) * S / L
        b = min(1, (i * (dash + gap) + dash) * S / L)
        if a >= 1:
            break
        d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b, y0 + (y1 - y0) * b)], fill=color, width=width * S)


def dash_plan(x0, y0, x1, y1, color, width=3, dash=10, gap=7):
    dashed((X(x0), Y(y0)), (X(x1), Y(y1)), color, width, dash, gap)


def hatch(x0, y0, x1, y1, color, step=10, width=1):
    box = R(x0, y0, x1, y1)
    layer = Image.new("L", img.size, 0)
    ld = ImageDraw.Draw(layer)
    ld.rectangle(box, fill=255)
    lines = Image.new("RGB", img.size, color)
    mask = Image.new("L", img.size, 0)
    md = ImageDraw.Draw(mask)
    for k in range(int(box[0] - (box[3] - box[1])), int(box[2]), step * S):
        md.line([(k, box[3]), (k + (box[3] - box[1]), box[1])], fill=255, width=width * S)
    from PIL import ImageChops
    mask = ImageChops.multiply(mask, layer)
    img.paste(lines, (0, 0), mask)


def planks(x0, y0, x1, y1, base, line, plank=0.6, along="x"):
    rect(x0, y0, x1, y1, fill=base)
    if along == "x":
        y = y0
        while y < y1:
            d.line([X(x0), Y(y), X(x1), Y(y)], fill=line, width=1 * S)
            y += plank
    else:
        x = x0
        while x < x1:
            d.line([X(x), Y(y0), X(x), Y(y1)], fill=line, width=1 * S)
            x += plank


def door(hx, hy, length, start_deg, sweep=90, color=INK):
    """Door leaf + swing arc. Angles in plan degrees (0 = +x, 90 = +y)."""
    r = length * PX * S
    cx, cy = X(hx), Y(hy)
    a1 = math.radians(start_deg + sweep)
    d.line([cx, cy, cx + r * math.cos(a1), cy - r * math.sin(a1)], fill=color, width=2 * S)
    # PIL arcs: angles clockwise from +x in screen space => negate plan angles
    s0, s1 = -(start_deg + sweep), -start_deg
    d.arc([cx - r, cy - r, cx + r, cy + r], s0, s1, fill=color, width=2 * S)


def clearance(x0, y0, x1, y1):
    rect(x0, y0, x1, y1, fill=(255, 246, 205))
    for (a, b, c, e) in ((x0, y0, x1, y0), (x1, y0, x1, y1), (x1, y1, x0, y1), (x0, y1, x0, y0)):
        dash_plan(a, b, c, e, YEL, 2, 6, 4)


def plate(cx, fy):
    pts = [(-0.708, 0), (0.708, 0), (0.708, 0.708), (0, 1.417), (-0.708, 0.708)]
    d.polygon([(X(cx + x), Y(fy + y)) for x, y in pts], fill=WHITE, outline=INK)


def boxes(cx, fy):
    mid = fy + 0.708
    for side in (-1, 1):
        xin = cx + side * 1.208
        xout = xin + side * 4
        rect(min(xin, xout), mid - 3, max(xin, xout), mid + 3, outline=WHITE, width=2)


def lscreen(cx, cy, w=7.0):
    hw = w / 2
    d.line([X(cx - hw), Y(cy), X(cx + hw), Y(cy)], fill=WHITE, width=4 * S)
    d.line([X(cx - hw), Y(cy), X(cx - hw), Y(cy + 0.9)], fill=WHITE, width=4 * S)


def machine(cx, cy):
    rect(cx - 0.9, cy - 0.9, cx + 0.9, cy + 0.9, fill=(16, 24, 38), radius=4)
    r = 0.55 * PX * S
    d.ellipse([X(cx) - r, Y(cy) - r, X(cx) + r, Y(cy) + r], fill=BLUE, outline=WHITE, width=2 * S)


def chair(cx, cy, w=1.7, h=1.7, fill=DARKF):
    rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, fill=fill, radius=5)


def couch(x0, y0, x1, y1, label="COUCH", back="n"):
    rect(x0, y0, x1, y1, fill=COUCH, radius=6)
    inset = 0.45
    bx0, by0, bx1, by1 = x0, y0, x1, y1
    if back == "n": by0 = y1 - inset
    if back == "s": by1 = y0 + inset
    if back == "e": bx0 = x1 - inset
    if back == "w": bx1 = x0 + inset
    rect(bx0, by0, bx1, by1, fill=(18, 64, 140), radius=4)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rot = 90 if back in ("e", "w") else 0
    text(cx + (-0.2 if back == "e" else 0.2 if back == "w" else 0), cy + (-0.2 if back == "n" else 0.2 if back == "s" else 0),
         label, 9.5, "Bold", WHITE, rot=rot)


# ------------------------------------------------------------------ header
d.rectangle([0, 0, W0 * S, 12 * S], fill=BLUE)
d.rectangle([0, (H0 - 12) * S, W0 * S, H0 * S], fill=BLUE)
d.text((82 * S, 62 * S), "BALL OUT BOYS ", font=F(46, "Black"), fill=BLACK)
tw = d.textlength("BALL OUT BOYS ", font=F(46, "Black"))
d.text((82 * S + tw, 62 * S), "ATHLETICS", font=F(46, "Black"), fill=BLUE)
d.text((82 * S, 128 * S), "SUITE 204 — TRAINING FACILITY LAYOUT  ·  v7", font=F(25, "XB"), fill=BLACK)
d.text((82 * S, 172 * S), "3,874 SF · Warehouse 50' × 77' · 1 dock-high door · Drawn to scale", font=F(18, "Med"), fill=MUTED)
d.text((82 * S, 207 * S), "BACK OF BUILDING (DOCK) ↑", font=F(16, "XB"), fill=BLUE)

# ------------------------------------------------------------------ floors
XC1, XC2, YL, YLB, XV, YOB, XS, YSO, XR, YR = 19.5, 32.5, 65.0, 70.33, 29.6, 18.5, 28.9, 9.3, 41.6, 11.2
# rear vestibule (not part of the suite)
rect(0, YLB, XV, 77, fill=(240, 241, 243))
hatch(0, YLB, XV, 77, (205, 208, 212), 14)
text(5.5, 74.2, "REAR VESTIBULE", 13, "Semi", (120, 126, 134), plan=True)
# dock concrete + keep clear
rect(XV, 69.5, 50, 77, fill=CONC)
rect(XC2, YL, 50, 69.5, fill=CONC)
rect(40.3, 69.6, 48.7, 77, fill=(252, 236, 150))
hatch(40.3, 69.6, 48.7, 77, (236, 196, 40), 12, 2)
text(44.5, 74.6, "DOCK DOOR", 12.5, "XB", (150, 110, 0))
text(44.5, 73.3, "KEEP CLEAR", 12.5, "XB", (150, 110, 0))
rect(34.0, 76.5, 35.5, 77.0, fill=WHITE, outline=INK, width=1)
text(34.75, 75.3, "E.P. (3' clear)", 11, "Semi", MUTED)
# turf
rect(0, 0, XC1, YL, fill=TURF)
rect(XC1, YOB, XC2, YL, fill=TURF)
hatch(0, 0, XC1, YL, TURF_L, 9)
hatch(XC1, YOB, XC2, YL, TURF_L, 9)
# rubber
rect(XC2, YOB, 50, 69.5, fill=RUBBER)
yy = YOB + 0.4
k = 0
while yy < 69.4:
    xx = XC2 + 0.3 + (k % 2) * 0.35
    while xx < 49.8:
        r = 0.6 * S
        d.ellipse([X(xx) - r, Y(yy) - r, X(xx) + r, Y(yy) + r], fill=RUBBER_DOT)
        xx += 0.7
    yy += 0.55
    k += 1
# lounge wood
planks(0, YL, XC2, YLB, WOOD, WOOD_L, 0.75, "y")
# office block LVP, restroom tile
planks(XC1, 0, 50, YOB, LVP, LVP_L, 0.6, "x")
rect(XR, YR, 50, YOB, fill=TILE)
for gx in [XR + i * 1.5 for i in range(7)]:
    d.line([X(gx), Y(YR), X(gx), Y(YOB)], fill=TILE_L, width=1 * S)
for gy in [YR + i * 1.5 for i in range(6)]:
    d.line([X(XR), Y(gy), X(50), Y(gy)], fill=TILE_L, width=1 * S)

# ------------------------------------------------------------------ walls
WALL = BLACK
def wall(x0, y0, x1, y1, w=6):
    d.line([X(x0), Y(y0), X(x1), Y(y1)], fill=WALL, width=w * S)
# exterior
wall(0, 0, 0, YLB)
wall(0, YLB, XV, YLB)
wall(XV, YLB, XV, 77)
wall(XV, 77, 40.3, 77)
wall(48.7, 77, 50, 77)
wall(50, 77, 50, 0)
# vestibule outer walls (thin)
d.line([X(0), Y(77), X(XV), Y(77)], fill=(150, 154, 160), width=3 * S)
d.line([X(0), Y(YLB), X(0), Y(77)], fill=(150, 154, 160), width=3 * S)
# storefront (front wall) with door gaps
for a, b in ((0, 1.6), (4.7, 14.9), (18.1, 42.8), (46.1, 50)):
    wall(a, 0, b, 0, 5)
# dock door
d.line([X(40.3), Y(77), X(48.7), Y(77)], fill=(120, 124, 130), width=4 * S)
# columns
for cx in (9.6, 50.0):
    rect(cx - 0.9, -0.9, cx + 0.9, 0.5, fill=BLACK)
# partitions
PW = 4
wall(XC1, 0, XC1, YOB, PW)
wall(XC1, YOB, 33.0, YOB, PW); wall(36.1, YOB, 50, YOB, PW)
wall(XC1, YSO, XS, YSO, PW)
wall(XS, 0, XS, 6.0, PW); wall(XS, 8.8, XS, 15.2, PW); wall(XS, 18.0, XS, YOB, PW)
wall(XR, YR, XR, 12.3, PW); wall(XR, 15.0, XR, YOB, PW)
wall(XR, YR, 50, YR, PW)
# lounge -> vestibule door
d.line([X(11.0), Y(YLB), X(14.1), Y(YLB)], fill=WHITE, width=7 * S)
door(11.0, YLB, 3.1, 0, 90)

# doors + clearances
clearance(33.0, YOB - 2.0, 36.1, YOB)          # hall -> weight room
door(33.0, YOB, 3.0, 0, 90)
door(XS, 8.8, 2.7, 270, 90)                     # office door swings out into the lobby
door(XS, 15.2, 2.7, 180, 90)                    # storage door swings in
door(XR, 12.3, 2.6, 0, 90)                      # restroom door swings in
clearance(42.8, 0.2, 46.1, 2.2)                 # lobby front door
for (a, b, sgn) in ((1.6, 4.7, 1), (14.9, 18.1, 1), (42.8, 46.1, 1)):
    door(a, 0, b - a, 270, 90)

# ------------------------------------------------------------------ cage netting
NETC = BLUE
dash_plan(0.45, 0.4, 0.45, 64.9, NETC)
dash_plan(XC1, 0.4, XC1, 64.9, NETC)
dash_plan(0.45, 64.9, XC2, 64.9, NETC)
dash_plan(0.45, 0.4, XC1, 0.4, NETC)
dash_plan(XC1, YOB + 0.5, XC2, YOB + 0.5, NETC)
dash_plan(XC2, YOB + 0.5, XC2, 37.9, NETC); dash_plan(XC2, 41.3, XC2, 61.1, NETC); dash_plan(XC2, 64.5, XC2, 64.9, NETC)
dash_plan(XC1, 41.8, XC2, 41.8, YEL, 4)
text((XC1 + XC2) / 2, 42.6, "RETRACTABLE DIVIDER NET", 11.5, "XB", YEL)
for a, b in ((37.9, 41.3), (61.1, 64.5)):
    rect(XC2 - 0.12, a, XC2 + 0.25, b, fill=YEL)
    text(XC2 + 2.6, (a + b) / 2, "NET OPENING", 10, "XB", YEL)

# ------------------------------------------------------------------ Cage 1
rect(0.05, 58.0, 0.35, 64.5, fill=(190, 228, 245), outline=BLUE, width=1)
text(3.2, 56.6, "MIRROR (wall)", 10.5, "XB", WHITE)
# logo wall graphic on the west wall
rect(-0.55, 23.0, -0.15, 49.0, fill=BLUE)
text(1.7, 36.0, "LOGO WALL", 11, "XB", WHITE, rot=90)
plate(10.2, 60.53); boxes(10.2, 60.53)
rect(8.7, 64.25, 11.7, 64.85, fill=BLACK)
text(10.2, 55.6, "HOME PLATE", 13, "XB", WHITE)
text(10.2, 54.4, "HitTrax tracking", 11, "Semi", (225, 240, 228))
text(10.2, 37.2, "CAGE 1", 24, "Black", WHITE)
text(10.2, 35.4, "BULLPEN / LIVE BP", 12.5, "XB", WHITE)
text(10.2, 34.0, "65' × 19.5'", 13.5, "XB", WHITE)
lscreen(10.2, 29.6)
text(15.4, 29.3, "L-SCREEN", 10.5, "XB", WHITE)
machine(10.2, 25.9)
text(10.2, 23.6, "PITCHING MACHINE", 11.5, "XB", WHITE)
text(10.2, 22.5, "(rolls in for BP)", 10, "Semi", (225, 240, 228))
for x0, x1, nm in ((2.0, 9.1, "A"), (11.6, 18.6, "B")):
    rect(x0, 0.5, x1, 10.6, fill=CLAY, outline=(120, 60, 30), width=2, radius=14)
    rect((x0 + x1) / 2 - 1, 0.95, (x0 + x1) / 2 + 1, 1.45, fill=WHITE)
    text((x0 + x1) / 2, 6.9, "PORTABLE", 11.5, "XB", WHITE)
    text((x0 + x1) / 2, 5.9, f"MOUND {nm}", 11.5, "XB", WHITE)
    text((x0 + x1) / 2, 4.8, "on wheels", 9.5, "Semi", WHITE)
# 60'6" dimension
dash_plan(19.0, 1.45, 19.0, 61.95, WHITE, 2, 5, 4)
d.line([X(18.7), Y(1.45), X(19.3), Y(1.45)], fill=WHITE, width=2 * S)
d.line([X(18.7), Y(61.95), X(19.3), Y(61.95)], fill=WHITE, width=2 * S)
text(18.2, 31.5, "60' 6\"  PLATE → RUBBER (BOTH MOUNDS)", 11.5, "XB", WHITE, rot=90)

# ------------------------------------------------------------------ Cage 2
plate(26.0, 60.0); boxes(26.0, 60.0)
plate(26.0, 37.0); boxes(26.0, 37.0)
r = 0.3 * PX * S
d.ellipse([X(26.0) - r, Y(60.5) - r, X(26.0) + r, Y(60.5) + r], fill=(240, 106, 20))
text(26.0, 56.0, "CAGE 2", 15, "XB", WHITE)
text(26.0, 54.3, "HALF A", 14, "XB", WHITE)
text(26.0, 53.1, "Tee / Front Toss", 10.5, "Semi", WHITE)
text(26.0, 52.0, "23.3' × 13'", 10.5, "XB", WHITE)
lscreen(26.0, 50.5, 6.0)
text(26.0, 33.0, "HALF B", 14, "XB", WHITE)
text(26.0, 31.8, "Machine / Short Toss", 10.5, "Semi", WHITE)
text(26.0, 30.7, "23.3' × 13'", 10.5, "XB", WHITE)
lscreen(26.0, 24.6, 6.0)
machine(26.0, 21.6)
text(26.0, 19.7, "MACHINE", 11, "XB", WHITE)

# ------------------------------------------------------------------ weight room
rect(33.3, 67.0, 37.0, 68.9, fill=WHITE, outline=INK, width=1)
for i, c in enumerate([(216, 31, 38), (240, 118, 26), (243, 195, 22), (42, 168, 74), (31, 99, 214), (123, 47, 191), (17, 17, 17)]):
    xx = 33.7 + i * 0.47
    d.line([X(xx), Y(67.2), X(xx), Y(68.7)], fill=c, width=4 * S)
text(35.15, 66.2, "BAND RACK", 9.5, "XB", WHITE)
rect(37.3, 67.0, 41.7, 68.9, fill=WHITE, outline=INK, width=1)
for i, c in enumerate([(31, 79, 176), (210, 42, 42), (31, 157, 72), (233, 178, 26), (34, 34, 34)]):
    xx = 37.85 + i * 0.85
    rr = 0.38 * PX * S
    d.ellipse([X(xx) - rr, Y(67.95) - rr, X(xx) + rr, Y(67.95) + rr], fill=c)
text(39.5, 66.2, "WEIGHT BALLS", 9.5, "XB", WHITE)
rect(44.7, 65.0, 49.6, 68.6, fill=(20, 22, 26), outline=WHITE, width=2)
rect(45.1, 65.4, 45.9, 68.2, fill=(120, 124, 130)); rect(48.4, 65.4, 49.2, 68.2, fill=(120, 124, 130))
d.line([X(45.9), Y(66.8), X(48.4), Y(66.8)], fill=WHITE, width=2 * S)
rr = 0.3 * PX * S
d.ellipse([X(47.15) - rr, Y(66.8) - rr, X(47.15) + rr, Y(66.8) + rr], fill=BLUE)
text(47.15, 64.2, "CABLE MACHINE", 9.5, "XB", WHITE)
rect(45.6, 59.2, 49.6, 62.4, fill=(20, 22, 26), outline=WHITE, width=2)
rect(46.0, 59.6, 46.9, 62.0, fill=BLUE); rect(47.8, 60.3, 48.9, 61.3, fill=(110, 114, 120))
text(41.6, 61.3, "BULGARIAN SPLIT", 9.5, "XB", WHITE); text(41.6, 60.3, "SQUAT RACK", 9.5, "XB", WHITE)
for y in (55.7, 51.6, 47.6, 43.6):
    rect(38.7, y - 0.85, 42.9, y + 0.85, fill=(12, 14, 18), outline=BLUE, width=2, radius=4)
    text(39.9, y, "BENCH", 9.5, "XB", WHITE)
rect(47.4, 42.1, 49.7, 57.0, fill=(70, 74, 80), outline=WHITE, width=1)
yy = 42.5
while yy < 56.8:
    d.line([X(47.6), Y(yy), X(49.5), Y(yy)], fill=(20, 20, 22), width=3 * S)
    yy += 0.75
text(46.2, 49.5, "DB RACK 5–100 LB (20 PR)", 11, "XB", WHITE, rot=90)
for cy, nm in ((35.0, "RACK 1"), (25.1, "RACK 2")):
    rect(41.8, cy - 4, 49.8, cy + 4, fill=(20, 22, 26))
    rect(41.8, cy - 2, 49.8, cy + 2, fill=PLAT)
    rect(45.2, cy - 2.2, 49.2, cy + 2.2, outline=WHITE, width=2)
    d.line([X(45.05), Y(cy - 3.6), X(45.05), Y(cy + 3.6)], fill=(220, 220, 220), width=3 * S)
    for px_ in (45.2, 49.2):
        for py_ in (cy - 2.2, cy + 2.2):
            rect(px_ - 0.2, py_ - 0.2, px_ + 0.2, py_ + 0.2, fill=BLUE, outline=WHITE, width=1)
    text(38.6, cy, nm, 12, "XB", WHITE)
text(34.9, 27.3, "WEIGHT ROOM", 18, "Black", WHITE, rot=90)
text(36.6, 27.3, "rubber · open to cages", 9.5, "Semi", (190, 196, 206), rot=90)

# ------------------------------------------------------------------ lounge
rect(0.0, 65.2, 1.4, 70.2, fill=(60, 42, 28))
for k in range(5):
    y = 65.3 + k * 0.98
    d.line([X(0.1), Y(y), X(1.35), Y(y)], fill=WOOD, width=2 * S)
text(0.75, 67.7, "BAT RACK / CUBBIES", 7.5, "XB", WHITE, rot=90)
rect(3.0, YLB - 0.35, 6.6, YLB - 0.05, fill=BLACK)
text(4.0, 67.3, "HitTrax TV 50\"", 9, "XB", INK)
chair(6.9, 69.25, 2.0, 2.0); chair(9.05, 69.25, 2.0, 2.0)
text(8.3, 66.4, "2 CHAIRS", 9, "XB", INK)
clearance(11.0, YLB - 2.0, 14.1, YLB)
couch(15.0, 67.9, 20.8, 70.25, back="n"); couch(21.4, 67.9, 27.2, 70.25, back="n")
text(30.3, 67.6, "LOUNGE", 12, "XB", INK)

# ------------------------------------------------------------------ storage
rect(20.3, 16.4, 27.0, 18.4, fill=(150, 154, 160))
for k in range(5):
    rect(20.45 + k * 1.3, 16.6, 21.55 + k * 1.3, 18.2, fill=(196, 160, 110) if k % 2 else (60, 100, 170))
rect(19.95, 9.8, 21.9, 15.9, fill=(150, 154, 160))
for k in range(4):
    rect(20.1, 10.0 + k * 1.45, 21.75, 11.2 + k * 1.45, fill=(196, 160, 110) if k % 2 == 0 else (60, 100, 170))
for bx, by in ((23.3, 15.6), (24.6, 15.7), (25.8, 15.6)):
    rr = 0.6 * PX * S
    d.ellipse([X(bx) - rr, Y(by) - rr, X(bx) + rr, Y(by) + rr], fill=(226, 91, 18), outline=WHITE, width=1 * S)
text(25.3, 13.2, "STORAGE", 13, "XB", INK)
text(25.3, 12.1, "shelves · bins · buckets", 9.5, "Semi", MUTED)

# ------------------------------------------------------------------ Coach Ned's office
couch(20.1, 6.7, 24.9, 9.25, back="n")
rect(21.3, 5.35, 23.7, 6.05, fill=(91, 59, 36))
text(22.5, 5.7, "TABLE", 8, "XB", WHITE)
rect(22.3, 0.9, 24.7, 4.7, fill=(240, 239, 234), outline=INK, width=1)
text(23.5, 3.2, "MY", 9.5, "XB", INK); text(23.5, 2.4, "DESK", 9.5, "XB", INK)
chair(21.15, 2.8)
X2 = (24.7 + XS) / 2
rect(X2 - 1.2, 2.2, X2 + 1.2, 3.5, fill=(240, 239, 234), outline=INK, width=1)
text(X2, 2.85, "DESK 2", 8.5, "XB", INK)
chair(X2, 1.1)
rect(XS - 0.25, 1.2, XS - 0.05, 4.4, fill=BLACK)
text(XS - 0.9, 5.3, "TV", 9, "XB", INK)
rect(25.05, 7.75, 26.65, 9.25, fill=(20, 22, 26), radius=3)
text(25.85, 8.5, "FRIDGE", 7.5, "XB", WHITE)
text(26.8, 6.6, "COACH NED", 9.5, "XB", INK); text(26.8, 5.8, "OFFICE", 9.5, "XB", INK)

# ------------------------------------------------------------------ hall + restroom
for y0 in (9.7, 12.4):
    rect(XS + 0.4, y0, 32.1, y0 + 2.6, fill=(20, 60, 120), outline=INK, width=1)
    rect(31.5, y0 + 0.2, 32.0, y0 + 2.4, fill=(90, 190, 240))
    text(30.6, y0 + 1.3, "VEND", 8.5, "XB", WHITE, rot=90)
text(37.0, 15.6, "HALL", 12, "XB", (110, 116, 124))
r_ada = 2.5 * PX * S
cx, cy = X(45.4), Y(14.7)
for k in range(0, 360, 20):
    d.arc([cx - r_ada, cy - r_ada, cx + r_ada, cy + r_ada], k, k + 10, fill=INK, width=2 * S)
text(45.4, 15.3, "ADA", 10.5, "XB", INK); text(45.4, 14.4, "RESTROOM", 10.5, "XB", INK)
rect(47.7, 16.9, 49.2, 17.9, fill=WHITE, outline=INK, width=1, radius=6)
rect(49.2, 16.6, 49.95, 18.2, fill=WHITE, outline=INK, width=1)
rect(48.6, 13.2, 49.95, 15.0, fill=WHITE, outline=INK, width=1, radius=4)

# ------------------------------------------------------------------ lobby
rect(32.4, 0.5, 36.2, 1.9, fill=(16, 18, 22))
rect(36.1, 0.5, 37.6, 5.4, fill=(16, 18, 22))
chair(34.6, 3.4)
text(34.9, 6.2, "RECEPTION DESK", 9.5, "XB", INK)
rect(XS + 0.4, 0.94, XS + 0.65, 4.94, fill=BLACK)
text(30.25, 2.94, "TV · PLANS", 8.5, "XB", INK, rot=90)
couch(47.35, 2.4, 49.95, 7.9, back="e")
rect(49.85, 2.35, 50.0, 7.95, fill=(59, 130, 240))
text(46.3, 5.15, "LED SIGN ↑", 8.5, "XB", BLUE, rot=90)
chair(42.95, 9.9, 2.5, 2.4); chair(45.65, 9.9, 2.5, 2.4)
text(44.3, 8.1, "2 CHAIRS", 9, "XB", INK)
rect(41.6, 5.8, 45.6, 7.4, fill=(108, 70, 42), radius=3)
text(43.6, 6.6, "TABLE", 9, "XB", WHITE)
rect(47.65, 8.2, 49.75, 10.9, fill=WHITE, outline=INK, width=1)
for k in range(6):
    yy = 8.4 + k * 0.4
    d.line([X(47.8), Y(yy), X(49.6), Y(yy)], fill=[BLACK, BLUE, (150, 150, 150)][k % 3], width=4 * S)
text(48.7, 8.0 - 0.6, "MERCH", 8.5, "XB", INK)
text(39.0, 3.2, "LOBBY", 13, "XB", INK)

# ------------------------------------------------------------------ dimensions
def hdim(x0, x1, y_px, label):
    d.line([X(x0), y_px * S, X(x1), y_px * S], fill=BLUE, width=2 * S)
    for x in (x0, x1):
        d.line([X(x), (y_px - 10) * S, X(x), (y_px + 10) * S], fill=BLUE, width=2 * S)
    d.text(((X(x0) + X(x1)) / 2, (y_px - 12) * S), label, font=F(15, "XB"), fill=BLUE, anchor="mb")

hdim(0, 50, 244, "50' WIDE")
hdim(0, XC1, 1912, "CAGE 1 · 19.5'")
hdim(XC1, XC2, 1912, "CAGE 2 · 13'")
hdim(XC2, 50, 1912, "WEIGHT ROOM 17'")
for (x_px, y0, y1, label) in ((42, 0, 65, "CAGE 1 — 65'"), (1112, 0, 77, "77' DEEP")):
    d.line([x_px * S, Y(y0), x_px * S, Y(y1)], fill=BLUE, width=2 * S)
    for y in (y0, y1):
        d.line([(x_px - 10) * S, Y(y), (x_px + 10) * S, Y(y)], fill=BLUE, width=2 * S)
    t = Image.new("RGBA", (400 * S, 40 * S), (0, 0, 0, 0))
    ImageDraw.Draw(t).text((200 * S, 20 * S), label, font=F(15, "XB"), fill=BLUE, anchor="mm")
    t = t.rotate(90, expand=True)
    xoff = -16 if x_px < 100 else 16
    img.paste(t, (int((x_px + xoff) * S - t.width / 2), int((Y(y0) + Y(y1)) / 2 - t.height / 2)), t)
d.text((82 * S, 1960 * S), "FRONT ENTRANCE / PARKING ↓", font=F(16, "XB"), fill=BLUE, anchor="lm")
d.text(((W0 - 86) * S, 1960 * S), "Concept layout — verify clear height, egress and permits with landlord before install.",
       font=F(14, "Med"), fill=MUTED, anchor="rm")

# ------------------------------------------------------------------ legend
LX = 1188
def lh(y, s): d.text((LX * S, y * S), s, font=F(21, "Black"), fill=BLACK)
def swatch(y, fill, label, pattern=None):
    d.rectangle([LX * S, y * S, (LX + 50) * S, (y + 30) * S], fill=fill, outline=(120, 120, 120), width=1 * S)
    if pattern == "hatch":
        t = Image.new("RGB", (50 * S, 30 * S), fill)
        td = ImageDraw.Draw(t)
        for k in range(-30, 50, 9):
            td.line([k * S, 30 * S, (k + 30) * S, 0], fill=(236, 196, 40), width=2 * S)
        img.paste(t, (LX * S, y * S))
        d.rectangle([LX * S, y * S, (LX + 50) * S, (y + 30) * S], outline=(120, 120, 120), width=1 * S)
    d.text(((LX + 66) * S, (y + 15) * S), label, font=F(17, "Semi"), fill=INK, anchor="lm")

lh(258, "FLOORING")
swatch(310, TURF, "Turf — batting cages")
swatch(353, RUBBER, "Rubber — weight room")
swatch(396, PLAT, "Wood — lifting platforms")
swatch(439, WOOD, "Wood — lounge")
swatch(482, LVP, "Wood-look LVP — lobby / offices")
swatch(525, TILE, "Tile — restroom")
swatch(568, CONC, "Sealed concrete — dock area")
swatch(611, (252, 236, 150), "Keep-clear zone (dock)", "hatch")

lh(670, "SYMBOLS")
def sym(y, draw, label):
    draw(y)
    d.text(((LX + 66) * S, (y + 15) * S), label, font=F(17, "Semi"), fill=INK, anchor="lm")
sym(712, lambda y: dashed((LX * S, (y + 15) * S), ((LX + 50) * S, (y + 15) * S), BLUE), "Cage netting")
sym(755, lambda y: dashed((LX * S, (y + 15) * S), ((LX + 50) * S, (y + 15) * S), YEL, 4), "Retractable divider net")
sym(798, lambda y: d.rectangle([LX * S, (y + 3) * S, (LX + 50) * S, (y + 27) * S], fill=(255, 246, 205), outline=YEL, width=2 * S), "2' door clearance")
sym(841, lambda y: d.rectangle([(LX + 20) * S, y * S, (LX + 30) * S, (y + 30) * S], fill=(190, 228, 245), outline=BLUE, width=2 * S), "Mirror")
sym(884, lambda y: d.ellipse([(LX + 13) * S, (y + 3) * S, (LX + 37) * S, (y + 27) * S], fill=BLUE), "Pitching machine")
sym(927, lambda y: d.rectangle([LX * S, (y + 11) * S, (LX + 50) * S, (y + 19) * S], fill=(59, 130, 240)), "LED neon sign (on wall)")
sym(970, lambda y: d.rectangle([LX * S, (y + 11) * S, (LX + 50) * S, (y + 19) * S], fill=BLUE), "Logo wall graphic")

lh(1025, "EQUIPMENT")
eq = [
    ("b", "Cage 1: 65' × 19.5' bullpen / live BP"),
    ("", "• 2 portable mounds, 60' 6\" to plate"),
    ("", "• Batter's boxes fully inside the cage"),
    ("", "• Mirror by the box · logo wall on left wall"),
    ("b", "Cage 2: 46.6' × 13' — openings back right"),
    ("", "• Retractable net → two 23.3' halves"),
    ("b", "Back lounge: bat rack on side wall,"),
    ("", "50\" HitTrax TV + 2 chairs (clear of door), 2 couches"),
    ("b", "Weight room (rubber): cable + BSS, DB rack"),
    ("", "5–100 lb + 4 benches, 2 racks on platforms"),
    ("b", "Coach Ned's office: my desk + chair (left wall),"),
    ("", "desk 2 + chair centred, couch facing desk + table,"),
    ("", "TV on right wall, mini fridge"),
    ("b", "Lobby: reception + TV (memberships & lessons),"),
    ("", "couch under LED sign, 2 chairs + table,"),
    ("", "hanging merch rack in corner, 2 vending"),
]
y = 1072
for kind, s in eq:
    d.text((LX * S, y * S), s, font=F(16.5, "Black" if kind == "b" else "Med"), fill=BLACK if kind == "b" else INK)
    y += 30

# what changed
y += 14
d.rounded_rectangle([LX * S, y * S, (W0 - 60) * S, (y + 300) * S], 14 * S, fill=(236, 243, 252), outline=BLUE, width=2 * S)
d.text(((LX + 20) * S, (y + 18) * S), "WHAT CHANGED IN v7", font=F(17, "Black"), fill=BLUE)
changes = [
    "Batter's boxes moved inside the cages; mounds slid",
    "  forward to keep 60' 6\"",
    "Lobby: one couch under the LED sign, 2 chairs on wall,",
    "  merch rack in corner, one TV centred behind reception",
    "Office: desk 2 centred, 2 chairs only, couch faces",
    "  desk + table, mini fridge",
    "Lounge chairs slid left, clear of the door",
    "Logo wall graphic beside Cage 1",
]
for i, s in enumerate(changes):
    d.text(((LX + 20) * S, (y + 56 + i * 29) * S), s, font=F(15.5, "Med"), fill=INK)

out = img.resize((W0, H0), Image.LANCZOS)
out.save(OUT, optimize=True)
print("saved", OUT)
