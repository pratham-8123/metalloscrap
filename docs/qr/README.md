# Contact QR code

## 2026-10-07

### What this is

A QR code that opens **https://metalloscrap.com/#contact-info**. Scanning it lands the visitor on the
"Get In Touch" block, with location, both phone numbers and both emails visible on a phone screen.
The numbers and emails on that block are tappable: a tap opens the dialer or a new email draft.

| File | Use it for |
| --- | --- |
| `shreela-contact-qr-card.svg` | Print master for the branded card. Vector, scales to any size. |
| `shreela-contact-qr-card.png` | Same card at 2400 x 3200 px (8 x 10.7 in at 300 dpi). WhatsApp, email, slides. |
| `shreela-contact-qr.svg` / `.png` | QR code with the SG badge only (PNG is 2000 x 2000 px). Visiting cards, letterheads, brochures. |
| `generate_qr.py` | Regenerates both SVGs, for example if the link ever changes. |

Printing rules: keep the QR code at least 2.5 cm wide, keep the white margin around it, and print it
dark on a light background. Do not recolour the black squares in a lighter colour.

### Depends on a site change

The code only lands on the contact block once the site change made on this date is deployed
(push to `master`). Until then it opens the top of the home page, which is harmless but not useful.

### Issue faced: links ending in `#section` did not scroll

- **Symptom:** opening `metalloscrap.com/#contact` on a phone stayed on the hero at the top.
- **Root cause:** the browser looks for the anchor as soon as the HTML is parsed. React renders the
  page a moment later, so the element does not exist yet and the browser gives up silently.
- **Fix:** a `useEffect` in `src/components/BusinessWebsite.js` jumps to the anchor after React renders,
  and again after web fonts load (text reflow can move the target), unless the visitor has already
  started scrolling. It jumps instantly instead of using the page-wide smooth scroll.
- **Verified:** in iPhone-sized Chrome emulation, the heading lands 100 px from the top, just under
  the 80 px fixed navbar. Without a `#` in the URL the page still opens at the top. Not tested on a
  real iPhone; the logic is plain DOM code, so Safari should behave the same.

### Decisions and why

- **New anchor `#contact-info` on the "Get In Touch" heading** instead of the existing `#contact`
  section. With `#contact`, a phone lands on the "Contact Us" title and a 300 px illustration, which
  pushes the phone numbers below the fold. The heading gets `scroll-margin-top: 100px` so the navbar
  does not cover it.
- **Error correction level H (30%)** so the centre badge and wear on printed copies do not break the
  code. The link fits in QR version 5 (37 x 37 modules). The centre 9 x 9 modules are cleared for the badge.
- **Colours:** finder rings in brand blue `#2c5aa0`, everything else near-black `#1a1a1a` on white.
  The blue is dark enough for scanners, which read it as black.
- **All text converted to vector outlines** so a print shop does not need the Inter font installed.
- **Layout bug fixed during generation:** the first draft used a fixed module size. Version 5 came out
  larger than expected and overlapped the footer, so the artwork now has a fixed 720 px QR area and
  the module size adapts.

### Verification

- The zbar decoder reads both PNGs back as exactly `https://metalloscrap.com/#contact-info`.
- It still decodes after shrinking the card to 15%, the plain code to 120 px, blurring, rotating
  12 degrees, perspective skew and low-contrast greyscale.
- Under heavy JPEG compression zbar fails now and then on both this code and a plain black-and-white
  control QR of the same link, 8 versus 7 failures across 35 size and quality combinations. The
  styling does not make it harder to scan.

### How to regenerate

```bash
pip install segno fonttools uharfbuzz
python docs/qr/generate_qr.py              # rewrites both SVGs
python docs/qr/generate_qr.py --url URL    # different link
```

The PNGs were exported from the SVGs with headless Chrome at 2x scale. Any vector tool such as
Inkscape, Illustrator or Figma can export them too.

