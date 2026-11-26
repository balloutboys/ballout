"""Turn a .glb into a self-contained glTF JSON (buffer embedded as a data URI)."""
import base64, json, struct, sys
src, dst = sys.argv[1:3]
b = open(src, "rb").read()
assert b[:4] == b"glTF"
off, js, binc = 12, None, None
while off < len(b):
    ln, typ = struct.unpack("<I4s", b[off:off + 8])
    chunk = b[off + 8:off + 8 + ln]
    if typ == b"JSON":
        js = json.loads(chunk)
    elif typ == b"BIN\x00":
        binc = chunk
    off += 8 + ln
js["buffers"][0]["uri"] = "data:application/octet-stream;base64," + base64.b64encode(binc).decode()
json.dump(js, open(dst, "w"), separators=(",", ":"))
