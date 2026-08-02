# Moonwell collision, Starfall, and Luna acceptance inventory

Date: 2026-08-02

## Required functional checks

- Desktop keyboard: approach one ordinary spruce and one root platform from
  left, right, above, and below; confirm visible contact stopping, no tunneling,
  and clear passability behind canopy/top overhang only.
- Touch landscape: repeat representative tree/platform edge contact with the
  on-screen direction control and traverse an open route around each object.
- All four areas: inspect every developer scene and confirm required puzzle and
  exit routes remain visually discoverable and geometrically reachable.
- Starfall Grove: confirm grounded starroot chimes replace every skybell path,
  use loam/teal/amber art, remain non-solid, and preserve the three-touch gate.
- Luna: compare at normal play scale against ordinary spruce, root platform,
  crescent tree, and Eir; confirm 14 × 18 visual, precise feet, readable lantern,
  and unchanged 10 × 10 movement box.
- Pause/resume, Eir dialogue, portrait loading, progression, and canonical
  `#moonwell` entry remain intact.

## Viewport and visual checks

- Desktop 1440 × 900, portrait 390 × 844, and touch landscape 844 × 390.
- Required regions fit, no horizontal overflow, no essential play occlusion,
  and clean console/network asset loading at every reviewed viewport.
- Capture all four 640 × 416 scenes, a four-level contact sheet, a matched Luna
  scale comparison, and representative collision/starroot proof.

## Exploratory checks

- Hold a diagonal direction into a tree/platform corner for at least ten input
  events and confirm no corner tunneling or sticky false block after release.
- Walk through the decorative canopy/platform overhang lane, then reverse into
  the rooted contact face to distinguish intentional passability from solidity.

## Recorded acceptance result

- Desktop 1440 × 900 keyboard contact: the representative Lantern Glade tree
  collider is 20 × 12 at its trunk/root base. Luna stopped below it at
  y=134.901, to its right at x=71.395, and above it at y=109.406; repeated
  presses did not tunnel. The deterministic four-direction sweep covers the
  mirrored left contact and confirms the decorative canopy lane stays open.
- Moonroot's representative root shelf collider is 40 × 14. Normal right-arrow
  input stopped Luna at x=70.546 on its left face; the 4-pixel side and 8-pixel
  top visual overhangs do not create false collision. All required routes were
  traversed by the deterministic route suite using the same runtime rectangles.
- Touch landscape 844 × 390 × 3: normal direction-control input moved Luna,
  repeated upward presses stopped at the same representative tree base, an
  extra press left the position unchanged, and pause → Continue preserved the
  run. The full 600 × 390 playing canvas, pause control, and dialogue fit with
  document width 844/844.
- Portrait 390 × 844 × 3 and touch landscape dialogue QA decoded the production
  Eir portrait at 512 × 512. Dialogue bounds were 41–349 × 156–285 portrait
  and 140–704 × 162–378 landscape, entirely inside each viewport.
- The four 640 × 416 runtime scenes are retained in editable Figma node
  `20:2`. Node `17:2` records the tree/platform collider-overhang contract,
  Luna's 14 × 18 scale against the rooted landmarks, and the grounded starroot
  production strip.
- Final local desktop, portrait, and touch-landscape consoles were empty.
  Cache-isolated network inspection requested the new starroot strip with 200
  status and made no request for the retired sky-bell asset.
