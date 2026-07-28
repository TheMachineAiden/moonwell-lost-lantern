# Moonwell visual release audit

This release was checked against the actual canvas at its 320 × 200 native resolution via the developer-only routes `?dev=scene&area=0` through `?dev=scene&area=3`.

- Four desktop captures cover Lantern Glade, Moonroot Crossing, Whispering Hollow, and Starfall Grove.
- Four mobile-landscape touch captures cover the same four views and confirm that the touch control remains present.
- Moonroot Crossing was visually checked at both sizes: the water has a continuous opaque base beneath each repeated tile, with no transparent cell-edge gaps; the bridge stays visibly separate.
- The complete progression assertion advances 0 → 1 → 2 → 3 → completion.
- Collision assertions confirm ordinary crossing water is blocked, the revealed bridge gap is passable, and the compact Hollow sentinel remains solid.
- Every audited route completed without browser console errors.

`node --check game.js` and `git diff --check` are required local release checks. The hidden query route is intentionally not linked from the player experience; its small `window.__moonwellAudit` API exists only for deterministic browser checks.
