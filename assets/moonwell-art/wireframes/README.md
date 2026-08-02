# Moonwell tile-layout wireframe pass

This review pack records the first layout-first art pass before any new world
sprites are integrated. It is deliberately a design and collision contract,
not a replacement for the playable scenes.

- [Level layout wireframes](layout-plan.svg) map the current 20 × 13 board and
  each area's interactables to 16-pixel cells, including Moonroot's full
  two-cell-deep bridge crossing.
- [Footprint and collision plan](footprint-and-collision-plan.svg) compares the
  current oversize art with the proposed placement rules and embeds the current
  representative keeper, tree, and sentinel sprites for scale review.
- [Compact keeper, lantern, and firefly scale pass](keeper-lantern-fairy-scale-pass-v1.svg)
  records the final 1 × 1 visual targets: 16 × 16 runtime cells, player feet
  and lantern base aligned to their existing interaction points, and no new
  collision area.
- [Exit and Moonroot repair](exit-and-moonroot-repair-v1.svg) records the
  one-cell light opening and the eight-cell, two-row bridge contract used by
  the current blocking repair.

## Finding

The source map marks every `#` as one blocked 16 × 16 cell, but the current
tree sprite is 48 × 48 and is drawn for every such cell. The visual therefore
overlaps neighbouring cells while its collider does not. The 48 × 48 sentinel
has the inverse mismatch: its art spans three cells, but its current collision
box is an arbitrary 40 × 39 rectangle. These are the layout/collider problems
this pass addresses.

## Proposed placement contract

| Kind | Layout footprint | Collision footprint | Render rule |
| --- | --- | --- | --- |
| Keeper, firefly, memory, flower, rune | 1 × 1 cell | 1 × 1 cell or a centred 10 × 10 keeper body | Visual may rise above its own cell, never spill sideways. |
| Ordinary tree, small prop | 1 × 1 cell | 1 × 1 cell when solid | One authored 16 × 16 cell; no cluster rendered once per map cell. |
| Tree grove, sentinel, lantern, skybell, altar | deliberate 2 × 2 exception | matching 2 × 2 tile mask | One marker owns the complete footprint, with one grid-aligned baseline. |
| Root platform | deliberate 2 × 1 exception | matching 2 × 1 mask | Decorative surface and solid area use the same cells. |
| Bridge | repeated 1 × 1 cells | only its visible span is passable | Moonroot's four-cell-wide bridge covers both water rows; every visible bridge cell is passable. |
| Water | 1 × 1 cell | solid except bridge cells | The tile repeats on both axes without changing the grid. |

The keeper remains logically one tile. Its existing 24 × 30 render must be
re-cropped or redrawn to a 16-pixel-wide cell before the next art integration;
the wireframe shows its intended 1 × 1 gameplay cell rather than treating the
current overhang as a collider.

## Implemented runtime migration

The first migration is now live in the game source. `createWorldObjects()` is
the shared grid record factory for rendering and collision: map-edge foliage
and ordinary interior trees are 16 × 16 single-cell records, root platforms
are 32 × 16 records, Moonroot water and its revealed bridge are individual
16 × 16 records, and the Hollow sentinel is one 32 × 32 record. `wall()`
consults those exact records, so an art placement cannot silently retain an
unrelated hit box. Current legacy source art is scaled into the declared
footprint while dedicated replacement sprites are prepared; it no longer
spills sideways into unblocked cells.

## Remaining art sequence

1. Completed: the dedicated `tree-tile-v3` (16 × 16), restrained `root-platform-tile-v4`
   (32 × 16), and `sentinel-tile-v4` (32 × 32) sprites now render directly
   into their declared world-object records. The sentinel no longer rises one
   extra cell above its matching 2 × 2 collision footprint.
2. Align remaining decorative interactive sprites to this same object-record
   contract before changing their collision behavior.
3. Keep deterministic assertions for one-cell trees, the 2 × 1 platform, the
   2 × 2 sentinel, and bridge-cell passability as new landmarks are added.

The footprint decision is now encoded in the runtime; future art work must
preserve it rather than restoring oversized render-only placement. Area
transitions use one ordinary 1 × 1 exit tree at the current home cell. It is
solid while closed, opening, and revealed; only its fully parted glimmer state
removes that same one-cell collider. No lantern sprite or secondary exit cell
remains at an exit.
# Forest-density approval artifacts (v1)

- `forest-density-layout-v1.svg` is the exact 20 × 13 cell implementation
  proposal for all four areas. Its SVG metadata lists every existing and
  proposed tree, every exit cell, and the deliberately clear routes.
- `exit-tree-state-contract-v1.svg` fixes the state sequence: an exit is an
  ordinary, solid one-cell tree while closed; its glimmer is visible while it
  still blocks movement; collision is removed only for the visibly open tree.
- `../concepts/forest-exit-density-concept-v1.png` is the image-generation
  concept reference. It is deliberately preview-only—not a production atlas.

The approved layout now drives the production records in `game-core.js`.
The runtime keeps ten additional one-cell trees per area and the single-cell
exit state contract, with tiny collision-safe placement offsets where the
diagram would otherwise cover an existing firefly or memory.

# Canonical 20 × 13 extension (v2)

- `moonwell-20x13-contract-v2.svg` and its PNG render establish 320 × 208 as
  the complete native world, show both 64-pixel dialogue safe bands, map
  layout cells to visual/collider footprints, and record the new value and
  landmark hierarchy.
- `forest-density-layout-v1.svg` remains the approved four-level route and
  collider-cell authority; v2 extends rather than replaces that evidence.
- Editable Figma system: https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl

All actor, collectible, exit, and ordinary-interactive anchors now sit on tile
centres. Ordinary trees and props remain 1 × 1; root platforms remain the
declared 2 × 1 exception and the Hollow sentinel remains 2 × 2.
