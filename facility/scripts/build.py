"""Build the Ball Out Boys Athletics Suite 204 facility (layout v6) in Blender.

Run:  python build.py <tex_dir> <out.blend>
All layout numbers are in FEET (x: west->east 0..50, y: front->back 0..77, z: up).
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

TEX = sys.argv[1]
OUT = sys.argv[2]
F = 0.3048

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


# ----------------------------------------------------------------- helpers
def coll(name):
    c = bpy.data.collections.get(name)
    if not c:
        c = bpy.data.collections.new(name)
        scene.collection.children.link(c)
    return c


def lin(h):
    h = h.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return out


_imgs = {}


def img(name, noncolor=False):
    key = (name, noncolor)
    if key not in _imgs:
        im = bpy.data.images.load(os.path.join(TEX, name))
        if noncolor:
            im.colorspace_settings.name = "Non-Color"
        _imgs[key] = im
    return _imgs[key]


MATS = {}


def mat(name, color="#808080", rough=0.6, metal=0.0, tex=None, normal=None, nstr=0.6,
        alpha_tex=False, emit=None, estr=0.0, emit_tex=None, trans=0.0, alpha=1.0, coat=0.0, spec=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*lin(color), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = spec
    if tex:
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = img(tex)
        t.interpolation = "Cubic" if alpha_tex else "Linear"
        nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
        if alpha_tex:
            nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"])
    if normal:
        tn = nt.nodes.new("ShaderNodeTexImage")
        tn.image = img(normal, True)
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = nstr
        nt.links.new(tn.outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    if emit_tex:
        te = nt.nodes.new("ShaderNodeTexImage")
        te.image = img(emit_tex)
        nt.links.new(te.outputs["Color"], b.inputs["Emission Color"])
        if not tex:
            nt.links.new(te.outputs["Color"], b.inputs["Base Color"])
        b.inputs["Emission Strength"].default_value = estr
    elif emit:
        b.inputs["Emission Color"].default_value = (*lin(emit), 1)
        b.inputs["Emission Strength"].default_value = estr
    if trans:
        b.inputs["Transmission Weight"].default_value = trans
        b.inputs["IOR"].default_value = 1.5
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if alpha_tex or alpha < 1:
        try:
            m.surface_render_method = "BLENDED"
        except Exception:
            pass
    MATS[name] = m
    return m


# Tile sizes (ft) for world-space UVs per material
TILE = {}


def tmat(name, tile, **kw):
    TILE[name] = tile
    return mat(name, **kw)


# ---- material library
M = {}
M["turf"] = tmat("Turf", 6, color="#ffffff", tex="turf.jpg", normal="turf_n.jpg", nstr=0.5, rough=0.92, spec=0.3)
M["rubber"] = tmat("Rubber", 4, color="#ffffff", tex="rubber.jpg", normal="rubber_n.jpg", nstr=0.4, rough=0.85)
M["wood"] = tmat("WoodPlatform", 8, color="#ffffff", tex="wood_platform.jpg", rough=0.45, coat=0.2)
M["lvp"] = tmat("LVP", 8, color="#ffffff", tex="lvp.jpg", normal="lvp_n.jpg", nstr=0.3, rough=0.4)
M["lounge"] = tmat("WoodLounge", 8, color="#ffffff", tex="wood_lounge.jpg", rough=0.42, coat=0.15)
M["tile"] = tmat("Tile", 4, color="#ffffff", tex="tile.jpg", rough=0.25)
M["concrete"] = tmat("Concrete", 12, color="#ffffff", tex="concrete.jpg", rough=0.3, coat=0.25)
M["wall"] = tmat("WallDark", 8, color="#ffffff", tex="wall_dark.jpg", rough=0.85)
M["wall_light"] = tmat("WallLight", 8, color="#ffffff", tex="wall_light.jpg", rough=0.8)
M["net"] = tmat("Net", 2, color="#ffffff", tex="net.png", alpha_tex=True, rough=0.9)
M["slab"] = mat("Slab", "#9a9da1", rough=0.8)
M["ground"] = mat("Ground", "#d7d9dc", rough=0.9)
M["steel"] = mat("SteelBlack", "#111214", rough=0.42, metal=0.6)
M["steel_blue"] = mat("SteelBlue", "#1452b8", rough=0.35, metal=0.4)
M["chrome"] = mat("Chrome", "#d9dce0", rough=0.12, metal=1.0)
M["bumper"] = mat("Bumper", "#0c0d0f", rough=0.55)
M["bumper_blue"] = mat("BumperBlue", "#1a56c4", rough=0.5)
M["pad"] = mat("PadBlack", "#18191c", rough=0.5)
M["pad_blue"] = mat("PadBlue", "#1a55b8", rough=0.5)
M["white"] = mat("WhiteRubber", "#f4f4f2", rough=0.55)
M["paint_white"] = mat("PaintWhite", "#f2f2f0", rough=0.7)
M["clay"] = mat("Clay", "#b0603a", rough=0.95)
M["fabric_blue"] = mat("FabricBlue", "#1d4fa6", rough=0.95, spec=0.3)
M["fabric_dark"] = mat("FabricDark", "#2a2d33", rough=0.95, spec=0.3)
M["fabric_gray"] = mat("FabricGray", "#6d7279", rough=0.95, spec=0.3)
M["leather"] = mat("Leather", "#4a2f1d", rough=0.5)
M["walnut"] = mat("Walnut", "#5b3b24", rough=0.45, coat=0.3)
M["oak"] = mat("Oak", "#b28a5c", rough=0.5)
M["desk_white"] = mat("DeskWhite", "#ecebe6", rough=0.35)
M["black_plastic"] = mat("BlackPlastic", "#0d0e10", rough=0.35)
M["tv_bezel"] = mat("TVBezel", "#050506", rough=0.25)
M["glass"] = mat("Glass", "#ffffff", rough=0.02, trans=1.0, spec=0.5)
M["mirror"] = mat("Mirror", "#e8eaec", rough=0.02, metal=1.0)
M["alum"] = mat("AluminumDark", "#25272b", rough=0.4, metal=0.7)
M["led"] = mat("LED", "#ffffff", emit="#fff4e6", estr=12.0, rough=0.5)
M["led_blue"] = mat("LEDBlue", "#1f6bff", emit="#2a6dff", estr=8.0)
M["fixture"] = mat("FixtureBody", "#2b2e33", rough=0.4, metal=0.5)
M["deck"] = mat("CeilingDeck", "#3a3d42", rough=0.7, normal="corrugated_n.jpg", nstr=0.8)
TILE["CeilingDeck"] = 4
M["joist"] = mat("Joist", "#1b1c1f", rough=0.6, metal=0.4)
M["acoustic"] = mat("AcousticTile", "#e9e9e6", rough=0.95)
M["rollup"] = mat("RollUpDoor", "#b9bcc0", rough=0.45, metal=0.6, normal="corrugated_n.jpg", nstr=1.0)
TILE["RollUpDoor"] = 4
M["yellow"] = mat("SafetyYellow", "#f2c41a", rough=0.5)
M["orange"] = mat("Orange", "#f06a14", rough=0.5)
M["hatch"] = mat("Hatch", "#ffffff", tex="hatch.png", alpha_tex=True, rough=0.6)
TILE["Hatch"] = 4
M["panel"] = mat("ElecPanel", "#8e9399", rough=0.4, metal=0.6)
M["porcelain"] = mat("Porcelain", "#f7f7f5", rough=0.1, coat=0.6)
M["cardboard"] = mat("Cardboard", "#b48a5a", rough=0.9)
M["bin"] = mat("BinBlue", "#204f9c", rough=0.4)
M["bin_clear"] = mat("BinGray", "#8f969e", rough=0.4)
M["ball"] = mat("Baseball", "#f3efe6", rough=0.6)
M["bucket"] = mat("BucketOrange", "#e25b12", rough=0.45)
M["bat_alloy"] = mat("BatAlloy", "#1b1d22", rough=0.3, metal=0.8)
M["bat_wood"] = mat("BatWood", "#c79a63", rough=0.4)
M["door"] = mat("DoorWood", "#57514b", rough=0.5)
M["shirt_black"] = mat("ShirtBlack", "#15161a", rough=0.95)
M["shirt_white"] = mat("ShirtWhite", "#ececea", rough=0.95)
M["shirt_blue"] = mat("ShirtBlue", "#1a4fb0", rough=0.95)
M["shirt_gray"] = mat("ShirtGray", "#7c8189", rough=0.95)
M["plant"] = mat("Plant", "#2f6a2c", rough=0.8)
M["pot"] = mat("Pot", "#1c1c1f", rough=0.5)
BAND_COLS = ["#d81f26", "#f0761a", "#f3c316", "#2aa84a", "#1f63d6", "#7b2fbf", "#111111"]
M["bands"] = [mat(f"Band{i}", c, rough=0.5) for i, c in enumerate(BAND_COLS)]
MB_COLS = ["#1f4fb0", "#d22a2a", "#1f9d48", "#e9b21a", "#222222", "#8a8f96"]
M["medballs"] = [mat(f"MedBall{i}", c, rough=0.7) for i, c in enumerate(MB_COLS)]
M["vend"] = mat("VendFront", "#ffffff", emit_tex="vending.jpg", estr=2.2, rough=0.2)
M["logo"] = mat("LogoDecal", "#ffffff", tex="logo_wall.png", alpha_tex=True, emit_tex="logo_wall.png", estr=0.35, rough=0.6)
M["logo_only"] = mat("LogoOnly", "#ffffff", tex="logo.png", alpha_tex=True, emit_tex="logo.png", estr=0.35, rough=0.6)
M["banner"] = mat("BannerDecal", "#ffffff", tex="banner.png", alpha_tex=True, emit_tex="banner.png", estr=0.3, rough=0.6)
M["decal_wr"] = mat("DecalWeightRoom", "#ffffff", tex="decal_weightroom.png", alpha_tex=True, rough=0.7)
M["scr_spray"] = mat("ScreenSpray", "#000000", emit_tex="screen_spray.jpg", estr=1.6, rough=0.15)
M["scr_logo"] = mat("ScreenLogo", "#000000", emit_tex="screen_logo.jpg", estr=1.6, rough=0.15)
M["scr_team"] = mat("ScreenTeam", "#000000", emit_tex="screen_team.jpg", estr=1.4, rough=0.15)
M["scr_swing"] = mat("ScreenSwing", "#000000", emit_tex="screen_swing.jpg", estr=1.4, rough=0.15)


def rz(deg):
    return Matrix.Rotation(math.radians(deg), 4, "Z")


def T(x, y, z=0.0):
    return Matrix.Translation((x * F, y * F, z * F))


class B:
    """Accumulates primitives into one mesh object (multi-material)."""

    def __init__(self, name, collection="Props", bevel=0.0, M0=None):
        self.name, self.coll, self.bevel = name, collection, bevel
        self.bm = bmesh.new()
        self.uv = self.bm.loops.layers.uv.new("UVMap")
        self.mats = []
        self.stack = [M0 if M0 is not None else Matrix.Identity(4)]

    @property
    def M(self):
        return self.stack[-1]

    def push(self, x=0, y=0, z=0, rot=0):
        self.stack.append(self.M @ T(x, y, z) @ rz(rot))
        return self

    def pop(self):
        self.stack.pop()

    def _mi(self, m):
        if m not in self.mats:
            self.mats.append(m)
        return self.mats.index(m)

    def _finish_geom(self, verts, m, smooth=False, uvmode="world"):
        faces = {f for v in verts for f in v.link_faces}
        mi = self._mi(m)
        tile = TILE.get(m.name)
        for f in faces:
            f.material_index = mi
            f.smooth = smooth
            f.normal_update()
            if tile:
                n = f.normal
                ax = max(range(3), key=lambda i: abs(n[i]))
                for l in f.loops:
                    c = l.vert.co / F
                    if ax == 2:
                        u, v = c.x, c.y
                    elif ax == 0:
                        u, v = (c.y if n.x > 0 else -c.y), c.z
                    else:
                        u, v = (-c.x if n.y > 0 else c.x), c.z
                    l[self.uv].uv = (u / tile, v / tile)
        return faces

    def box(self, x0, y0, z0, x1, y1, z1, m):
        x0, x1 = min(x0, x1), max(x0, x1)
        y0, y1 = min(y0, y1), max(y0, y1)
        z0, z1 = min(z0, z1), max(z0, z1)
        mtx = self.M @ T((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2) @ Matrix.Diagonal(
            ((x1 - x0) * F, (y1 - y0) * F, (z1 - z0) * F, 1))
        g = bmesh.ops.create_cube(self.bm, size=1.0, matrix=mtx)
        self._finish_geom(g["verts"], m)

    def cyl(self, x, y, z0, r, h, m, segs=20, axis="z", r2=None, smooth=True):
        """Cylinder: base center (x,y,z0) for axis z; for axis x/y, (x,y,z0) is the centre of the start cap."""
        if axis == "z":
            mtx = self.M @ T(x, y, z0 + h / 2)
        elif axis == "x":
            mtx = self.M @ T(x + h / 2, y, z0) @ Matrix.Rotation(math.pi / 2, 4, "Y")
        else:
            mtx = self.M @ T(x, y + h / 2, z0) @ Matrix.Rotation(-math.pi / 2, 4, "X")
        g = bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=segs,
                                  radius1=r * F, radius2=(r2 if r2 is not None else r) * F, depth=h * F, matrix=mtx)
        faces = self._finish_geom(g["verts"], m, smooth=smooth)
        if smooth:
            for f in faces:
                if len(f.verts) > 4:
                    f.smooth = False

    def sphere(self, x, y, z, r, m, seg=16):
        g = bmesh.ops.create_uvsphere(self.bm, u_segments=seg, v_segments=max(seg // 2, 6), radius=r * F,
                                      matrix=self.M @ T(x, y, z))
        self._finish_geom(g["verts"], m, smooth=True)

    def prism(self, pts, z0, z1, m):
        """Extrude a 2D polygon (ft, CCW) from z0 to z1."""
        bot = [self.bm.verts.new(self.M @ Vector((p[0] * F, p[1] * F, z0 * F))) for p in pts]
        top = [self.bm.verts.new(self.M @ Vector((p[0] * F, p[1] * F, z1 * F))) for p in pts]
        self.bm.faces.new(list(reversed(bot)))
        self.bm.faces.new(top)
        n = len(pts)
        for i in range(n):
            j = (i + 1) % n
            self.bm.faces.new([bot[i], bot[j], top[j], top[i]])
        self._finish_geom(bot + top, m)

    def quad(self, p0, p1, p2, p3, m, uv=((0, 0), (1, 0), (1, 1), (0, 1))):
        """Single quad (ft coords), explicit UVs (0..1 decal space) unless material has a tile."""
        vs = [self.bm.verts.new(self.M @ Vector((p[0] * F, p[1] * F, p[2] * F))) for p in (p0, p1, p2, p3)]
        f = self.bm.faces.new(vs)
        f.material_index = self._mi(m)
        f.normal_update()
        tile = TILE.get(m.name)
        for l, u in zip(f.loops, uv):
            if tile:
                c = l.vert.co / F
                n = f.normal
                ax = max(range(3), key=lambda i: abs(n[i]))
                if ax == 2:
                    l[self.uv].uv = (c.x / tile, c.y / tile)
                elif ax == 0:
                    l[self.uv].uv = (c.y / tile, c.z / tile)
                else:
                    l[self.uv].uv = (c.x / tile, c.z / tile)
            else:
                l[self.uv].uv = u
        return f

    def finish(self):
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        ob = bpy.data.objects.new(self.name, me)
        coll(self.coll).objects.link(ob)
        if self.bevel:
            md = ob.modifiers.new("Bevel", "BEVEL")
            md.width = self.bevel * F
            md.segments = 2
            md.limit_method = "ANGLE"
            md.angle_limit = math.radians(40)
            md.harden_normals = False
        return ob


def solid(name, x0, y0, z0, x1, y1, z1, m, collection="Structure", bevel=0.0):
    b = B(name, collection, bevel)
    b.box(x0, y0, z0, x1, y1, z1, m)
    return b.finish()


# ----------------------------------------------------------------- layout constants (ft)
W, D = 50.0, 77.0
H = 20.0          # warehouse wall height
CUT = 3.5         # cutaway height for "low" wall parts
TW = 0.67         # exterior wall thickness
PT = 0.375        # partition thickness
PH = 10.0         # partition height
XC1, XC2 = 19.5, 32.5
YL, YLB = 65.0, 70.33   # lounge front, lounge back wall
XV = 29.6               # notch (vestibule) x
YOB = 18.5              # office block back wall
XS = 28.9               # storage/office east wall
YSO = 9.3               # storage/office divider
XR, YR = 41.6, 11.2     # restroom west wall x, south wall y
FL = 0.06               # floor finish thickness

# ----------------------------------------------------------------- ground / slab / floors
solid("Ground", -400, -400, -0.62, 400, 400, -0.6, M["ground"], "Env")
b = B("Slab", "Structure")
b.box(-TW - 0.6, -TW - 0.6, -0.6, W + TW + 0.6, YLB + TW + 0.6, 0, M["slab"])
b.box(XV - 0.6, YLB, -0.6, W + TW + 0.6, D + TW + 0.6, 0, M["slab"])
b.finish()

b = B("Floor_Concrete", "Floors")
b.box(XV, YLB - 1, 0, W, D, 0.01, M["concrete"])
b.box(XC2, YL, 0, W, YLB, 0.01, M["concrete"])
b.finish()
b = B("Floor_Turf", "Floors")
b.box(0, 0, 0, XC1, YL, FL, M["turf"])
b.box(XC1, YOB, 0, XC2, YL, FL, M["turf"])
b.finish()
b = B("Floor_Rubber", "Floors")
b.box(XC2, YOB, 0, W, 69.5, FL, M["rubber"])
b.finish()
b = B("Floor_Lounge", "Floors")
b.box(0, YL, 0, XC2, YLB, FL, M["lounge"])
b.finish()
b = B("Floor_LVP", "Floors")
b.box(XC1, 0, 0, W, YOB, FL * 0.8, M["lvp"])
b.finish()
b = B("Floor_Tile", "Floors")
b.box(XR, YR, 0, W, YOB, FL, M["tile"])
b.finish()
# dock keep-clear hatch + weight room decal
b = B("Decal_DockHatch", "Floors")
b.quad((40.3, 69.6, 0.03), (48.7, 69.6, 0.03), (48.7, D, 0.03), (40.3, D, 0.03), M["hatch"])
b.finish()
b = B("Decal_WeightRoom", "Floors")
# reads bottom-to-top along +y at x ~34.6
b.quad((35.6, 21.0, FL + 0.01), (35.6, 33.5, FL + 0.01), (34.1, 33.5, FL + 0.01), (34.1, 21.0, FL + 0.01), M["decal_wr"])
b.finish()


# ----------------------------------------------------------------- exterior walls (low / up split)
def wall_pair(name, x0, y0, x1, y1, openings=(), axis="x", top=H, m=None):
    """Wall box with door openings (list of (a0,a1,h)) along its long axis. Split at CUT."""
    m = m or M["wall"]
    lo, up = B(name + "_low", "Walls"), B(name + "_up", "Walls")

    def seg(a0, a1, z0, z1):
        if a1 - a0 <= 0.01 or z1 - z0 <= 0.01:
            return
        tgt = lo if z1 <= CUT + 1e-6 else up
        if axis == "x":
            tgt.box(a0, y0, z0, a1, y1, z1, m)
        else:
            tgt.box(x0, a0, z0, x1, a1, z1, m)

    a_start, a_end = (x0, x1) if axis == "x" else (y0, y1)
    cuts = sorted(openings)
    pos = a_start
    for (o0, o1, oh) in cuts:
        seg(pos, o0, 0, CUT)
        seg(pos, o0, CUT, top)
        # header above opening
        if oh < CUT:
            seg(o0, o1, oh, CUT)
            seg(o0, o1, CUT, top)
        else:
            seg(o0, o1, oh, top)
        pos = o1
    seg(pos, a_end, 0, CUT)
    seg(pos, a_end, CUT, top)
    return lo.finish(), up.finish()


wall_pair("Wall_W", -TW, -TW, 0, YLB + TW, axis="y")
wall_pair("Wall_E", W, -TW, W + TW, D + TW, axis="y")
wall_pair("Wall_LoungeBack", -TW, YLB, XV, YLB + TW, openings=[(11.0, 14.1, 7.0)], axis="x")
wall_pair("Wall_Notch", XV, YLB, XV + TW, D + TW, axis="y")
wall_pair("Wall_Back", XV, D, W + TW, D + TW, openings=[(40.3, 48.7, 10.0)], axis="x")

# ---- storefront (front wall y = 0)
DOORS_FRONT = [(1.6, 4.7), (14.9, 18.1), (42.8, 46.1)]
lo, up = B("Storefront_low", "Walls"), B("Storefront_up", "Walls")
glo, gup = B("Glass_low", "Glass"), B("Glass_up", "Glass")
GT = 0.06
spans = []
pos = -TW
for d0, d1 in DOORS_FRONT:
    spans.append((pos, d0))
    pos = d1
spans.append((pos, W + TW))
for a0, a1 in spans:
    lo.box(a0, -TW, 0, a1, -TW + 0.5, 1.5, M["alum"])                    # spandrel
    glo.box(a0, -0.38, 1.5, a1, -0.38 + GT, CUT, M["glass"])
    gup.box(a0, -0.38, CUT, a1, -0.38 + GT, 10.0, M["glass"])
    lo.box(a0, -0.5, CUT - 0.15, a1, -0.2, CUT, M["alum"])                # cutaway cap rail
    # mullions every ~5ft
    n = max(1, round((a1 - a0) / 5.0))
    for k in range(n + 1):
        x = a0 + (a1 - a0) * k / n
        xa, xb = max(a0, x - 0.09), min(a1, x + 0.09)
        lo.box(xa, -0.55, 1.5, xb, -0.2, CUT, M["alum"])
        up.box(xa, -0.55, CUT, xb, -0.2, 10.0, M["alum"])
    up.box(a0, -0.55, 9.8, a1, -0.2, 10.0, M["alum"])
# header wall above storefront
up.box(-TW, -TW, 10.0, W + TW, 0, H, M["wall"])
for d0, d1 in DOORS_FRONT:
    up.box(d0, -TW, 7.4, d1, 0, 10.0, M["alum"])
lo.finish(); up.finish(); glo.finish(); gup.finish()

# front doors (always visible): frames + glass leaves + push bars + small blue sconces
b = B("FrontDoors", "Doors", bevel=0.02)
g = B("FrontDoorGlass", "Glass")
for d0, d1 in DOORS_FRONT:
    b.box(d0, -0.6, 0, d0 + 0.18, -0.15, 7.4, M["alum"])
    b.box(d1 - 0.18, -0.6, 0, d1, -0.15, 7.4, M["alum"])
    b.box(d0, -0.6, 7.25, d1, -0.15, 7.4, M["alum"])
    b.box(d0 + 0.18, -0.45, 0, d1 - 0.18, -0.3, 0.6, M["alum"])
    b.box(d0 + 0.18, -0.45, 6.9, d1 - 0.18, -0.3, 7.25, M["alum"])
    g.box(d0 + 0.18, -0.4, 0.6, d1 - 0.18, -0.35, 6.9, M["glass"])
    b.box(d0 + 0.5, -0.22, 3.3, d1 - 0.5, -0.12, 3.45, M["chrome"])
    # exterior sconce (blue glow) next to each door
    b.box(d1 + 0.4, -TW - 0.12, 7.6, d1 + 0.75, -TW, 8.3, M["led_blue"])
b.finish(); g.finish()

# suite number on lobby door transom
# (kept simple: door header carries "204" via logo-free plate)

# ---- interior partitions (office block), height PH, light paint
def part(name, x0, y0, x1, y1, openings=(), axis="x", m=None, h=PH):
    m = m or M["wall_light"]
    b = B(name, "Partitions")
    a_start, a_end = (x0, x1) if axis == "x" else (y0, y1)
    pos = a_start
    for o0, o1 in sorted(openings):
        if axis == "x":
            b.box(pos, y0, 0, o0, y1, h, m)
            b.box(o0, y0, 7.0, o1, y1, h, m)
        else:
            b.box(x0, pos, 0, x1, o0, h, m)
            b.box(x0, o0, 7.0, x1, o1, h, m)
        pos = o1
    if axis == "x":
        b.box(pos, y0, 0, a_end, y1, h, m)
    else:
        b.box(x0, pos, 0, x1, a_end, h, m)
    return b.finish()


part("Part_OfficeBack", XC1, YOB, W, YOB + PT, openings=[(33.0, 36.1)], axis="x")
part("Part_OfficeWest", XC1, 0, XC1 + PT, YOB + PT, axis="y")
part("Part_StorageOffice", XC1, YSO, XS, YSO + PT, axis="x")
part("Part_StorageEast", XS, 0, XS + PT, YOB, openings=[(6.0, 8.8), (15.2, 18.0)], axis="y")
part("Part_RestWest", XR, YR, XR + PT, YOB, openings=[(12.3, 15.0)], axis="y")
part("Part_RestSouth", XR, YR, W, YR + PT, axis="x")

# door frames + open door leaves (interior)
b = B("InteriorDoors", "Doors", bevel=0.02)


def door_leaf(hx, hy, length, angle):
    b.push(hx, hy, 0, angle)
    b.box(0, -0.08, 0.05, length, 0.08, 6.95, M["door"])
    b.cyl(length - 0.3, 0.12, 3.4, 0.05, 0.2, M["chrome"], axis="y", segs=10)
    b.pop()


def frame_x(x0, x1, y, t=PT):
    b.box(x0 - 0.12, y - 0.05, 0, x0, y + t + 0.05, 7.1, M["alum"])
    b.box(x1, y - 0.05, 0, x1 + 0.12, y + t + 0.05, 7.1, M["alum"])
    b.box(x0 - 0.12, y - 0.05, 7.0, x1 + 0.12, y + t + 0.05, 7.12, M["alum"])


def frame_y(x, y0, y1, t=PT):
    b.box(x - 0.05, y0 - 0.12, 0, x + t + 0.05, y0, 7.1, M["alum"])
    b.box(x - 0.05, y1, 0, x + t + 0.05, y1 + 0.12, 7.1, M["alum"])
    b.box(x - 0.05, y0 - 0.12, 7.0, x + t + 0.05, y1 + 0.12, 7.12, M["alum"])


frame_x(33.0, 36.1, YOB)
door_leaf(33.05, YOB + PT + 0.1, 3.0, 90)          # hall -> weight room, opens into WR
frame_y(XS, 6.0, 8.8)
door_leaf(XS - 0.1, 6.05, 2.7, 180 - 0)           # office door swings into office
frame_y(XS, 15.2, 18.0)
door_leaf(XS - 0.1, 15.25, 2.7, 180)               # storage door
frame_y(XR, 12.3, 15.0)
door_leaf(XR + PT + 0.1, 12.35, 2.6, 0)            # restroom door
frame_x(11.0, 14.1, YLB - 0.05, TW)
b.box(11.0, YLB + 0.25, 0, 14.1, YLB + 0.4, 7.0, M["door"])   # vestibule door (closed)
b.finish()

# ---- E.P. panel, dock door
b = B("DockDoor", "Structure", bevel=0.02)
b.box(40.3, D - 0.2, 0, 48.7, D + 0.1, 10.0, M["rollup"])
b.box(40.0, D - 0.45, 0, 40.3, D, 10.3, M["steel"])
b.box(48.7, D - 0.45, 0, 49.0, D, 10.3, M["steel"])
b.box(40.0, D - 1.3, 10.0, 49.0, D, 11.2, M["steel"])        # coil box
b.box(44.2, D - 0.3, 0.2, 44.8, D - 0.2, 0.5, M["steel"])    # handle
for bx in (39.2, 49.4):                                       # bollards
    b.cyl(bx, D - 1.2, 0, 0.28, 4.0, M["yellow"], segs=18)
b.box(34.0, D - 0.35, 4.0, 35.5, D, 7.0, M["panel"])          # E.P.
b.box(34.4, D - 0.4, 4.6, 35.1, D - 0.35, 5.6, M["black_plastic"])
b.finish()

# ----------------------------------------------------------------- nets & cage frames
NH = 12.0
nets = B("Nets", "Nets")
frames = B("CageFrames", "Nets")


def net_x(x0, x1, y, z0=0, z1=NH, b=nets):
    b.quad((x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1), M["net"])


def net_y(y0, y1, x, z0=0, z1=NH, b=nets):
    b.quad((x, y0, z0), (x, y1, z0), (x, y1, z1), (x, y0, z1), M["net"])


def post(x, y, h=NH + 0.3):
    frames.box(x - 0.13, y - 0.13, 0, x + 0.13, y + 0.13, h, M["steel"])


def rail_x(x0, x1, y, z=NH):
    frames.cyl(x0, y, z, 0.06, x1 - x0, M["steel"], axis="x", segs=8)


def rail_y(y0, y1, x, z=NH):
    frames.cyl(x, y0, z, 0.06, y1 - y0, M["steel"], axis="y", segs=8)


C1X0, C1Y0, C1Y1 = 0.45, 0.4, 64.9
# Cage 1
net_y(C1Y0, C1Y1, C1X0)
net_y(C1Y0, C1Y1, XC1)
net_x(C1X0, XC1, C1Y1)
net_x(C1X0, 1.4, C1Y0); net_x(4.9, 14.7, C1Y0); net_x(18.3, XC1, C1Y0)
# net flaps at the two front doors (pulled partly closed)
net_x(1.4, 3.2, C1Y0 + 0.25, 0, 8.0); net_x(14.7, 16.6, C1Y0 + 0.25, 0, 8.0)
rail_x(C1X0, XC1, C1Y0, 8.0)
for yy in (C1Y0, 16.5, 32.6, 48.8, C1Y1):
    post(C1X0, yy); post(XC1, yy)
rail_y(C1Y0, C1Y1, C1X0); rail_y(C1Y0, C1Y1, XC1)
rail_x(C1X0, XC1, C1Y0); rail_x(C1X0, XC1, C1Y1)
# Cage 2
C2Y0 = YOB + PT + 0.15
ydiv = 41.8
net_x(XC1, XC2, C1Y1)
net_x(XC1, XC2, C2Y0)
net_y(C2Y0, 37.9, XC2); net_y(41.3, 61.1, XC2); net_y(64.5, C1Y1, XC2)
# side openings: flaps tied back
net_x(XC2, XC2 + 1.2, 61.1, 0, NH); net_x(XC2, XC2 + 1.2, 37.9, 0, NH)
# retractable divider (deployed), with yellow trim
net_x(XC1, XC2, ydiv, 0.0, NH - 0.2)
frames.box(XC1, ydiv - 0.05, NH - 0.35, XC2, ydiv + 0.05, NH - 0.2, M["yellow"])
for yy in (C2Y0, 30.0, ydiv, 53.0, C1Y1):
    post(XC2, yy)
post(XC2, 37.9); post(XC2, 41.3); post(XC2, 61.1); post(XC2, 64.5)
rail_y(C2Y0, C1Y1, XC2); rail_x(XC1, XC2, C2Y0); rail_x(XC1, XC2, C1Y1)
nets.finish()
frames.finish()


# ----------------------------------------------------------------- baseball props
def home_plate(b, cx, fy):
    """cx, fy = centre of the plate's front edge (edge faces -y, toward the pitcher)."""
    pts = [(-0.708, 0), (0.708, 0), (0.708, 0.708), (0, 1.417), (-0.708, 0.708)]
    b.prism([(cx + x, fy + y) for x, y in pts], FL, FL + 0.06, M["white"])


