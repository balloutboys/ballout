import bpy, sys, os
blend, out, texweb = sys.argv[1:4]
bpy.ops.wm.open_mainfile(filepath=blend)
for cname in ("Ceiling", "Lights", "StudioLights", "Env"):
    c = bpy.data.collections.get(cname)
    if c:
        for ob in list(c.objects):
            bpy.data.objects.remove(ob, do_unlink=True)
for ob in bpy.data.objects:
    for md in list(ob.modifiers):
        ob.modifiers.remove(md)
for im in bpy.data.images:
    if im.filepath:
        im.filepath = os.path.join(texweb, os.path.basename(im.filepath))
        im.reload()
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_lights=False,
                          export_cameras=False, export_image_format="AUTO", export_yup=True)
