# Aling Nena's Kainan - Website

Static website (no build step): `index.html`, `menu.html`, `about.html`, `order.html`, plus `site.js`.
Works on GitHub Pages as-is. It needs an internet connection because Tailwind, fonts, icons and
the current photos load from the web.

## 1. Before you publish (client details)

### a) Edit `site.js` (top of the file)
| Setting | What to put |
|---|---|
| `messengerUsername` | The part after `facebook.com/` in the diner's Page link |
| `facebookUrl` | Full Facebook Page link |
| `viberUrl` | Viber community invite link (or leave empty) |
| `mapsUrl` | Google Maps "Share" link of the real location |

Until `messengerUsername` is set, the order form still builds and copies the order, but cannot open Messenger.

### b) Find & replace text (VS Code: Ctrl+Shift+H, search in all files)
The design uses sample details from Quezon City. Replace:

| Search for | Replace with |
|---|---|
| `128 Kalayaan Ave` / `Kalayaan Avenue` / `Kalayaan Ave.` | the real street / barangay |
| `Quezon City` and `Metro Manila` | `Aguilar, Pangasinan` |
| `(0917) 823-4567` | real number, display format |
| `09178234567` (appears in `tel:` links) | real number, digits only |
| `0917-823-4567` (GCash number) | the real GCash number |
| `Brgy. Central, Diliman, Teachers Village, UP Campus, Kamias, Scout Area` (delivery areas on order.html) | real barangays served |

### c) Replace sample content
- **Photos:** all food and Aling Nena images are placeholder AI images loaded from temporary links.
  Download real photos of the dishes into an `images/` folder and update each `<img src>`.
- **Maps:** the map pictures (about, index, order) are Metro Manila screenshots set with `background-image`.
  Swap them for a Google Maps embed or a screenshot of the real location.
- **Claims:** ratings (4.9/5), "50k+ Masayang Suki", testimonials, "Verified GCash Merchant",
  "14+ years" and the story on about.html are sample text. Only keep what the owner confirms.
- **Menu and prices:** menu.html is the source of truth; keep order.html and index.html in sync.
  The order page also has its own short list (Ginisang Monggo, Extra Rice, P99 meal).
- **Free delivery:** index.html says "free delivery min P500" but the order form always adds the
  delivery fee. Confirm the rule with the owner.

## 2. Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `alingnenas-kainan`).
2. Upload everything in this folder to the root of the repo (including `.nojekyll` and `404.html`).
   - Git: `git init && git add . && git commit -m "First version" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`
3. On GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `main` / `/ (root)` -> Save.**
4. After about a minute the site is live at `https://<username>.github.io/<repo>/`.

## 3. How it works
- **Navigation:** all pages link to each other with relative links, so it works in a subfolder URL.
- **Tray:** items added on the menu are saved in the browser (`localStorage`) and pre-selected on the order page.
- **Order:** "I-send ang Order" shows the order summary. The customer taps "I-copy at Buksan ang Messenger",
  the text is copied, and Messenger opens to paste it. (Messenger does not reliably accept pre-filled text from links.)

## 4. Quick test checklist
- [ ] Click every nav link on all 4 pages
- [ ] Menu: add 2 dishes, reload (tray stays), tap Checkout, dishes are ticked on the order page
- [ ] Order: fill name and contact, submit, copy works, Messenger opens the right page
- [ ] Check on a phone (Chrome DevTools -> device toolbar)
- [ ] Facebook, Viber, Maps and phone links go to the real places

## 5. Later improvements
- Replace the Tailwind CDN script with a compiled CSS file (faster, no console warning).
- Add real photos and compress them (WebP, under 200 KB each).
- Add your own domain in Settings -> Pages (about P700-P1,000 per year).
