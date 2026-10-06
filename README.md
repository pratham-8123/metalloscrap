# Shreela Group website (metalloscrap.com)

Single-page website for **Shreela Group** (formerly MetalloScrap), a metal scrap procurement company
supplying brass, copper, iron and aluminium scrap to rolling mills and manufacturers in India and Europe.

Live site: https://metalloscrap.com · Current version: `v2.1.0` (see `package.json` and git tags)

## What the site does

- One page with four sections, each with its own URL: `/` (home), `/about`, `/products`, `/contact`.
  The address bar follows the section you scroll to, and the back button works.
- Phone numbers and emails are tappable on phones (`tel:` and `mailto:` links).
- An inquiry form sends email through EmailJS to `info@metalloscrap.com`.
- A printable QR code in `docs/qr/` opens `https://metalloscrap.com/contact`.

## Tech

- React 18 with Create React App (`react-scripts` 5). No router library: section URLs are handled by
  `src/components/useSectionRouting.js` plus the server rewrite in `public/.htaccess`.
- Plain CSS with design tokens in `src/index.css`. Fonts: Sora (headings) and Inter (text).
- EmailJS (`@emailjs/browser`) for the contact form.
- Hosting: Hostinger (LiteSpeed), deployed by GitHub Actions over FTP.

## Project structure

```
public/
  index.html            page head: title, SEO meta, structured data, fonts
  .htaccess             section URLs -> index.html, caching rules
  robots.txt, sitemap.xml
  images/               sg_icon.png (tab icon), sg_logo.jpeg, sg_logo_plate.jpg/.webp (hero)
src/
  index.js, index.css   entry point, global design tokens and base styles
  App.js
  assets/hero_backdrop.jpg
  components/
    BusinessWebsite.js  the page: nav, hero, about, products, contact, footer
    BusinessWebsite.css all section styles
    useSectionRouting.js section URLs, scroll on load, scroll spy, back/forward
    ContactForm.js      inquiry form and EmailJS call
    Icons.js            inline SVG icons
docs/
  ROLLBACK.md           how to roll the live site back to an earlier version
  qr/                   QR code artwork and its generator
  EMAIL_DELIVERABILITY.md, emailjs-template-contact.html
.github/workflows/deploy.yml   build and deploy on every push to master
```

## Run locally

Requires Node.js 18 or newer.

```bash
npm ci
npm start              # dev server at http://localhost:3000
npm run build          # production build in build/
CI=true npm run build  # same check GitHub runs: any lint warning fails the build
```

The dev server does not apply `.htaccess`, so open `/contact` from the menu rather than typing it.

## Deploying

Push to `master`. GitHub Actions runs `npm ci` and `npm run build`, then uploads `build/` over FTP
to `domains/metalloscrap.com/public_html` on Hostinger. It takes about two minutes. Check the
**Actions** tab for a green tick, then open the site in a private window.

- Every push deploys, including README-only changes. Pushing a tag does not.
- The deploy empties the live folder first, so never upload files there by hand.
- The FTP login lives in the repository secrets `FTP_HOST`, `FTP_USERNAME` and `FTP_PASSWORD`.

## Rolling back

Every release is tagged (`v1.0.0`, `v2.0.0`, ...). To put an earlier version back live:

```bash
git pull origin master
git revert --no-edit v1.0.0..HEAD   # replace v1.0.0 with the version you want
git push origin master              # deploys the old version in about two minutes
```

Full runbook, including checks and tagging new releases: [docs/ROLLBACK.md](docs/ROLLBACK.md).

## Contact form (EmailJS)

- Service `service_gxrynx3`, template `template_q926awn`, public key in `src/components/ContactForm.js`.
- The visitor's address goes in Reply-To, never From, so mail is not flagged as spoofed.
- A green confirmation shows for 5 seconds after sending, then fades. Errors stay until the visitor
  edits the form.
- Template setup and spam-folder fixes: `docs/EMAIL_DELIVERABILITY.md`.

## SEO

- Title `Shreela Group`, meta description, Open Graph and X (Twitter) cards using the logo plate.
- Canonical URL `https://metalloscrap.com/`; section URLs are the same page, so they are not listed
  separately in `sitemap.xml`.
- Organization structured data (JSON-LD) in `index.html`: name, former name, logo, contact details.
- `robots.txt` allows all crawlers and points to the sitemap.

