#!/bin/bash
# re-render every view that shows the lobby
cd "$(dirname "$0")"
. ../venv/bin/activate
r(){ echo "== $1 $(date +%T)"; python render.py facility.blend $1 final/$1.png $2 $3 $4 2>&1 | grep -E "rendered|Traceback"; }
r lobby 2400 1600 64
r p_lobby 3072 1536 40
r hero 2400 1600 64
r p_hall 3072 1536 40
r p_office 3072 1536 40
r top 1600 2400 48
r front 2400 1600 64
r cages 2400 1600 64
echo ALLDONE $(date +%T)