def batters_boxes(b, cx, fy):
    lw = 0.25
    mid = fy + 0.708
    for side in (-1, 1):
        xin = cx + side * (0.708 + 0.5)
        xout = xin + side * 4.0
        xa, xb = min(xin, xout), max(xin, xout)
        y0, y1 = mid - 3, mid + 3
        z = FL + 0.012
        b.box(xa, y0, FL, xb, y0 + lw, z, M["paint_white"])
        b.box(xa, y1 - lw, FL, xb, y1, z, M["paint_white"])
        b.box(xa, y0, FL, xa + lw, y1, z, M["paint_white"])
        b.box(xb - lw, y0, FL, xb, y1, z, M["paint_white"])


def ball_bucket(b, x, y, full=True):
    b.cyl(x, y, FL, 0.55, 1.5, M["bucket"], r2=0.62, segs=22)
    if full:
        import random
        rnd = random.Random(int(x * 100 + y))
        for i in range(16):
            a = rnd.random() * math.tau
            rr = rnd.random() * 0.42
            b.sphere(x + rr * math.cos(a), y + rr * math.sin(a), 1.5 + rnd.random() * 0.15, 0.12, M["ball"], seg=10)


def l_screen(name, cx, cy, rot, h=7.0, w=7.0):
    """L-screen; local +y faces the hitter. Opening at top-right (local +x)."""
    b = B(name, "Props", bevel=0.0, M0=T(cx, cy) @ rz(rot))
    r = 0.07
    hw = w / 2
    pts = [(-hw, 0), (hw, 0)]
    # frame tubes
    b.cyl(-hw, 0, 0, r, h, M["steel"], segs=8)
    b.cyl(0.6, 0, 0, r, h, M["steel"], segs=8)
    b.cyl(hw, 0, 0, r, h * 0.55, M["steel"], segs=8)
    b.cyl(-hw, 0, h, r, hw + 0.6, M["steel"], axis="x", segs=8)
    b.cyl(-hw, 0, 0.15, r, w, M["steel"], axis="x", segs=8)
    b.cyl(0.6, 0, h * 0.55, r, hw - 0.6, M["steel"], axis="x", segs=8)
    # feet
    for fx in (-hw, 0.6, hw):
        b.cyl(fx, -1.0, 0.07, 0.06, 2.0, M["steel"], axis="y", segs=8)
    # net panels
    b.quad((-hw, 0, 0.15), (0.6, 0, 0.15), (0.6, 0, h), (-hw, 0, h), M["net"])
    b.quad((0.6, 0, 0.15), (hw, 0, 0.15), (hw, 0, h * 0.55), (0.6, 0, h * 0.55), M["net"])
    # padded lower band (brand blue)
    b.box(-hw, -0.06, 0.2, hw, 0.06, 1.1, M["pad_blue"])
    return b.finish()


