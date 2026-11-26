"""Render a named view of facility.blend with Cycles.

python render.py <blend> <view> <out.png> <width> <height> <samples>
"""
import bpy, sys, math
from mathutils import Vector

blend, view, out = sys.argv[1:4]
RW, RH, SAMPLES = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
F = 0.3048
bpy.ops.wm.open_mainfile(filepath=blend)
sc = bpy.context.scene

CUT_E = ["Wall_E_up", "Storefront_up", "Glass_up"]
CUT_FRONT = ["Storefront_up", "Glass_up"]

VIEWS = {
    # Like the reference render: long side toward camera, near (east) wall cut away
    "hero": dict(loc=(118, 6, 80), target=(23, 38, 0), lens=46, hide=CUT_E, ceiling=False, studio=True,
                 sun=(-0.35, 0.5, -0.8)),
    "front": dict(loc=(58, -78, 88), target=(25, 40, 0), lens=44, hide=CUT_E + ["Wall_LoungeBack_up_x"],
                  ceiling=False, studio=True, sun=(-0.45, 0.3, -0.84)),
    "top": dict(loc=(25, 38.5, 300), target=(25, 38.5001, 0), ortho=84 * F, hide=[], ceiling=False, studio=True,
                sun=(-0.3, 0.45, -0.84)),
    "weightroom": dict(loc=(64, 10, 34), target=(40, 42, 2), lens=30, hide=CUT_E, ceiling=False, studio=True,
                       sun=(-0.35, 0.5, -0.8)),
    "lobby": dict(loc=(62, -16, 34), target=(37, 8, 1), lens=30, hide=CUT_E, ceiling=False, studio=True,
                  sun=(-0.35, 0.5, -0.8)),
    "cages": dict(loc=(10, -30, 40), target=(17, 40, 0), lens=34, hide=CUT_FRONT, ceiling=False, studio=True,
                  sun=(-0.4, 0.4, -0.82)),
    # interior eye-level stills (ceiling on)
    "eye_cage1": dict(loc=(12.6, 64.2, 5.9), target=(9.6, 0, 3.0), lens=22, hide=[], ceiling=True, studio=False),
    "eye_weight": dict(loc=(37.0, 67.5, 5.8), target=(44.5, 24, 2.5), lens=20, hide=[], ceiling=True, studio=False),
}

PANOS = {
    # name: (x, y, z)  — all rendered facing +y (yaw 0) so the tour can map them consistently
    "p_lobby": (40.0, 3.5, 5.3, 0),
    "p_office": (26.4, 6.4, 5.3, 0),
    "p_storage": (24.6, 12.8, 5.3, 0),
    "p_restroom": (44.6, 14.6, 5.3, 0),
    "p_hall": (35.0, 15.6, 5.3, 0),
    "p_cage1_plate": (13.2, 61.0, 5.3, 0),
    "p_cage1_mound": (5.55, 3.0, 6.1, 0),
    "p_cage2": (29.5, 45.5, 5.3, 0),
    "p_weight": (38.0, 42.0, 5.3, 0),
    "p_cable": (40.5, 61.0, 5.3, 0),
    "p_lounge": (13.5, 66.8, 5.3, 0),
}

if view in VIEWS:
    cfg = VIEWS[view]
else:
    x, y, z, yaw = PANOS[view]
    cfg = dict(pano=True, loc=(x, y, z), yaw=yaw, hide=[], ceiling=True, studio=False)

# ---- visibility
for n in cfg["hide"]:
    ob = bpy.data.objects.get(n)
    if ob:
        ob.hide_render = True
bpy.data.collections["Ceiling"].hide_render = not cfg["ceiling"]
bpy.data.collections["StudioLights"].hide_render = not cfg["studio"]

world = sc.world
bgn = world.node_tree.nodes["Background"]
sun = bpy.data.objects["Sun"]
if cfg["studio"]:
    bgn.inputs["Strength"].default_value = 0.55
    sun.data.energy = 1.6
    d = Vector(cfg["sun"]).normalized()
    sun.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    for ob in bpy.data.objects:
        if ob.name.startswith("L_hang"):
            ob.data.energy = 120
        if ob.name.startswith("L_trof"):
            ob.data.energy = 35
    key = bpy.data.objects["KeySoftbox"]
    key.location = (25 * F, 38 * F, 32)
    key.rotation_euler = (0, 0, 0)
    key.data.energy = 9000
else:
    # interior: daylight outside the storefront, fixtures do the work inside
    bgn.inputs["Strength"].default_value = 1.2
    sun.data.energy = 2.5
    d = Vector((0.25, 0.55, -0.6)).normalized()
    sun.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    for ob in bpy.data.objects:
        if ob.name.startswith("L_hang"):
            ob.data.energy = 170
        if ob.name.startswith("L_trof"):
            ob.data.energy = 55

# ---- camera
cd = bpy.data.cameras.new("Cam")
cam = bpy.data.objects.new("Cam", cd)
sc.collection.objects.link(cam)
cam.location = Vector(cfg["loc"]) * F
cd.sensor_width = 36
cd.clip_start = 0.05
cd.clip_end = 500
if cfg.get("pano"):
    cd.type = "PANO"
    try:
        cd.panorama_type = "EQUIRECTANGULAR"
    except Exception:
        cd.cycles.panorama_type = "EQUIRECTANGULAR"
    cam.rotation_euler = (math.radians(90), 0, math.radians(-cfg["yaw"]))
else:
    tgt = Vector(cfg["target"]) * F
    cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler()
    if cfg.get("ortho"):
        cd.type = "ORTHO"
        cd.ortho_scale = cfg["ortho"]
    else:
        cd.lens = cfg["lens"]
sc.camera = cam

# ---- render settings
sc.render.engine = "CYCLES"
cy = sc.cycles
cy.device = "CPU"
cy.samples = SAMPLES
cy.use_adaptive_sampling = True
cy.adaptive_threshold = 0.02
cy.use_denoising = True
try:
    cy.denoiser = "OPENIMAGEDENOISE"
except Exception:
    pass
cy.max_bounces = 8
cy.diffuse_bounces = 3
cy.glossy_bounces = 3
cy.transmission_bounces = 6
cy.transparent_max_bounces = 48
cy.caustics_reflective = False
cy.caustics_refractive = False
cy.blur_glossy = 1.0
sc.render.resolution_x = RW
sc.render.resolution_y = RH
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_depth = "8"
vs = sc.view_settings
vs.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        vs.look = look
        break
    except Exception:
        pass
vs.exposure = cfg.get("exposure", 0.0)
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("rendered", out)
