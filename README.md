# Dashboard MRV — Indonesia's FOLU Net Sink 2030

A demo dashboard (spatial + carbon views) built with Vite + React, using dummy
data structured around the Pedoman MRV Terpadu.

## Run locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Deploy to GitHub Pages

1. **Rename the repo (or edit the config)** — this project assumes your
   GitHub repo is named `mrv-dashboard`. Two ways to make that true:
   - Create the repo on GitHub as `mrv-dashboard`, **or**
   - Rename it to whatever you like, then open `vite.config.js` and change
     `base: "/mrv-dashboard/"` to `base: "/<your-repo-name>/"`.
   - If the repo is your special `<username>.github.io` repo, set
     `base: "/"` instead.

2. **Push this project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. **Turn on Pages via GitHub Actions:**
   - In your repo on GitHub, go to **Settings → Pages**.
   - Under "Build and deployment", set **Source** to **GitHub Actions**.
   - That's it — pushing to `main` now triggers `.github/workflows/deploy.yml`,
     which builds the site with Vite and publishes it to Pages automatically.

4. Your dashboard will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

## Project structure

```
index.html          – HTML entry point (required by every static site/browser)
src/main.jsx         – mounts the React app into index.html
src/App.jsx           – the dashboard itself (map, filters, charts)
vite.config.js         – build config, incl. the GitHub Pages base path
.github/workflows/deploy.yml – builds and deploys on every push to main
```

## Notes

- All site, IP, and carbon-figure data in `src/App.jsx` is dummy data for
  demonstration. Province boundaries are real, simplified from a GeoJSON.
- No backend or database — everything is static, so hosting is just files.
