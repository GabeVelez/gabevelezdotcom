#!/usr/bin/env python3
"""
Render a level's collision on top of its background so misalignment is obvious.

Image models will not place shelves at exact pixel positions no matter how good
the reference is, so the practical workflow is: generate the art, overlay the
collision, look at the drift, then move whichever one is cheaper to move.

Usage:
    python3 tools/collision-overlay.py                  # every level
    python3 tools/collision-overlay.py corridor         # one level
    python3 tools/collision-overlay.py corridor out.png # one level, named output

Output goes to tools/overlays/ by default.

The rotate(-90) handling mirrors SVGCollisionParser exactly, so what you see is
what the game collides with, not an approximation of it.
"""

import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "tools", "overlays")

# level -> (collision svg, background png)
LEVELS = {
    "cell":               ("cell-collision.svg",                "scenes/cell/cell-layout.png"),
    "sewer":              ("sewer-collision.svg",               "scenes/sewer/sewer-layout.png"),
    "corridor":           ("corridor-collision.svg",            "scenes/corridor/corridor-layoutB.png"),
    "warehouse-main":     ("warehouse-main-collision.svg",      "scenes/warehouse/warehouse.png"),
    "storage-bay":        ("storage-bay-collision.svg",         "layouts/storage_bay_layout.png"),
    "loading-dock":       ("loading-dock-collision.svg",        "layouts/loading_dock_layout.png"),
    "security-office":    ("security-office-collision.svg",     "layouts/security_office_layout.png"),
    "maintenance-tunnel": ("maintenance-tunnel-collision.svg",  "layouts/maintenance_tunnel_layout.png"),
    "executive-wing":     ("executive-wing-collision.svg",      "scenes/executive-wing/executive-bg.png"),
    "rooftop":            ("rooftop-collision.svg",             "scenes/rooftop-helipad/rooftop-layout.png"),
}


def parse_collision(svg_path):
    """Return [(x, y, w, h)] in level-local space, matching SVGCollisionParser."""
    svg = open(svg_path).read()
    body = svg.split("<defs>")[0]  # skip the clipPath Figma adds

    rects = []
    for match in re.finditer(r"<rect([^>]*?)/>", body):
        attrs = match.group(1)

        def attr(name, default=0.0):
            found = re.search(name + r'="([-\d.eE]+)"', attrs)
            return float(found.group(1)) if found else default

        x, y, w, h = attr("x"), attr("y"), attr("width"), attr("height")

        rot = re.search(r"rotate\(-90\s+([-\d.]+)\s+([-\d.]+)\)", attrs)
        if rot:
            cx, cy = float(rot.group(1)), float(rot.group(2))
            x, y, w, h = cx, cy - w, h, w

        if w > 0 and h > 0:
            rects.append((x, y, w, h))
    return rects


def svg_canvas(svg_path):
    head = open(svg_path).read()[:400]
    w = re.search(r'width="([\d.]+)"', head)
    h = re.search(r'height="([\d.]+)"', head)
    return (float(w.group(1)) if w else 0, float(h.group(1)) if h else 0)


def png_size(path):
    out = subprocess.run(
        ["magick", "identify", "-format", "%w %h", path],
        capture_output=True, text=True
    ).stdout.split()
    return (int(out[0]), int(out[1])) if len(out) == 2 else (0, 0)


def overlay(level, out_path=None, scale=3):
    svg_name, png_name = LEVELS[level]
    svg_path = os.path.join(ROOT, "assets", "collision", svg_name)
    png_path = os.path.join(ROOT, "assets", png_name)

    for p in (svg_path, png_path):
        if not os.path.exists(p):
            print(f"  {level}: missing {os.path.relpath(p, ROOT)}")
            return None

    rects = parse_collision(svg_path)
    cw, ch = svg_canvas(svg_path)
    pw, ph = png_size(png_path)

    # The background is drawn stretched to the collision canvas in game, so
    # scale the art to the collision space rather than the other way round.
    note = ""
    if (pw, ph) != (int(cw), int(ch)):
        note = f"  [art {pw}x{ph} vs collision {int(cw)}x{int(ch)} - art is stretched to fit in game]"

    draws = []
    for x, y, w, h in rects:
        draws += ["-draw", f"rectangle {x},{y} {x + w},{y + h}"]

    out_path = out_path or os.path.join(OUT_DIR, f"{level}.png")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    subprocess.run(
        ["magick", png_path, "-resize", f"{int(cw)}x{int(ch)}!",
         "-fill", "rgba(255,0,0,0.38)", "-stroke", "rgba(255,80,80,0.95)", "-strokewidth", "1",
         *draws,
         "-filter", "point", "-resize", f"{scale * 100}%", out_path],
        check=True,
    )
    print(f"  {level}: {len(rects)} bodies -> {os.path.relpath(out_path, ROOT)}{note}")
    return out_path


if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] in LEVELS:
        overlay(args[0], args[1] if len(args) > 1 else None)
    elif args:
        print(f"unknown level '{args[0]}'. known: {', '.join(sorted(LEVELS))}")
        sys.exit(1)
    else:
        for name in LEVELS:
            overlay(name)
