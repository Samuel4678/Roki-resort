# ROKI Resort website

Static site (no build step) for GitHub Pages.

## Publish
1. Create a GitHub repo, upload everything in this folder (keep `.nojekyll`).
2. Repo **Settings → Pages → Deploy from branch → main / (root)**.
3. Live at `https://<username>.github.io/<repo>/` in about a minute.

## Edit
- **`config.js`**: rooms, prices, phone, WhatsApp number, email, dining, events, FAQs and map.
  The website *and* the Roki concierge chat both read from it, so answers stay in sync.
- **`images/`**: add your photos with these names and they replace the placeholders automatically:
  `hero.jpg about1.jpg about2.jpg dining.jpg room1.jpg room2.jpg room3.jpg gallery1.jpg … gallery8.jpg`
- Colours are the CSS variables at the top of `styles.css`.