def pitching_machine(name, cx, cy, rot):
    """Two-wheel machine on a tripod; local +y faces the hitter."""
    b = B(name, "Props", bevel=0.0, M0=T(cx, cy) @ rz(rot))
    for a in (90, 210, 330):
        ang = math.radians(a)
        b.push(0, 0, 0, a - 90)
        b.box(-0.06, 0, 0, 0.06, 1.6, 0.12, M["steel"])
        b.cyl(0, 1.6, 0, 0.12, 0.08, M["black_plastic"], segs=10)
        b.pop()
    b.cyl(0, 0, 0, 0.09, 3.2, M["steel"], segs=10)
    # head
    b.box(-0.9, -0.5, 3.1, 0.9, 0.5, 3.4, M["steel"])
    for sx in (-0.55, 0.55):
        b.cyl(sx, 0.05, 3.4, 0.6, 0.35, M["black_plastic"], segs=24)
        b.cyl(sx, 0.05, 3.75, 0.25, 0.4, M["steel_blue"], segs=16)
    b.box(-0.15, -1.3, 3.55, 0.15, 0.0, 3.8, M["steel"])        # chute
    b.box(-0.35, -1.6, 3.8, 0.35, -1.1, 4.6, M["steel_blue"])   # feeder hopper
    b.box(-0.5, -0.4, 2.3, 0.5, 0.2, 2.9, M["steel_blue"])      # control box
    return b.finish()


