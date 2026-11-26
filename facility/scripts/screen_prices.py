"""Lobby TV screen: memberships + 1-on-1 lessons (plan names from src/site.config.ts; pricing lives in the app)."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
out, logo_path = sys.argv[1], sys.argv[2]
W, H = 1920, 1080
FB = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FX = "/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf"
FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
f = lambda p, s: ImageFont.truetype(p, s)
g = np.linspace(0, 1, H)[:, None, None]
bg = (np.array([5, 12, 26]) * (1 - g) + np.array([10, 44, 104]) * g) * np.ones((H, W, 3))
im = Image.fromarray(bg.astype(np.uint8))
d = ImageDraw.Draw(im)
BLUE, WHITE, MUTED = (59, 130, 240), (255, 255, 255), (170, 190, 220)

logo = Image.open(logo_path).convert("RGBA")
logo = logo.resize((520, int(520 * logo.height / logo.width)), Image.LANCZOS)
im.paste(logo, (70, 60), logo)
d.text((W - 70, 92), "MEMBERSHIPS", font=f(FB, 92), fill=WHITE, anchor="ra")
d.text((W - 70, 196), "& LESSONS", font=f(FB, 92), fill=BLUE, anchor="ra")
d.rectangle([70, 330, W - 70, 334], fill=(36, 80, 150))

# left: memberships
d.text((70, 380), "SMALL-GROUP MEMBERSHIPS", font=f(FX, 46), fill=BLUE)
d.text((70, 440), "Strength · speed · hitting  |  groups of 5–8  |  up to 4 sessions a week", font=f(FS, 30), fill=MUTED)
plans = [("12 Month Membership", "BEST VALUE"), ("6 Month Membership", None),
         ("Founders Member Program", "30 SPOTS"), ("Walk-On Membership", "MONTH TO MONTH")]
y = 510
for name, tag in plans:
    d.rounded_rectangle([70, y, 1110, y + 104], 18, fill=(12, 30, 62), outline=(36, 80, 150), width=3)
    d.text((110, y + 52), name, font=f(FX, 50), fill=WHITE, anchor="lm")
    if tag:
        tw = d.textlength(tag, font=f(FX, 28)) + 40
        d.rounded_rectangle([1090 - tw, y + 30, 1090, y + 74], 22, fill=BLUE)
        d.text((1090 - tw / 2, y + 52), tag, font=f(FX, 28), fill=WHITE, anchor="mm")
    y += 122

# right: lessons
x0 = 1170
d.rounded_rectangle([x0, 380, W - 70, 980], 24, fill=(12, 30, 62), outline=BLUE, width=4)
d.text((x0 + 50, 430), "1-ON-1", font=f(FB, 84), fill=WHITE)
d.text((x0 + 50, 525), "LESSONS", font=f(FB, 84), fill=BLUE)
for i, line in enumerate(["Private training with", "Coach Ned", "", "Hitting · throwing", "fielding · speed"]):
    d.text((x0 + 50, 660 + i * 54), line, font=f(FS, 40), fill=WHITE if i == 1 else MUTED)

d.text((70, 1020), "See pricing and book in the BallOutBoys app  ·  Retest every 4 weeks", font=f(FX, 36), fill=WHITE, anchor="lm")
im.save(out, quality=92)
