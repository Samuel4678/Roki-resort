# ROKI Resort website
Static site for GitHub Pages (no build step).

## Publish
1. Upload the **contents** of this folder to the repo root, so `index.html` sits at the top level (not inside a subfolder). Keep `.nojekyll`.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.
3. Open `https://<username>.github.io/<repo>/`. If you still see an old version, hard refresh (Ctrl+Shift+R).

## Contact details
Edit `config.js`: `phone`, `whatsapp` (e.g. `2547XXXXXXXX`), `email`. They appear automatically.

## Photos
Photos are embedded in `styles.css` as a safety net, so they show even if the `images/` folder is missing.
To change one, replace the file in `images/` (same name, lowercase). The `images/` file shows on top when present.

## If a picture is blank
- Make sure `index.html`, `styles.css`, `app.js`, `config.js` and `images/` are all in the repo root.
- Filenames are case-sensitive on GitHub (`hero.webp`, not `Hero.WEBP`).
- Open DevTools (F12) → Network and look for red 404 entries.

## Theme
Dark mode is the default. Visitors switch with the sun/moon button in the header; the choice is remembered. Colours are the variables at the top of `styles.css` (`:root` = dark, `[data-theme="light"]` = light).