def portable_mound(name, x0, x1, y0, y1, rub_y):
    b = B(name, "Props", bevel=0.0)
    top = 0.83
    flat_end = rub_y + 2.2
    prof = [(y0, 0.0), (y0 + 0.15, top - 0.05), (y0 + 0.4, top), (flat_end, top), (y1 - 0.2, FL + 0.08), (y1, FL)]
    xa, xb = x0 + 0.2, x1 - 0.2
    vL = [b.bm.verts.new(b.M @ Vector((xa * F, y * F, z * F))) for y, z in prof]
    vR = [b.bm.verts.new(b.M @ Vector((xb * F, y * F, z * F))) for y, z in prof]
    gL = [b.bm.verts.new(b.M @ Vector((x0 * F, y * F, 0))) for y, z in prof]
    gR = [b.bm.verts.new(b.M @ Vector((x1 * F, y * F, 0))) for y, z in prof]
    for i in range(len(prof) - 1):
        b.bm.faces.new([vL[i], vR[i], vR[i + 1], vL[i + 1]])
        b.bm.faces.new([gL[i], vL[i], vL[i + 1], gL[i + 1]])
        b.bm.faces.new([vR[i], gR[i], gR[i + 1], vR[i + 1]])
    b.bm.faces.new([gL[0], gR[0], vR[0], vL[0]])
    b._finish_geom(vL + vR + gL + gR, M["clay"])
    cx = (x0 + x1) / 2
    b.box(cx - 1.0, rub_y - 0.5, top, cx + 1.0, rub_y, top + 0.05, M["white"])   # rubber
    for wx in (x0 + 0.6, x1 - 0.6):                                            # wheels
        b.cyl(wx - 0.15, y0 + 0.35, 0.3, 0.3, 0.3, M["black_plastic"], axis="x", segs=16)
    return b.finish()


