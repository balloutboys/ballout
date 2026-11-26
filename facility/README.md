# Suite 204 facility model

3D model, renders and virtual tour of the planned Ball Out Boys Athletics facility
(Suite 204, 3,874 SF, warehouse 50' × 77'), built to scale from layout v6.

- `renders/` – still renders (Blender Cycles). `hero.jpg` matches the angle of the
  reference render: long side toward the camera, near wall cut away.
- `scripts/` – everything needed to rebuild the model and renders.

## Rebuild

```bash
uv venv --python 3.13 venv && . venv/bin/activate
uv pip install bpy==5.3.0 numpy pillow
cd facility/scripts
python textures.py tex                      # procedural textures + logo decals from public/brand
python build.py tex facility.blend          # model (all layout numbers are in feet, see constants)
python render.py facility.blend hero out.png 2400 1600 64
python export_web.py facility.blend facility.glb tex_web   # GLB for the web tour
```

Views in `render.py`: `hero`, `front`, `cages`, `weightroom`, `lobby`, `top`,
`eye_cage1`, `eye_weight`, plus 360° panoramas `p_*` used by the tour.

Concept renders only, not construction drawings. Verify clear height, egress and
permits with the landlord before install.
