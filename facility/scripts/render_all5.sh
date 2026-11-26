#!/bin/bash
cd "$(dirname "$0")"
. ../venv/bin/activate
r(){ echo "== $1 $(date +%T)"; python render.py facility.blend $1 final/$1.png $2 $3 $4 2>&1 | grep -E "rendered|Traceback"; }
r lobby 2400 1600 56
r hero 2400 1600 56
for p in p_lobby p_office p_storage p_restroom p_hall p_cage1_plate p_lounge p_cage1_mound p_cage2 p_weight p_cable; do r $p 3072 1536 32; done
r top 1600 2400 40
r front 2400 1600 56
r cages 2400 1600 56
r eye_cage1 2400 1350 56
r weightroom 2400 1600 56
r eye_weight 2400 1350 56
echo ALLDONE $(date +%T)