def hittrax(name, cx, cy):
    b = B(name, "Props", bevel=0.02)
    b.box(cx - 1.5, cy - 0.3, 0, cx + 1.5, cy + 0.3, 2.4, M["black_plastic"])
    b.quad((cx - 1.2, cy - 0.31, 1.0), (cx + 1.2, cy - 0.31, 1.0), (cx + 1.2, cy - 0.31, 2.1), (cx - 1.2, cy - 0.31, 2.1), M["scr_spray"])
    return b.finish()


def batting_tee(b, x, y):
    b.cyl(x, y, FL, 0.6, 0.25, M["black_plastic"], segs=18, r2=0.45)
    b.cyl(x, y, FL + 0.25, 0.08, 2.4, M["orange"], segs=12)
    b.sphere(x, y, FL + 2.75, 0.12, M["ball"], seg=10)


b = B("Cage1_Field", "Props")
home_plate(b, 10.2, 61.8)
batters_boxes(b, 10.2, 61.8)
ball_bucket(b, 12.6, 27.0)
ball_bucket(b, 7.6, 27.3, full=False)
b.finish()
b = B("Cage2_Field", "Props")
home_plate(b, 26.0, 61.0); batters_boxes(b, 26.0, 61.0)
home_plate(b, 26.0, 37.9); batters_boxes(b, 26.0, 37.9)
batting_tee(b, 26.0, 61.5)
ball_bucket(b, 28.6, 51.5)
ball_bucket(b, 28.0, 23.2)
b.finish()
# loose balls on the turf
import random as _r
_rnd = _r.Random(42)
b = B("LooseBalls", "Props")
for (xa, xb, ya, yb, n) in ((1.0, 18.8, 36, 63, 14), (1.0, 6, 3, 30, 6), (20.2, 31.8, 45, 63, 8), (20.2, 31.8, 26, 41, 6)):
    for k in range(n):
        b.sphere(_rnd.uniform(xa, xb), _rnd.uniform(ya, yb), FL + 0.12, 0.12, M["ball"], seg=10)
b.finish()
portable_mound("MoundA", 2.0, 9.1, 0.8, 10.9, 2.7)
portable_mound("MoundB", 11.6, 18.6, 0.8, 10.9, 2.7)
hittrax("HitTrax", 10.2, 64.4)
pitching_machine("Machine_Cage1", 10.2, 25.9, 0)
l_screen("LScreen_Cage1", 10.2, 29.6, 0)
pitching_machine("Machine_Cage2", 26.0, 21.6, 0)
l_screen("LScreen_Cage2B", 26.0, 24.6, 0, h=6.5, w=6.0)
l_screen("LScreen_Cage2A", 26.0, 50.5, 0, h=6.5, w=6.0)

# mirror on west wall by batter's box
b = B("Mirror_Cage1", "Props")
b.box(0.02, 58.0, 1.0, 0.12, 64.5, 7.5, M["alum"])
b.box(0.12, 58.1, 1.1, 0.15, 64.4, 7.4, M["mirror"])
b.finish()

# ----------------------------------------------------------------- weight room
def power_rack(name, cx, cy, loaded=True):
    """Bar runs along y. Front (open) side toward -x. Platform 8x8."""
    b = B(name, "Props", bevel=0.015, M0=T(cx, cy))
    # platform: wood centre strip along x, rubber inserts
    b.box(-4, -4, FL, 4, -2, FL + 0.12, M["rubber"])
    b.box(-4, 2, FL, 4, 4, FL + 0.12, M["rubber"])
    b.box(-4, -2, FL, 4, 2, FL + 0.12, M["wood"])
    b.box(-4.02, -4.02, FL, 4.02, 4.02, FL + 0.1, M["steel"])
    z0 = FL + 0.12
    hh = 7.6
    xs, ys = (-0.6, 3.4), (-2.2, 2.2)
    for x in xs:
        for y in ys:
            b.box(x - 0.125, y - 0.125, z0, x + 0.125, y + 0.125, z0 + hh, M["steel"])
            # hole pattern hint
        b.box(x - 0.15, -2.4, z0 + hh - 0.25, x + 0.15, 2.4, z0 + hh, M["steel"])
    for y in ys:
        b.box(-0.75, y - 0.15, z0 + hh - 0.25, 3.55, y + 0.15, z0 + hh, M["steel"])
        b.box(-0.75, y - 0.15, z0, 3.55, y + 0.15, z0 + 0.2, M["steel"])
        # safety arms
        b.box(-0.6, y - 0.1, z0 + 2.2, 3.4, y + 0.1, z0 + 2.4, M["steel_blue"])
    b.cyl(-0.6, -2.2, z0 + hh - 0.6, 0.07, 4.4, M["chrome"], axis="y", segs=10)  # pull-up bar
    # J-hooks + barbell
    bz = z0 + 4.4
    for y in ys:
        b.box(-0.85, y - 0.15, bz - 0.25, -0.45, y + 0.15, bz - 0.08, M["steel_blue"])
    if loaded:
        bx = -0.75
        b.cyl(bx, -3.6, bz, 0.045, 7.2, M["chrome"], axis="y", segs=10)
        b.cyl(bx, -3.6, bz, 0.085, 1.4, M["chrome"], axis="y", segs=12)
        b.cyl(bx, 2.2, bz, 0.085, 1.4, M["chrome"], axis="y", segs=12)
        for side in (-1, 1):
            for k, pm in enumerate((M["bumper"], M["bumper"], M["bumper_blue"])):
                yc = side * (2.55 + k * 0.22)
                b.cyl(bx, yc - 0.1, bz, 0.74, 0.2, pm, axis="y", segs=32)
            b.cyl(bx, side * 3.25 - 0.06, bz, 0.13, 0.12, M["steel"], axis="y", segs=12)
    # plate storage horns on back uprights
    for y in ys:
        sgn = 1 if y > 0 else -1
        b.cyl(3.4, y if sgn > 0 else y - 0.75, z0 + 1.0, 0.07, 0.75, M["steel"], axis="y", segs=8)
        for k in range(3):
            yy = y + (0.2 + k * 0.2) * sgn
            r = 0.74 if k < 2 else 0.55
            b.cyl(3.4, yy - 0.09, z0 + 1.0, r, 0.18, M["bumper"] if k < 2 else M["bumper_blue"], axis="y", segs=28)
    return b.finish()


power_rack("Rack1", 45.8, 35.0)
power_rack("Rack2", 45.8, 25.1)


def bench(name, cx, cy):
    b = B(name, "Props", bevel=0.03, M0=T(cx, cy))
    b.box(-2.1, -0.45, 1.25, 2.1, 0.45, 1.55, M["pad"])
    b.box(-2.1, -0.47, 1.22, 2.1, 0.47, 1.27, M["pad_blue"])
    b.box(-1.8, -0.12, 0.25, 1.8, 0.12, 1.22, M["steel"])
    for x in (-1.9, 1.9):
        b.box(x - 0.15, -0.8, FL, x + 0.15, 0.8, 0.25, M["steel"])
    b.box(-1.6, -0.1, 0.3, -1.2, 0.1, 1.22, M["steel"])
    return b.finish()


for i, y in enumerate((55.7, 51.6, 47.6, 43.6)):
    bench(f"Bench{i + 1}", 40.8, y)

# dumbbell rack (two tiers, 20 pairs 5-100 lb), along y at x 47.3..49.7
b = B("DBRack", "Props", bevel=0.01)
x0, x1, y0, y1 = 47.4, 49.7, 42.1, 57.0
for y in (y0 + 0.2, (y0 + y1) / 2, y1 - 0.2):
    b.box(x0, y - 0.12, FL, x0 + 0.25, y + 0.12, 2.9, M["steel"])
    b.box(x1 - 0.25, y - 0.12, FL, x1, y + 0.12, 2.9, M["steel"])
    b.box(x0, y - 0.12, FL, x1, y + 0.12, 0.25, M["steel"])
for z, xa, xb in ((1.4, x0 - 0.1, x0 + 1.3), (2.55, x0 + 0.6, x1)):
    b.box(xa, y0, z - 0.12, xb, y1, z, M["steel"])