---

# Change history

Dated entries, oldest first. Older entries describe the state at the time and are kept as written.

## 2026-10-07

### How deployment works now

- Every push to `master` runs `.github/workflows/deploy.yml`: `npm ci`, `npm run build`, then an FTP
  upload of `build/` to Hostinger. A run takes about two minutes. No File Manager steps are needed.
- The upload target is `/domains/metalloscrap.com/public_html/`, relative to the FTP account's home.
  That is the folder Hostinger serves for metalloscrap.com.
- `dangerous-clean-slate: true` empties that folder before each upload, so anything added there by
  hand is deleted on the next deploy. The site is briefly empty for about 40 seconds during a deploy.
- Every push deploys, including README-only changes like this one. The workflow has no path filter,
  so such a push re-uploads an identical site.
- Pushing needs a GitHub account with write access. A fine-grained token needs "Contents: Read and
  write", plus "Workflows: Read and write" for commits that change `.github/workflows/`.

### Issue faced: deploys reported success but the live site never changed

- **Symptom:** the Actions run was green and the FTP step took about 40 seconds, but metalloscrap.com
  still served the 20 March 2026 build and newly added files returned 404.
- **Root cause:** the workflow uploaded to `/public_html/` at the top of the FTP home. On this hosting
  account that folder is not served by any site. metalloscrap.com is served from
  `domains/metalloscrap.com/public_html`. The March deploys did reach the live site, so the hosting
  layout changed some time after March 2026.
- **Interim fix:** commit `3615ff3` was deployed by hand through hPanel File Manager into
  `domains/metalloscrap.com/public_html`. The unused top-level `public_html` was emptied afterwards.
- **Fix:** `server-dir` changed to `/domains/metalloscrap.com/public_html/` in commit `0b4b57a`.
  Verified on the live site: the `Last-Modified` time of `index.html` fell inside the FTP step's
  window, source-map files that only the pipeline uploads appeared, and the old March bundle was
  removed by the clean-slate step.
- **Kept `dangerous-clean-slate`:** the live folder holds only build output, and wiping it each time
  stops old hashed bundles from piling up.

### How to check a deploy

1. On GitHub, open the **Actions** tab. The run for your commit should show a green tick.
2. Open https://metalloscrap.com in a private window and look for the change.
3. For changes that are not visible, compare the page's last-modified time with the run's FTP step:

   ```bash
   curl -sI https://metalloscrap.com/ | grep -i last-modified
   ```
4. In hPanel File Manager, open `domains/metalloscrap.com/public_html` and check the date on
   `index.html`. Go by that file, not the folder dates, which only change when something is added
   directly inside them. The `public_html` folder at the top of the home folder is unused and never
   changes. The empty `DO_NOT_UPLOAD_HERE` file in `domains/metalloscrap.com` is Hostinger's marker
   that site files belong one level down, in `public_html`.

## 2026-10-07 (evening): redesign, section URLs and cache rules

### Issue faced: the QR code landed at the top of the page on a real phone

- **Symptom:** scanning the QR (`https://metalloscrap.com/#contact-info`) opened the site but stayed
  on the hero instead of scrolling to the contact details.
