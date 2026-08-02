# Moonwell corrected bottom-right clearing audit

Date: 2026-08-02  
Authoritative reference: framed bottom-right clearing in
`assets/generated/moonwell-320x208-art-direction-source-v1.png`  
Comparison baseline: public merged revision
`126cbdb6c0b73dab4fcb0e414ee88167e5242ee9`

## Matched visual judgment

`moonwell-bottom-right-reference-live-matched-v3.png` presents three 640 × 416
panels at identical play scale, in this order: exact corrected reference,
previous public live baseline, corrected renderer output.

| Dimension | Previous live gap | Corrected result |
| --- | --- | --- |
| Scale | Many similarly sized interior spruces competed with the player and exit. | One 48 × 64 crescent landmark dominates; perimeter/interior spruces separate to 40 × 56 and 28 × 40. |
| Density | Wall-to-wall blockers erased the clearing. | Blockers move to side clusters; the calm loamy middle and fair route remain open. |
| Texture | Violet/noisy patches fragmented the floor. | Four overlapping 80 × 48 loam families form a continuous moss-and-earth field. |
| Layering | Repeated crowns read as tiles rather than enclosure. | Back canopy, y-sorted rooted objects, foreground overhangs, atmosphere, and vignette establish depth. |
| Lighting | Small scattered pools lacked a focal source. | A 112 × 66 cool central pool, secondary pools, and screen-composited atmosphere visibly illuminate play. |
| Palette | Violet and teal competed without a quiet ground. | Navy negative space, teal depth, brown/moss loam, pale moonlight, restrained violet, and sparse amber are hierarchical. |
| Composition | Several crescent/root symbols and a small shelf competed across the field. | Luna begins lower-left; a broad root shelf anchors upper centre; the singular crescent sits upper-right; the central pool links them. |
| Repetition | Large crescent-like spruce variants repeated as ordinary blockers. | Ordinary spruces use three non-crescent frames; the crescent art is exclusive to the exit landmark. |
| Silhouette | Similar tree masses flattened object hierarchy. | Crescent, root shelf, Luna, Eir, sentinel, altar, and edge canopy retain distinct readable silhouettes. |

## Visual / logical contract

| Runtime object | Logical footprint / collider | Visual footprint / overhang |
| --- | --- | --- |
| Luna | 10 × 10 px movement box | 20 × 24; anchor −10, −22 |
| Perimeter spruce | 1 × 1 cell, solid | 40 × 56; one-cell root, 40 top overhang |
| Interior spruce | 1 × 1 cell, solid | 28 × 40; one-cell root, 24 top overhang |
| Crescent exit | 1 × 1 cell, solid until fully open | 48 × 64; 16 each side, 48 top |
| Root platform | 2 × 1 cells, solid | 96 × 32; 32 each side, 16 top |
| Eir | one non-solid cell-centred anchor, talk radius 22 | 32 × 48; anchor −16, −44 |
| Loam patch | none | 80 × 48 overlap layer |
| Moonlight pool | none | dominant 112 × 66 screen layer |
| Canopy cluster | none | 128 × 56 background/foreground layer |

Deliberate logical exceptions are unchanged: the root platform uses a 2 × 1
solid mask and the Hollow sentinel uses 2 × 2. Eir is deliberately non-solid.
No decorative terrain, canopy, moonlight, or firefly glow collides. Ordinary
objects and the crescent retain a predictable one-cell rooted footprint.

## Evidence and QA

- Four-level visual proof:
  `moonwell-bottom-right-four-level-contact-sheet-v3.png`.
- Individual 640 × 416 captures:
  `moonwell-bottom-right-corrected-after-level-1.png` through `-4.png`.
- Dialogue and responsive proof:
  `moonwell-bottom-right-dialogue-desktop-v3.png`,
  `moonwell-bottom-right-dialogue-portrait-v3.png`, and
  `moonwell-bottom-right-dialogue-touch-landscape-v3.png`.
- Touch gameplay proof:
  `moonwell-bottom-right-touch-landscape-gameplay-v3.png`.
- Desktop normal input moved Luna, stopped at the left forest collider, paused
  with `P`, and resumed with `Escape`. Touch-landscape taps moved Luna and the
  visible pause/continue controls resumed play.
- Eir dialogue was exercised through wrong answer, retry, correct answer, clue,
  and leave on desktop, plus responsive portrait and touch-landscape layouts.
  The 512 × 512 raster portrait loaded; no SVG Eir request or fallback occurred.
- All four cache-isolated developer scenes rendered at 640 × 416 with zero
  horizontal overflow and clean consoles. Portrait rotation gate and dialogue
  stayed within 390 × 844; landscape controls and dialogue stayed within
  844 × 390 without obscuring essential play.

The renderer uses the production derivatives in
`assets/moonwell-art/production/`; it does not embed the reference or load the
retained generation atlas.
