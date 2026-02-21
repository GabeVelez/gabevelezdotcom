# Half-a-Buck Deployment Guide

## GitHub Pages Deployment at gabevelez.com/halfabuck/

### Current Setup
- Source code: `halfabuck/` folder (src/, public/, etc.)
- Build output: `halfabuck/dist/` (gitignored)
- Base path: `/halfabuck/` (configured in vite.config.js)

### Deployment Steps

#### 1. Build the game
```bash
cd halfabuck
npm run build
```

#### 2. Copy built files to root
For GitHub Pages to serve the game at `gabevelez.com/halfabuck/`, the built files need to be at the repository root under `/halfabuck/`.

**Option A: Manual deployment** (current)
```bash
# From halfabuck/ directory
cp -r dist/* ../halfabuck-deployed/
# Then commit halfabuck-deployed/ folder
```

**Option B: Replace source temporarily** (quick but messy)
```bash
# Backup source, replace with dist, commit, restore
# NOT RECOMMENDED for ongoing development
```

**Option C: Separate branch** (cleanest)
```bash
# Keep main branch with source
# Use gh-pages branch for built files only
git checkout -b gh-pages
# Copy dist contents to halfabuck/
# Commit and push
```

### Recommended: Separate Deployment Folder

Create `halfabuck-deployed/` in repo root:
1. Build: `cd halfabuck && npm run build`
2. Copy: `cp -r dist/* ../halfabuck-deployed/`
3. Commit: `git add halfabuck-deployed && git commit -m "Deploy Half-a-Buck"`
4. Push: `git push`

Then in GitHub Pages settings, keep serving from `main` branch, `/` root.

The game will be available at `gabevelez.com/halfabuck-deployed/`

OR rename the folder to just `halfabuck` for cleaner URL.

### File Structure After Deployment
```
gabevelezdotcom/
├── halfabuck/              ← Deployed (built files)
│   ├── index.html
│   ├── assets/
│   │   ├── maps/warehouse.json
│   │   ├── tiles/warehouse_tiles.png
│   │   ├── index-*.js
│   │   └── index-*.css
│   └── ...
└── halfabuck-src/          ← Source code (optional rename)
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

### Testing Before Deployment
```bash
cd halfabuck
npm run build
npm run preview  # Test production build locally
```

The preview will show if there are any path issues.

### Current Status
✅ .gitignore updated to allow halfabuck/**/*.json
✅ vite.config.js base path set to '/halfabuck/'
✅ Build tested and working
🔄 Ready for deployment - just copy dist/ contents to deployment location