- **Checked:** a fresh load of that link landed correctly in Chrome and in WebKit (Safari's engine)
  with iPhone emulation, so the scroll code worked on a clean visit.
- **Causes that fit:** the page was served without a `Cache-Control` header, so phones could keep an
  old cached copy without the anchor; some scanner apps drop the `#...` part of a link; and opening
  the link in a tab that already shows the site does not reload the page.
- **Fix:** each section now has a real URL (`/about`, `/products`, `/contact`), and the QR encodes
  `/contact`. `public/.htaccess` serves the page for those paths and sends `Cache-Control: no-cache`
  for HTML, so visitors always get the latest deploy. Old `#contact-info` links, including in an
  already-open tab, are redirected to `/contact`.

### How the section URLs work

- Still a single page. `src/components/useSectionRouting.js` reads the URL on load and jumps to the
  section, re-aligning after fonts load unless the visitor has started scrolling.
- Menu clicks push the section's URL; scrolling updates the URL with `replaceState`; back and
  forward scroll to the right section. Aliases: `/home`, `/vision`, `/contact-us`; unknown paths
  show the home section.
- `public/.htaccess` rewrites any path that is not a real file to `index.html`. Hashed build files
  are cached for a year, unversioned images for a day.

### Redesign: what was done and why

- **Theme from the SG logo:** charcoal background with copper, brass and steel accents, Sora for
  headings and Inter for text. The previous generic blue clashed with the copper and gold logo.
- **No more low-resolution photos.** The old images were 225 to 380 px wide and looked blurry when
  stretched. They were removed. Product cards now use metallic tiles drawn in CSS, styled like
  periodic-table squares (Cu·Zn, Cu, Fe, Al), which stay sharp on any screen.
- **Hero:** the logo board is shown as a framed plate (`sg_logo_plate.jpg` and `.webp`, 1044 x 610),
  cropped from `sg_logo.jpeg` inside the board so the Gemini watermark in the original's corner is
  excluded. The hero backdrop is a heavily blurred copy of the logo image, so it cannot look
  pixelated. Link previews now use the plate image too.
- **Added:** a mobile menu (phones previously had no navigation), a highlights strip, labelled form
  fields, a skip link, keyboard focus styles, and fade-in motion that is disabled for visitors who
  ask for reduced motion.
- **Kept unchanged:** all wording, contact details, and the EmailJS form logic and payload, now in
  `src/components/ContactForm.js`.

### Verification before deploy

- `CI=true npm run build` passes, so the GitHub Actions build will too, since it fails on any lint
  warning.
- 56 navigation checks passed in Chrome and WebKit, including `/contact` landing with both phone
  numbers and an email on screen.
- No horizontal overflow at widths from 320 to 1920 px.
- After deploy, confirm that `/contact` returns 200 and that the page sends `Cache-Control: no-cache`.
  If Hostinger ignored `.htaccess`, `/contact` would return 404.

### Versions and rollback

- `v1.0.0` is the site exactly as it was live before this redesign (commit `2ffbe8b`).
- `v2.0.0` is this redesign. `package.json` carries the same version number.
- Tags are listed at https://github.com/pratham-8123/metalloscrap/tags. Pushing a tag does not deploy;
  only pushes to `master` do.
- To roll the live site back to v1.0.0:

  ```bash
  git revert --no-edit v1.0.0..HEAD   # one new commit per change since v1.0.0, undoing it
  git push origin master              # the pipeline deploys the old site in about two minutes
  ```

  History is kept, so the redesign can be restored later by reverting those revert commits.
  After a rollback, `/contact` and the new QR code stop working, and the old `#contact-info`
  QR works again.

## 2026-10-07 (night): README rewrite, rollback runbook, form banner timer, SEO

### Correction: README overview rewritten

- **Why:** the overview above the dated entries still described the original template ("Core
  Metals"), listed files that no longer exist (`favicon.ico`, the old image set), gave line numbers
  that no longer matched, and told people to paste EmailJS keys that are already configured. It was
  factually wrong, so it was replaced with the current overview. The dated entries are unchanged.

### Rollback runbook

- Added `docs/ROLLBACK.md` and a "Rolling back" section above. The revert method was rehearsed before
  v2.0.0 went live: reverting `v1.0.0..HEAD` produced a tree identical to `v1.0.0`.

### Issue faced: the green "sent" banner never went away

- **Symptom:** after a successful inquiry the form cleared, but the confirmation stayed on screen.
- **Cause:** the success state was only reset on the next submit.
- **Fix:** the banner fades out after 5 seconds and is then removed. 5 seconds was chosen over 3 so a
  slower reader can finish the sentence. Error messages do not auto-hide, so a failed send is never
  missed; they clear when the visitor edits the form. Verified in Chrome with EmailJS intercepted:
  shown at 4 s, fading at 5.2 s, gone at 5.7 s.

### SEO

- **Found:** `/robots.txt` and `/sitemap.xml` did not exist, so the section-URL rewrite answered them
  with the HTML page. Real files were added.
- Added a canonical link, `og:site_name`, `og:locale`, `og:image:alt`, a fuller robots directive,
  Organization structured data with only facts already on the site, and a no-JavaScript fallback with
  the contact details.
- Kept the title as just "Shreela Group", as requested. A longer title such as "Shreela Group | Brass,
  Copper, Iron & Aluminium Scrap Supplier" would rank better for product searches.
- Text compression was already on (Brotli), so nothing was needed there.
