#!/usr/bin/env python3
"""
Generate the Shreela Group "contact us" QR code artwork.

Writes two SVGs next to this script:
  shreela-contact-qr-card.svg  printable card: brand header, QR code, fallback contact text
  shreela-contact-qr.svg       QR code with the SG logo badge only, for dropping into other layouts

The centre badge is sg_icon_master.jpg: the square SG mark cut from public/images/sg_logo.jpeg,
the same image the site uses as its browser-tab icon (public/images/sg_icon.png is it at 192 px).

Every piece of text is converted to vector outlines, so the SVGs look identical on any
machine or print shop without needing the Inter font installed.

Requires:  pip install segno fonttools uharfbuzz
Usage:     python generate_qr.py [--url URL] [--badge IMAGE] [--font-dir DIR]
"""
import argparse
import base64
import re
import tempfile
import urllib.request
from pathlib import Path

import segno
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

DEFAULT_URL = "https://metalloscrap.com/#contact-info"

# Brand palette, taken from src/components/BusinessWebsite.css
INK = "#1a1a1a"
BLUE = "#2c5aa0"
BLUE_DARK = "#1e3a5f"
GREY = "#4a4a4a"
MUTED = "#666666"
FRAME = "#e2e6ea"
HEADER_SUB = "#a9a9a9"
WHITE = "#ffffff"

WEIGHTS = (500, 700, 800, 900)
QUIET = 4      # quiet-zone width in modules; the QR spec requires at least 4
BADGE_CLEAR = 9  # modules cleared in the centre for the SG badge (H level tolerates ~30% loss)


def num(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("", "-0") else s


# ---------------------------------------------------------------- fonts / text
def fetch_fonts(font_dir):
    """Download static Inter TTFs from Google Fonts once, then reuse the cache."""
    font_dir.mkdir(parents=True, exist_ok=True)
    paths = {w: font_dir / f"Inter-{w}.ttf" for w in WEIGHTS}
    if all(p.exists() for p in paths.values()):
        return paths
    css_url = "https://fonts.googleapis.com/css2?family=Inter:wght@" + ";".join(map(str, WEIGHTS))
    # A plain user agent makes Google Fonts answer with TTF rather than WOFF2.
    req = urllib.request.Request(css_url, headers={"User-Agent": "curl/8"})
    css = urllib.request.urlopen(req, timeout=30).read().decode()
    for block in css.split("@font-face")[1:]:
        weight = re.search(r"font-weight:\s*(\d+)", block)
        src = re.search(r"url\((\S+?\.ttf)\)", block)
        if weight and src and int(weight.group(1)) in paths:
            urllib.request.urlretrieve(src.group(1), paths[int(weight.group(1))])
    missing = [w for w, p in paths.items() if not p.exists()]
    if missing:
        raise SystemExit(f"Could not download Inter weights: {missing}")
    return paths


class TextSetter:
    """Shapes text with HarfBuzz (proper kerning) and returns it as SVG path data."""

    def __init__(self, path):
        self.tt = TTFont(path)
        if "fvar" in self.tt:
            raise SystemExit(f"{path} is a variable font; expected a static instance")
        self.glyphs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        face = hb.Face(hb.Blob.from_file_path(str(path)))
        self.font = hb.Font(face)
        self.upem = face.upem

    def _shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": True})
        return buf.glyph_infos, buf.glyph_positions

    def width(self, text, size, tracking=0.0):
        _, pos = self._shape(text)
        return sum(p.x_advance for p in pos) * size / self.upem + tracking * (len(pos) - 1)

    def path(self, text, size, x, baseline, tracking=0.0, anchor="middle"):
        infos, pos = self._shape(text)
        scale = size / self.upem
        if anchor == "middle":
            x -= self.width(text, size, tracking) / 2
        elif anchor == "end":
            x -= self.width(text, size, tracking)
        pen = SVGPathPen(self.glyphs, ntos=num)
        for info, p in zip(infos, pos):
            gx, gy = x + p.x_offset * scale, baseline - p.y_offset * scale
            self.glyphs[self.order[info.codepoint]].draw(TransformPen(pen, (scale, 0, 0, -scale, gx, gy)))
            x += p.x_advance * scale + tracking
        return pen.getCommands()


# ---------------------------------------------------------------- shapes
def rrect(x, y, w, h, r):
    """Rounded-rectangle path data (clockwise)."""
    r = min(r, w / 2, h / 2)
    return (f"M{num(x + r)} {num(y)}H{num(x + w - r)}A{num(r)} {num(r)} 0 0 1 {num(x + w)} {num(y + r)}"
            f"V{num(y + h - r)}A{num(r)} {num(r)} 0 0 1 {num(x + w - r)} {num(y + h)}"
            f"H{num(x + r)}A{num(r)} {num(r)} 0 0 1 {num(x)} {num(y + h - r)}"
            f"V{num(y + r)}A{num(r)} {num(r)} 0 0 1 {num(x + r)} {num(y)}Z")


def qr_artwork(matrix, x0, y0, m, badge_uri):
    """QR code with rounded modules, brand-blue finder rings and the SG logo in the centre.

    (x0, y0) is the top-left of the quiet zone; m is the module size.
    """
    n = len(matrix)
    ox, oy = x0 + QUIET * m, y0 + QUIET * m
    finders = [(0, 0), (0, n - 7), (n - 7, 0)]  # (row, col) of each 7x7 finder pattern
    lo = (n - BADGE_CLEAR) // 2
    hi = lo + BADGE_CLEAR

    def in_finder(r, c):
        return any(fr <= r < fr + 7 and fc <= c < fc + 7 for fr, fc in finders)

    inset, radius = m * 0.05, m * 0.3
    modules = []
    for r, row in enumerate(matrix):
        for c, dark in enumerate(row):
            if not dark or in_finder(r, c) or (lo <= r < hi and lo <= c < hi):
                continue
            modules.append(rrect(ox + c * m + inset, oy + r * m + inset, m - 2 * inset, m - 2 * inset, radius))

    parts = [f'<path fill="{INK}" d="{"".join(modules)}"/>']
    for fr, fc in finders:
        fx, fy = ox + fc * m, oy + fr * m
        ring = rrect(fx, fy, 7 * m, 7 * m, 2 * m) + rrect(fx + m, fy + m, 5 * m, 5 * m, 1.1 * m)
        parts.append(f'<path fill="{BLUE}" fill-rule="evenodd" d="{ring}"/>')
        parts.append(f'<path fill="{INK}" d="{rrect(fx + 2 * m, fy + 2 * m, 3 * m, 3 * m, 0.9 * m)}"/>')

    # Centre badge: the square SG logo image with rounded corners, inside the cleared area.
    side = (BADGE_CLEAR - 1.4) * m
    bx = ox + (lo + (BADGE_CLEAR * m - side) / (2 * m)) * m
    by = oy + (lo + (BADGE_CLEAR * m - side) / (2 * m)) * m
    parts.append(f'<clipPath id="badge-clip"><path d="{rrect(bx, by, side, side, side * 0.18)}"/></clipPath>')
    parts.append(f'<image xlink:href="{badge_uri}" x="{num(bx)}" y="{num(by)}" width="{num(side)}" '
                 f'height="{num(side)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#badge-clip)"/>')
    return "\n".join(parts)


def data_uri(path):
    """Embed an image in the SVG so the file is self-contained for printing."""
    mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}[path.suffix.lower()]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def svg_doc(w, h, title, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n'
            f"<title>{title}</title>\n"
            f'<defs><linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0" stop-color="{BLUE}"/><stop offset="1" stop-color="{BLUE_DARK}"/></linearGradient></defs>\n'
            f"{body}\n</svg>\n")


