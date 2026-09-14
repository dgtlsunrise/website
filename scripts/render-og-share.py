#!/usr/bin/env python3
"""Render og-share.png (1200x630) to match the article site chrome."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H = 1200, 630
BG = (250, 250, 248)
TEXT = (20, 20, 20)
MUTED = (90, 90, 86)
STOPS = [
    (0.0, (253, 194, 4)),
    (0.25, (240, 144, 32)),
    (0.5, (37, 216, 116)),
    (0.75, (28, 151, 247)),
    (1.0, (194, 24, 106)),
]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def grad(t):
    for i in range(len(STOPS) - 1):
        t0, c0 = STOPS[i]
        t1, c1 = STOPS[i + 1]
        if t0 <= t <= t1:
            u = 0 if t1 == t0 else (t - t0) / (t1 - t0)
            return lerp(c0, c1, u)
    return STOPS[-1][1]

def main():
    # Prefer Inter from a local cache; fall back to DejaVu.
    candidates = [
        Path("/tmp/og-fonts/extras/ttf"),
        Path.home() / ".local/share/fonts",
        Path("/usr/share/fonts/truetype/dejavu"),
    ]
    def font(name, size, fallback="DejaVuSans.ttf"):
        for base in candidates:
            p = base / name
            if p.exists():
                return ImageFont.truetype(str(p), size)
        for base in candidates:
            p = base / fallback
            if p.exists():
                return ImageFont.truetype(str(p), size)
        return ImageFont.load_default()

    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    for x in range(W):
        draw.line([(x, 0), (x, 1)], fill=grad(x / (W - 1)))

    med = font("Inter-Medium.ttf", 22)
    sb = font("Inter-SemiBold.ttf", 28)
    title = font("Inter-Bold.ttf", 52)
    sub = font("Inter-Regular.ttf", 30)
    foot = font("Inter-Medium.ttf", 22)

    logo = Image.open(ROOT / "logo.webp").convert("RGBA")
    lh = 64
    lw = int(logo.width * (lh / logo.height))
    logo = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    pad_x, pad_y = 80, 72
    img.paste(logo, (pad_x, pad_y), logo)
    bx, by = pad_x + lw + 20, pad_y + 6
    draw.text((bx, by), "DGTL Sunrise", font=sb, fill=TEXT)
    draw.text((bx, by + 34), "AI Marketing Engineering", font=med, fill=MUTED)

    ty = pad_y + lh + 56
    draw.text((pad_x, ty), "DGTL Connector by DGTL Sunrise", font=title, fill=TEXT)
    subtitle = "Connect your agent to Google, Meta, Shopify, Klaviyo, TikTok, and more."
    words, lines, cur = subtitle.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=sub) <= W - pad_x * 2:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    sy = ty + 78
    for i, line in enumerate(lines):
        draw.text((pad_x, sy + i * 40), line, font=sub, fill=MUTED)
    draw.text((pad_x, H - 72), "dgtlsunrise.com", font=foot, fill=MUTED)
    out = ROOT / "og-share.png"
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out} ({out.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
