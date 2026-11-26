#!/bin/bash
cd "$(dirname "$0")"
. ../venv/bin/activate
r(){ echo "== $1 $(date +%T)"; python render.py facility.blend $1 final/$1.png $2 $3 $4 2>&1 | grep -E "rendered|Traceback"; }
r lobby 2400 1600 64
r hero 2400 1600 64
for p in p_lobby p_cage1_plate p_cage1_mound p_cage2 p_lounge p_hall p_office p_weight p_cable; do r $p 3072 1536 40; done
r cages 2400 1600 64
r front 2400 1600 64
r top 1600 2400 48
r eye_cage1 2400 1350 64
r weightroom 2400 1600 64
r eye_weight 2400 1350 64
echo ALLDONE $(date +%T)