b.box(x0 - 0.1, y0, 1.3, x0 + 1.3, y1, 1.28 + 0.02, M["steel"])
weights = list(range(5, 101, 5))
heavy, light = weights[10:], weights[:10]
for tier, ws, z, xc in ((0, heavy, 1.4, x0 + 0.62), (1, light, 2.55, x0 + 1.3)):
    n = len(ws)
    for k, wt in enumerate(ws):
        for pair in (0, 1):
            y = y0 + 0.6 + (k * 2 + pair) * (y1 - y0 - 1.2) / (n * 2 - 1)
            r = 0.17 + 0.17 * (wt / 100) ** 0.6
            L = 0.9 + 0.25 * (wt / 100)
            hl = 0.42
            b.cyl(xc - hl / 2 - L * 0.0, y, z + r, 0.05, hl, M["chrome"], axis="x", segs=8)
            hw = 0.18 + 0.2 * (wt / 100)
            b.cyl(xc - hl / 2 - hw, y, z + r, r, hw, M["bumper"], axis="x", segs=6, smooth=False)
            b.cyl(xc + hl / 2, y, z + r, r, hw, M["bumper"], axis="x", segs=6, smooth=False)
b.finish()

# functional trainer / cable machine at x 44.6..49.7, y 64.5..68.7 (faces -y)
b = B("CableMachine", "Props", bevel=0.015)
cx0, cx1, cy0, cy1 = 44.7, 49.6, 65.0, 68.6
for x in (cx0 + 0.2, cx1 - 0.2):
    for y in (cy0 + 0.3, cy1 - 0.2):
        b.box(x - 0.13, y - 0.13, FL, x + 0.13, y + 0.13, 8.0, M["steel"])
    b.box(x - 0.15, cy0 + 0.2, 7.75, x + 0.15, cy1 - 0.1, 8.0, M["steel"])
    b.box(x - 0.15, cy0 + 0.2, FL, x + 0.15, cy1 - 0.1, 0.25, M["steel"])
    # weight stack
    xs_ = x + (0.75 if x < 47 else -0.75)
    b.box(xs_ - 0.45, cy1 - 1.2, FL + 0.2, xs_ + 0.45, cy1 - 0.5, 3.6, M["bumper"])
    b.box(xs_ - 0.5, cy1 - 1.25, FL + 0.2, xs_ + 0.5, cy1 - 0.45, 0.25, M["steel_blue"])
    for gx in (xs_ - 0.3, xs_ + 0.3):
        b.cyl(gx, cy1 - 0.85, 3.6, 0.04, 4.1, M["chrome"], segs=8)
    # shroud
    b.box(xs_ - 0.55, cy1 - 0.4, FL, xs_ + 0.55, cy1 - 0.3, 7.6, M["steel_blue"])
    # pulley carriage column
    b.box(x - 0.1, cy0 - 0.15, 0.3, x + 0.1, cy0 + 0.15, 7.6, M["steel"])
    b.cyl(x, cy0 - 0.35, 4.5, 0.22, 0.15, M["black_plastic"], axis="y", segs=14)
b.box(cx0 + 0.05, cy0 + 0.15, 7.6, cx1 - 0.05, cy0 + 0.45, 7.95, M["steel"])
b.cyl(cx0 + 0.3, cy0 - 0.4, 7.5, 0.06, cx1 - cx0 - 0.6, M["chrome"], axis="x", segs=10)
b.finish()

# Bulgarian split squat rack at x 45.5..49.7, y 59..62.6
b = B("BSSRack", "Props", bevel=0.02)
b.box(45.6, 59.2, FL, 49.6, 62.4, FL + 0.15, M["steel"])
for x in (47.0, 49.2):
    for y in (59.5, 62.1):
        b.box(x - 0.12, y - 0.12, FL, x + 0.12, y + 0.12, 6.0, M["steel"])
    b.box(x - 0.14, 59.3, 5.8, x + 0.14, 62.3, 6.0, M["steel"])
b.cyl(46.6, 59.0, 4.2, 0.045, 4.0, M["chrome"], axis="y", segs=10)
# roller pad stand
b.box(45.9, 60.7, FL, 46.3, 61.0, 1.6, M["steel"])
b.cyl(45.6, 60.85, 1.75, 0.25, 1.0, M["pad_blue"], axis="x", segs=16)
b.finish()

# band rack (wall), x 33.3..37, y 67..68.8
b = B("BandRack", "Props", bevel=0.01)
b.box(33.3, 68.7, 1.0, 37.0, 68.9, 6.5, M["steel"])
b.box(33.3, 68.2, FL, 37.0, 68.9, 0.25, M["steel"])
for i, bm_ in enumerate(M["bands"]):
    x = 33.7 + i * 0.5
    b.cyl(x, 68.25, 6.0, 0.05, 0.45, M["chrome"], axis="y", segs=8)
    L = 3.4 + (i % 3) * 0.5
    for dx in (-0.08, 0.08):
        b.box(x + dx - 0.04, 68.3, 6.0 - L, x + dx + 0.04, 68.34, 6.05, bm_)
b.finish()

# med ball rack x 37.3..41.7
b = B("MedBallRack", "Props", bevel=0.01)
for z in (0.3, 2.0):
    b.box(37.4, 67.3, z, 41.6, 68.8, z + 0.12, M["steel"])
for x in (37.45, 41.55):
    for y in (67.35, 68.75):
        b.box(x - 0.08, y - 0.08, FL, x + 0.08, y + 0.08, 3.6, M["steel"])
i = 0
for z, r in ((0.42, 0.55), (2.12, 0.45)):
    xx = 37.4 + r
    while xx + r <= 41.6 + 0.01:
        b.sphere(xx, 68.05, z + r, r, M["medballs"][i % len(M["medballs"])], seg=18)
        xx += 2 * r + 0.08
        i += 1
b.finish()

# ----------------------------------------------------------------- lounge
def couch(name, x0, y0, x1, y1, facing, fabric):
    """facing: direction the seat faces: '-y', '+y', '-x', '+x'."""
    L = (x1 - x0) if facing in ("-y", "+y") else (y1 - y0)
    Dp = (y1 - y0) if facing in ("-y", "+y") else (x1 - x0)
    rot = {"-y": 0, "+y": 180, "+x": 90, "-x": -90}[facing]
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    b = B(name, "Props", bevel=0.08, M0=T(cx, cy) @ rz(rot))
    hl, hd = L / 2, Dp / 2
    arm = 0.5
    b.box(-hl, -hd, 0.25, hl, hd, 1.2, fabric)                     # base
    b.box(-hl, hd - 0.75, 1.2, hl, hd, 2.75, fabric)              # back
    b.box(-hl, -hd, 1.2, -hl + arm, hd, 2.15, fabric)             # arms
    b.box(hl - arm, -hd, 1.2, hl, hd, 2.15, fabric)
    n = 2 if L < 6 else 3
    w = (L - 2 * arm) / n
    for k in range(n):
        xa = -hl + arm + k * w + 0.03
        b.box(xa, -hd + 0.05, 1.2, xa + w - 0.06, hd - 0.75, 1.6, fabric)        # seat cushion
        b.box(xa, hd - 1.15, 1.6, xa + w - 0.06, hd - 0.7, 2.6, fabric)          # back cushion
    for fx in (-hl + 0.2, hl - 0.2):
        for fy in (-hd + 0.2, hd - 0.2):
            b.cyl(fx, fy, FL, 0.08, 0.25, M["walnut"], segs=8)
    return b.finish()


def armchair(name, cx, cy, rot, fabric, s=1.0):
    b = B(name, "Props", bevel=0.08, M0=T(cx, cy) @ rz(rot) @ Matrix.Diagonal((s, s, s, 1)))
    b.box(-1.3, -1.25, 0.3, 1.3, 1.25, 1.25, fabric)
    b.box(-1.3, 0.6, 1.25, 1.3, 1.25, 2.7, fabric)
    b.box(-1.3, -1.25, 1.25, -0.9, 1.25, 2.1, fabric)
    b.box(0.9, -1.25, 1.25, 1.3, 1.25, 2.1, fabric)
    b.box(-0.88, -1.2, 1.25, 0.88, 0.6, 1.6, fabric)
    for fx in (-1.1, 1.1):
        for fy in (-1.05, 1.05):
            b.cyl(fx, fy, FL, 0.07, 0.3, M["walnut"], segs=8)
    return b.finish()


def tv(name, x, y, z, w, h, rot, screen):
    """TV centred at (x,y,z); rot = direction the screen faces (0 = -y)."""
    b = B(name, "Props", bevel=0.01, M0=T(x, y, z) @ rz(rot))
    b.box(-w / 2, -0.08, -h / 2, w / 2, 0.12, h / 2, M["tv_bezel"])
    b.quad((-w / 2 + 0.06, -0.09, -h / 2 + 0.06), (w / 2 - 0.06, -0.09, -h / 2 + 0.06),
           (w / 2 - 0.06, -0.09, h / 2 - 0.06), (-w / 2 + 0.06, -0.09, h / 2 - 0.06), screen)
    return b.finish()


tv("TV_HitTrax", 4.8, YLB - 0.15, 6.2, 3.6, 2.05, 0, M["scr_spray"])
armchair("LoungeChair1", 8.0, 69.25, 0, M["fabric_dark"], s=0.8)
armchair("LoungeChair2", 10.15, 69.25, 0, M["fabric_dark"], s=0.8)
couch("LoungeCouch1", 15.0, 67.9, 20.8, 70.25, "-y", M["fabric_blue"])
couch("LoungeCouch2", 21.4, 67.9, 27.2, 70.25, "-y", M["fabric_blue"])