# ---------------------------------------------------------------- layouts
def build_card(matrix, fonts, badge_uri):
    W, H = 1200, 1600
    black, xbold, bold, medium = (fonts[w] for w in (900, 800, 700, 500))
    cx = W / 2
    qr_side = 720  # fixed artwork size; the module size adapts to the QR version
    m = qr_side / (len(matrix) + 2 * QUIET)
    qx, qy = (W - qr_side) / 2, 522

    def text(setter, s, size, baseline, fill, tracking=0.0):
        return f'<path fill="{fill}" d="{setter.path(s, size, cx, baseline, tracking)}"/>'

    body = [
        f'<rect width="{W}" height="{H}" fill="{WHITE}"/>',
        # Header, styled like the site navbar: near-black band with a blue rule.
        f'<rect width="{W}" height="300" fill="{INK}"/>',
        text(black, "SHREELA GROUP", 96, 172, WHITE, tracking=-1),
        text(medium, "(formerly MetalloScrap)", 30, 236, HEADER_SUB, tracking=4),
        f'<rect y="300" width="{W}" height="12" fill="{BLUE}"/>',
        # Call to action
        text(black, "SCAN TO CONTACT US", 58, 424, INK, tracking=1),
        text(medium, "Call, email or send us an inquiry", 30, 476, MUTED),
        # QR code in a soft frame (the frame sits outside the 4-module quiet zone)
        f'<path fill="none" stroke="{FRAME}" stroke-width="4" d="{rrect(qx, qy, qr_side, qr_side, 28)}"/>',
        qr_artwork(matrix, qx, qy, m, badge_uri),
        # Fallback details for anyone who cannot scan
        text(xbold, "metalloscrap.com", 46, qy + qr_side + 82, BLUE),
        text(medium, "+49 176 68554158   ·   +91 91489 71493", 30, qy + qr_side + 142, GREY),
        text(medium, "info@metalloscrap.com", 30, qy + qr_side + 188, GREY),
        # Footer band in the site's button gradient
        f'<rect y="{H - 110}" width="{W}" height="110" fill="url(#brand)"/>',
        text(bold, "DIRECT METAL PROCUREMENT SOLUTIONS", 28, H - 45, WHITE, tracking=4),
    ]
    return svg_doc(W, H, "Shreela Group: scan to contact us", "\n".join(body))


def build_plain(matrix, badge_uri):
    side = 1000
    m = side / (len(matrix) + 2 * QUIET)
    body = f'<rect width="{side}" height="{side}" fill="{WHITE}"/>\n' + qr_artwork(matrix, 0, 0, m, badge_uri)
    return svg_doc(side, side, "Shreela Group contact QR code", body)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", default=DEFAULT_URL)
    ap.add_argument("--badge", type=Path, default=Path(__file__).resolve().parent / "sg_icon_master.jpg")
    ap.add_argument("--font-dir", type=Path, default=Path(tempfile.gettempdir()) / "shreela-qr-fonts")
    ap.add_argument("--out-dir", type=Path, default=Path(__file__).resolve().parent)
    args = ap.parse_args()

    qr = segno.make_qr(args.url, error="h")
    matrix = [list(row) for row in qr.matrix]
    fonts = {w: TextSetter(p) for w, p in fetch_fonts(args.font_dir).items()}
    badge_uri = data_uri(args.badge)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    (args.out_dir / "shreela-contact-qr-card.svg").write_text(build_card(matrix, fonts, badge_uri))
    (args.out_dir / "shreela-contact-qr.svg").write_text(build_plain(matrix, badge_uri))
    print(f"url={args.url} version={qr.version} error={qr.error} modules={len(matrix)}")


if __name__ == "__main__":
    main()