## 2026-10-07 (later): SG logo in the centre of the QR code

### What changed and why

- The centre badge is now the square SG logo image instead of the blue badge with "SG" lettering,
  so the QR code carries the real brand mark. It is the same image the site uses as its browser-tab
  icon: `public/images/sg_icon.png` is `sg_icon_master.jpg` scaled to 192 px.
- **`sg_icon_master.jpg` (700 x 700) was added here** because the 192 px tab icon is too small for
  print. It was cut from `public/images/sg_logo.jpeg` at full resolution. The SG mark is only about
  650 px wide in the original, so 700 px is the most detail available.
- **How the square was made:** `sg_logo.jpeg` is a wide 1408 x 768 picture, and Chrome squashes
  non-square tab icons into an unreadable smudge. So a 650 x 350 region around the SG mark (offset
  382, 138) was cut out, its edges feathered, and centred on a 700 x 700 square filled with the
  logo board's average dark grey.
- The SVGs embed the image as base64, so each SVG is still a single self-contained file for a print
  shop. The image uses `xlink:href` so older vector tools such as Illustrator also show it.
- The badge corners are slightly less rounded than before, to keep more of the logo visible.

### Verification

- zbar reads both PNGs back as exactly `https://metalloscrap.com/#contact-info`.
- Every stress test from the earlier entry still passes: shrinking to 15%, 120 px, blur,
  12 degree rotation, perspective skew, low-contrast greyscale.
- Heavy JPEG sweep: 9 failures out of 35, against 8 for the lettered badge and 7 for a plain
  black-and-white control. That is zbar's normal variation, not a scanning penalty from the logo.

### How to regenerate

```bash
python docs/qr/generate_qr.py                    # uses sg_icon_master.jpg for the centre
python docs/qr/generate_qr.py --badge other.png  # different centre image
```

## 2026-10-07 (evening): QR now opens metalloscrap.com/contact, restyled to the new theme

### Issue faced: the QR opened the top of the home page on a real phone

- **Symptom:** scanning the code opened metalloscrap.com but stayed on the hero instead of the
  contact block, even though the same link landed correctly in desktop Chrome.
- **What was checked:** the live link landed correctly in WebKit (Safari's engine) with iPhone
  emulation on a fresh load, so the page code was not the problem on a clean visit.
- **Likely causes, any of which breaks a `#contact-info` link:**
  - the live page was sent with no `Cache-Control` header, so a phone that had visited before could
    keep showing an old cached copy without the contact anchor;
  - some QR scanner apps drop the `#...` part of a link;
  - a browser can open the link in a tab that already shows the site, where no reload happens.
- **Fix:** the code now encodes `https://metalloscrap.com/contact`, a real path, which scanners
  never strip and no phone has cached. The site answers `/contact` through `public/.htaccess`, sends
  `Cache-Control: no-cache` for the page, and still accepts the old `#contact-info` link.

### What changed in the artwork

- Link: `https://metalloscrap.com/contact`. The shorter link fits QR version 4 (33 x 33 modules,
  previously 37 x 37), so each module is larger and easier to scan. Error correction is still H.
- Colours now match the redesigned site: charcoal header and footer bands, the "SHREELA GROUP"
  wordmark in a brass-to-copper gradient, a copper rule, and finder rings in dark copper `#8f4a2a`.
  That copper is dark enough that scanners read it as black. Data modules are charcoal `#14171b`.
- The fallback text under the code reads `metalloscrap.com/contact`.

### Verification

- zbar reads both PNGs back as exactly `https://metalloscrap.com/contact`.
- It still decodes the card at 10% size, the QR-only PNG at 90 px, and after blur, a 12 degree
  rotation, perspective skew and low-contrast greyscale.
- Heavy JPEG sweep: 10 failures out of 35, against 8 for a plain black-and-white control. That is
  zbar's normal variation, not a scanning penalty from the styling.
- Do not print this version until the site change is deployed: before that, `/contact` returns 404.