# bat rack + cubbies on west wall of lounge (x 0..1.3, y 65.3..70.2)
b = B("BatRack", "Props", bevel=0.01)
b.box(0.0, 65.2, FL, 1.4, 70.2, 3.2, M["walnut"])
for k in range(5):
    y = 65.3 + k * 0.98
    b.box(0.1, y, 0.4, 1.4, y + 0.06, 3.1, M["oak"])
for z in (1.2, 2.2):
    b.box(0.1, 65.25, z, 1.4, 70.15, z + 0.06, M["oak"])
for k in range(5):
    y = 65.8 + k * 0.98
    b.box(0.25, y - 0.3, 0.45, 1.1, y + 0.3, 1.05, [M["fabric_dark"], M["fabric_blue"], M["shirt_gray"]][k % 3])
# bats leaning in rail above cubbies
b.box(0.05, 65.2, 5.2, 0.6, 70.2, 5.35, M["walnut"])
for k in range(12):
    y = 65.5 + k * 0.38
    m_ = M["bat_alloy"] if k % 3 else M["bat_wood"]
    b.cyl(0.35, y, 3.25, 0.06, 2.6, m_, r2=0.11, segs=10)
b.finish()

# logos
b = B("Logo_LoungeWall", "Decals")
_lw = img("logo_wall.png").size
lw_aspect = _lw[0] / _lw[1]
LX0, LX1 = 6.5, 26.5
lh = (LX1 - LX0) / lw_aspect
b.quad((LX0, YLB - 0.03, 17.6 - lh), (LX1, YLB - 0.03, 17.6 - lh), (LX1, YLB - 0.03, 17.6), (LX0, YLB - 0.03, 17.6), M["logo"])
b.finish()
b = B("Logo_WestWall", "Decals")
WY0, WY1 = 22.0, 50.0
wh = (WY1 - WY0) / lw_aspect
b.quad((0.03, WY0, 19.2 - wh), (0.03, WY1, 19.2 - wh), (0.03, WY1, 19.2), (0.03, WY0, 19.2), M["logo"])
b.finish()

# wall-wash fixtures (top of west wall + lounge back wall) and blue accent strip
b = B("WallLights", "WallLights")
for y in range(6, 64, 12):
    b.box(0.0, y, 18.9, 0.5, y + 6, 19.25, M["fixture"])
    b.box(0.45, y + 0.1, 18.95, 0.5, y + 5.9, 19.2, M["led"])
for x in (2.0, 26.0 - 2):
    pass
b.box(0.0, 0.0, 0.45, 0.08, YLB, 0.6, M["led_blue"])
b.box(0.0, YLB - 0.08, 0.45, XV, YLB, 0.6, M["led_blue"])
b.box(W - 0.08, YOB + PT, 0.45, W, D, 0.6, M["led_blue"])
b.finish()

# ----------------------------------------------------------------- office block interiors
# Coach Ned office: x 19.9..28.9, y 0..9.3
def desk(name, x0, y0, x1, y1, top=M["desk_white"], monitor_face=None):
    b = B(name, "Props", bevel=0.02)
    b.box(x0, y0, 2.35, x1, y1, 2.5, top)
    for xx in (x0 + 0.1, x1 - 0.25):
        b.box(xx, y0 + 0.1, FL, xx + 0.15, y1 - 0.1, 2.35, M["black_plastic"])
    if monitor_face:
        mx, my, rot = monitor_face
        b.push(mx, my, 2.5, rot)
        b.box(-0.9, -0.05, 0.5, 0.9, 0.05, 1.55, M["tv_bezel"])
        b.quad((-0.85, -0.06, 0.55), (0.85, -0.06, 0.55), (0.85, -0.06, 1.5), (-0.85, -0.06, 1.5), M["scr_logo"])
        b.box(-0.06, 0.02, 0, 0.06, 0.15, 0.5, M["black_plastic"])
        b.box(-0.4, -0.2, 0, 0.4, 0.3, 0.04, M["black_plastic"])
        b.box(-0.7, -0.9, 0, 0.7, -0.45, 0.04, M["black_plastic"])
        b.pop()
    return b.finish()


def office_chair(name, x, y, rot):
    b = B(name, "Props", bevel=0.05, M0=T(x, y) @ rz(rot))
    for a in range(0, 360, 72):
        b.push(0, 0, 0, a)
        b.box(-0.06, 0, 0.15, 0.06, 1.0, 0.25, M["black_plastic"])
        b.pop()
    b.cyl(0, 0, 0.25, 0.08, 1.2, M["chrome"], segs=10)
    b.box(-0.9, -0.85, 1.45, 0.9, 0.85, 1.75, M["fabric_dark"])
    b.box(-0.85, 0.75, 1.9, 0.85, 0.95, 3.6, M["fabric_dark"])
    return b.finish()


desk("Desk_Ned", 21.5, 0.6, 24.1, 5.0, monitor_face=(22.7, 2.8, 90))
office_chair("Chair_Ned", 25.0, 2.8, -90)
desk("Desk_Extra", 25.0, 0.4, 28.8, 2.0)
couch("OfficeCouch", 19.95, 5.4, 22.6, 9.25, "+x", M["fabric_blue"])
b = B("OfficeTable", "Props", bevel=0.03)
b.box(23.3, 5.9, 1.35, 24.6, 8.4, 1.5, M["walnut"])
b.box(23.4, 6.0, FL, 24.5, 8.3, 1.35, M["black_plastic"])
b.finish()
tv("TV_Office", XS - 0.15, 3.2, 6.0, 3.2, 1.85, -90, M["scr_team"])
# plant
b = B("OfficePlant", "Props")
b.cyl(27.8, 8.4, FL, 0.45, 1.2, M["pot"], segs=18)
for k in range(7):
    a = k * math.tau / 7
    b.sphere(27.8 + 0.3 * math.cos(a), 8.4 + 0.3 * math.sin(a), 1.9 + 0.3 * (k % 2), 0.45, M["plant"], seg=8)
b.finish()

# Storage: x 19.9..28.9, y 9.7..18.5 — shelving with bins
b = B("StorageShelves", "Props", bevel=0.01)


def shelf_run(x0, y0, x1, y1, along="x"):
    for z in (0.3, 2.0, 3.7, 5.4):
        b.box(x0, y0, z, x1, y1, z + 0.08, M["steel"])
    for t in range(4):
        if along == "x":
            xx = x0 + (x1 - x0) * t / 3
            for yy in (y0, y1 - 0.1):
                b.box(xx - 0.05, yy, FL, xx + 0.05, yy + 0.1, 6.2, M["steel"])
        else:
            yy = y0 + (y1 - y0) * t / 3
            for xx in (x0, x1 - 0.1):
                b.box(xx, yy - 0.05, FL, xx + 0.1, yy + 0.05, 6.2, M["steel"])
    import random
    rnd = random.Random(int(x0 * 7 + y0))
    for z in (0.38, 2.08, 3.78, 5.48):
        if along == "x":
            xx = x0 + 0.15
            while xx < x1 - 1.3:
                m_ = rnd.choice([M["cardboard"], M["cardboard"], M["bin"], M["bin_clear"]])
                hh = rnd.uniform(0.9, 1.4)
                b.box(xx, y0 + 0.15, z, xx + 1.15, y1 - 0.15, z + hh, m_)
                xx += 1.3
        else:
            yy = y0 + 0.15
            while yy < y1 - 1.3:
                m_ = rnd.choice([M["cardboard"], M["cardboard"], M["bin"], M["bin_clear"]])
                hh = rnd.uniform(0.9, 1.4)
                b.box(x0 + 0.15, yy, z, x1 - 0.15, yy + 1.15, z + hh, m_)
                yy += 1.3


shelf_run(20.3, 16.4, 27.0, 18.4, "x")
shelf_run(19.95, 9.8, 21.9, 15.9, "y")
b.finish()

# Lobby: reception desk (L), TV behind, couches, table, merch, chairs, vending
b = B("ReceptionDesk", "Props", bevel=0.03)
b.box(32.4, 0.5, FL, 36.2, 1.9, 2.5, M["black_plastic"])
b.box(36.1, 0.5, FL, 37.6, 5.4, 3.6, M["black_plastic"])
b.box(36.0, 0.4, 3.5, 37.75, 5.5, 3.7, M["desk_white"])
b.box(32.3, 0.4, 2.45, 36.3, 2.0, 2.6, M["desk_white"])
b.box(37.6, 0.6, 0.4, 37.65, 5.3, 0.55, M["led_blue"])
b.box(36.2, 0.5, 2.35, 37.5, 5.4, 2.5, M["desk_white"])
b.finish()
b = B("ReceptionLogo", "Decals")
b.quad((37.66, 1.2, 1.1), (37.66, 4.8, 1.1), (37.66, 4.8, 2.1), (37.66, 1.2, 2.1), M["logo_only"])
b.finish()
office_chair("Chair_Reception", 34.6, 3.4, 90)
b = B("ReceptionMonitor", "Props", bevel=0.01)
b.push(36.4, 3.0, 2.5, -90)
b.box(-0.75, -0.04, 0.45, 0.75, 0.04, 1.35, M["tv_bezel"])
b.box(-0.06, 0.0, 0, 0.06, 0.12, 0.45, M["black_plastic"])
b.pop()
b.finish()
tv("TV_Lobby", XS + PT + 0.15, 4.0, 6.3, 4.0, 2.3, 90, M["scr_logo"])
couch("LobbyCouch1", 37.7, 8.5, 42.0, 11.15, "-y", M["fabric_blue"])
couch("LobbyCouch2", 42.2, 8.5, 46.5, 11.15, "-y", M["fabric_blue"])
b = B("LobbyTable", "Props", bevel=0.04)
b.box(39.6, 5.8, 1.3, 44.8, 7.4, 1.48, M["walnut"])
for xx in (39.8, 44.4):
    b.box(xx, 5.9, FL, xx + 0.2, 7.3, 1.3, M["black_plastic"])
