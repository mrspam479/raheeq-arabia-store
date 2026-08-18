"""
Drop your 3 product images into the same folder as this script,
then run:  python scripts/process_remote_images.py

Expected input files (any name, in this folder):
  - IMAGE 1 → becomes cover.webp    (main hero: Land Cruiser / villa scene)
  - IMAGE 2 → becomes gallery-1.webp (4-panel Arabic grid)
  - IMAGE 3 → becomes gallery-2.webp (cloning step / instructions diagram)

Rename your files to match before running, or edit MAPPING below.
"""

import sys
import pathlib

try:
    from PIL import Image
except ImportError:
    print("Pillow not found. Run:  pip install Pillow")
    sys.exit(1)

DEST = pathlib.Path(__file__).parent.parent / "frontend" / "public" / "images" / "products" / "remote"
DEST.mkdir(parents=True, exist_ok=True)

# ── Edit these to match whatever filenames you drop in ──────────────────────
HERE = pathlib.Path(__file__).parent
MAPPING = {
    HERE / "cover_input.png":    DEST / "cover.webp",
    HERE / "gallery1_input.png": DEST / "gallery-1.webp",
    HERE / "gallery2_input.png": DEST / "gallery-2.webp",
}
# ────────────────────────────────────────────────────────────────────────────

for src, dst in MAPPING.items():
    if not src.exists():
        print(f"⚠  Not found: {src}  — skipping")
        continue
    img = Image.open(src).convert("RGBA")
    # Convert RGBA → RGB for WebP (white background for transparency)
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        img = bg
    img.save(dst, "WEBP", quality=82, method=6)
    print(f"✓  {src.name}  →  {dst.name}  ({dst.stat().st_size // 1024} KB)")

print("\nDone! Now run:  git add . && git commit -m 'feat: add remote product images' && git push")
