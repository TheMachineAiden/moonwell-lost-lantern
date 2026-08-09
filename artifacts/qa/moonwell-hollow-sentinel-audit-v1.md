# Whispering Hollow sentinel audit

Date: 2026-08-09  
Target: Moonwell: The Lost Lantern  
Baseline revision: `2f0e0254581008331cf93c92582ffc2c4c957a3d`

## Finding

At actual 2× desktop scale, Whispering Hollow's untouched central sentinel
read as a small robot or treasure chest: two amber eye-like points and a
rectangular face were the map's strongest warm cue. That hierarchy competed
with the three cool echo runes and the real hidden firefly.

## Selected correction

Replace only that runtime sprite with one retained 32 × 32 root-bound stone
formation. Keep its exact world record, collider, draw order, routes, echo
mechanic, and all other maps. The sprite must be unlit and non-interactive,
with no face, chest, lantern, opening, rune, glyph, crescent, halo, or warm
point.

The retained generated source is
`assets/generated/moonwell-hollow-sentinel-source-v1.png`, pinned by SHA-256
`dc70ee658015592b769d2fdddbc4b8aa549ab9f88bcd634167d0302c642809ea`.
The deterministic processor is
`scripts/process-hollow-sentinel-art.sh`; its runtime output is
`assets/moonwell-art/production/moonwell-sentinel-stones-v2.png`, SHA-256
`e3568515fec56416587438c5fc2118784b671c285743a90693d59f28de7096fa`.

## Regression inventory

- Desktop 1440 × 900: all four maps, top forest continuity, exact canvas fit,
  and Hollow hierarchy.
- Hollow geometry: exact sentinel record (144,96,32,32), raster-only draw,
  three rune routes intact.
- Portrait 390 × 844 × 3: normal-entry rotation gate fully visible; no
  horizontal overflow.
- Touch landscape 844 × 390 × 3: 600 × 390 centred canvas; sentinel readable;
  touch movement; Pause/Continue cycle.
- Exploratory states: portrait developer-scene bypass versus normal entry;
  paused touch-landscape modal and resumed gameplay.
- Health: all observed requests 200/304; no console messages.

## Local acceptance

- `npm run check`
- `npm test`: 80/80
- managed no-violet regeneration: byte-identical
- `npm run build`
- source/dist byte identity
- `git diff HEAD --check`