b.finish()
armchair("LobbyChair1", 48.6, 4.0, -90, M["fabric_dark"])
armchair("LobbyChair2", 48.6, 6.6, -90, M["fabric_dark"])
tv("TV_LobbyRight", W - 0.15, 2.4, 6.0, 3.4, 1.95, -90, M["scr_swing"])
solid("Banner_Panel", 37.0, YR - 0.08, 3.9, 47.2, YR, 7.05, M["tv_bezel"], "Decals")
b = B("Banner_Lobby", "Decals")
b.quad((37.4, YR - 0.1, 4.3), (46.8, YR - 0.1, 4.3), (46.8, YR - 0.1, 6.65), (37.4, YR - 0.1, 6.65), M["banner"],
       uv=((0, 0), (1, 0), (1, 1), (0, 1)))
b.finish()

# merch: clothing rack + wall shelf, x 46.9..49.7, y 8.4..11
b = B("MerchRack", "Props", bevel=0.01)
b.box(47.0, 8.4, FL, 47.1, 8.5, 5.4, M["chrome"])
b.box(47.0, 10.9, FL, 47.1, 11.0, 5.4, M["chrome"])
b.cyl(47.05, 8.4, 5.3, 0.04, 2.6, M["chrome"], axis="y", segs=8)
cols = [M["shirt_black"], M["shirt_white"], M["shirt_blue"], M["shirt_black"], M["shirt_gray"], M["shirt_blue"], M["shirt_white"]]
for k, c in enumerate(cols):
    y = 8.6 + k * 0.33
    b.box(46.25, y, 2.6, 47.85, y + 0.12, 5.2, c)
    b.box(46.0, y, 4.3, 48.1, y + 0.12, 5.2, c)
# wall shelf with folded tees + hats
b.box(49.0, 8.4, 5.6, W, 11.0, 5.7, M["walnut"])
b.box(49.0, 8.4, 3.8, W, 11.0, 3.9, M["walnut"])
for k in range(4):
    y = 8.55 + k * 0.62
    b.box(49.15, y, 5.7, W - 0.05, y + 0.5, 5.95, cols[k])
    b.box(49.15, y, 3.9, W - 0.05, y + 0.5, 4.2, cols[k + 2])
b.finish()

# vending machines (face +x), x 29.3..32.1
b = B("Vending", "Props", bevel=0.03)
for y0 in (9.7, 12.4):
    b.box(XS + PT + 0.05, y0, FL, 32.1, y0 + 2.6, 6.0, M["black_plastic"])
    b.quad((32.11, y0 + 0.2, 1.4), (32.11, y0 + 1.8, 1.4), (32.11, y0 + 1.8, 5.7), (32.11, y0 + 0.2, 5.7), M["vend"])
    b.box(32.1, y0 + 1.95, 3.0, 32.15, y0 + 2.4, 4.6, M["tv_bezel"])
    b.box(32.1, y0 + 0.2, 0.4, 32.15, y0 + 1.8, 1.0, M["tv_bezel"])
b.finish()

# planter by front door
b = B("LobbyPlant", "Props")
b.cyl(41.6, 1.4, FL, 0.55, 1.5, M["pot"], segs=18)
for k in range(9):
    a = k * math.tau / 9
    b.sphere(41.6 + 0.35 * math.cos(a), 1.4 + 0.35 * math.sin(a), 2.3 + 0.5 * (k % 3) / 2, 0.55, M["plant"], seg=8)
b.finish()

# Restroom: toilet, sink, grab bars, mirror
b = B("Restroom", "Props", bevel=0.04)
b.box(49.2, 16.6, FL, W, 18.2, 2.9, M["porcelain"])              # tank
b.box(47.7, 16.9, FL, 49.2, 17.9, 1.35, M["porcelain"])          # bowl
b.box(47.6, 16.85, 1.35, 49.2, 17.95, 1.45, M["porcelain"])
b.box(48.6, 13.2, 2.6, W, 15.0, 2.95, M["porcelain"])            # sink
b.box(W - 0.1, 13.3, 4.0, W - 0.02, 14.9, 6.5, M["mirror"])
b.cyl(W - 0.2, 14.1, 2.95, 0.04, 0.5, M["chrome"], segs=8)
b.cyl(46.0, YOB - 0.25, 2.9, 0.06, 3.5, M["chrome"], axis="x", segs=8)
b.cyl(W - 0.25, 15.5, 2.9, 0.06, 2.8, M["chrome"], axis="y", segs=8)
b.finish()

# ----------------------------------------------------------------- ceilings (interior views only)
cb = B("Ceiling_Deck", "Ceiling")
CZ = 22.0
cb.box(-TW, -TW, CZ, W + TW, YLB + TW, CZ + 0.3, M["deck"])
cb.box(XV, YLB, CZ, W + TW, D + TW, CZ + 0.3, M["deck"])
cb.finish()
jb = B("Ceiling_Joists", "Ceiling")
for y in [y * 6.0 + 3 for y in range(13)]:
    xl = XV if y > YLB else 0
    jb.box(xl, y - 0.06, CZ - 1.8, W, y + 0.06, CZ - 1.65, M["joist"])
    jb.box(xl, y - 0.06, CZ - 0.15, W, y + 0.06, CZ, M["joist"])
    for k in range(25):
        x = k * 2.0
        if x < xl:
            continue
        jb.box(x, y - 0.03, CZ - 1.65, x + 0.06, y + 0.03, CZ - 0.15, M["joist"])
jb.finish()
# drop ceiling over office block
db = B("Ceiling_Office", "Ceiling")
db.box(XC1, 0, 9.5, W, YOB + PT, 9.6, M["acoustic"])
db.finish()
# hanging LED fixtures (visible) — positions shared with area lights
HANG = []
for y in (8, 20, 32, 44, 56):
    HANG += [(5.0, y), (14.5, y)]
for y in (24, 36, 48, 59):
    HANG.append((26.0, y))
for y in (24, 36, 48, 60):
    HANG += [(37.5, y), (45.5, y)]
HANG += [(8.0, 67.6), (24.0, 67.6), (41.0, 73.0)]
HZ = 15.5
hb = B("Ceiling_Fixtures", "Ceiling")
for (x, y) in HANG:
    hb.box(x - 0.5, y - 4.0, HZ, x + 0.5, y + 4.0, HZ + 0.25, M["fixture"])
    hb.box(x - 0.42, y - 3.9, HZ - 0.02, x + 0.42, y + 3.9, HZ, M["led"])
    for yy in (y - 3.0, y + 3.0):
        hb.cyl(x, yy, HZ + 0.25, 0.02, CZ - 1.8 - HZ - 0.25, M["steel"], segs=6)
# troffers
TROF = [(24.3, 4.6), (24.3, 14.0), (35.0, 15.0), (34.0, 4.0), (40.5, 4.0), (46.5, 4.0), (45.8, 14.8)]
for (x, y) in TROF:
    hb.box(x - 1.0, y - 2.0, 9.48, x + 1.0, y + 2.0, 9.5, M["led"])
hb.finish()

# ----------------------------------------------------------------- lights
def area(name, x, y, z, sx, sy, power, color=(1.0, 0.97, 0.92)):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = "RECTANGLE"
    ld.size = sx * F
    ld.size_y = sy * F
    ld.energy = power
    ld.color = color
    ob = bpy.data.objects.new(name, ld)
    ob.location = (x * F, y * F, z * F)
    coll("Lights").objects.link(ob)
    return ob


for i, (x, y) in enumerate(HANG):
    area(f"L_hang{i}", x, y, HZ - 0.05, 0.85, 7.8, 420)
for i, (x, y) in enumerate(TROF):
    area(f"L_trof{i}", x, y, 9.45, 2.0, 4.0, 90)

sun_d = bpy.data.lights.new("Sun", "SUN")
sun_d.energy = 3.2
sun_d.angle = math.radians(8)
sun = bpy.data.objects.new("Sun", sun_d)
sun.rotation_euler = (math.radians(42), math.radians(0), math.radians(205))
coll("Lights").objects.link(sun)

# world
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (*lin("#dfe3e8"), 1)
bg.inputs["Strength"].default_value = 1.0

# Studio key light for exterior cutaway views
key_d = bpy.data.lights.new("KeySoftbox", "AREA")
key_d.shape = "RECTANGLE"
key_d.size = 30
key_d.size_y = 40
key_d.energy = 60000
key = bpy.data.objects.new("KeySoftbox", key_d)
key.location = (35 * F + 6, 30 * F, 30)
key.rotation_euler = (0, math.radians(-15), 0)
coll("StudioLights").objects.link(key)

bpy.ops.wm.save_as_mainfile(filepath=OUT)
print("saved", OUT, len(bpy.data.objects), "objects")
