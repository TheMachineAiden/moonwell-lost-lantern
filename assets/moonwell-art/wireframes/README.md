# Moonwell tile-layout wireframe pass

This review pack records the first layout-first art pass before any new world
sprites are integrated. It is deliberately a design and collision contract,
not a replacement for the playable scenes.

- [Level layout wireframes](layout-plan.svg) map the current 20 × 13 board and
  each area's interactables to 16-pixel cells.
- [Footprint and collision plan](footprint-and-collision-plan.svg) compares the
  current oversize art with the proposed placement rules and embeds the current
  representative keeper, tree, and sentinel sprites for scale review.

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
| Bridge | repeated 1 × 1 cells | only its visible span is passable | A bridge uses a row of normal cells rather than one 4-cell image with a separate gap rule. |
| Water | 1 × 1 cell | solid except bridge cells | The tile repeats on both axes without changing the grid. |

The keeper remains logically one tile. Its existing 24 × 30 render must be
re-cropped or redrawn to a 16-pixel-wide cell before the next art integration;
the wireframe shows its intended 1 × 1 gameplay cell rather than treating the
current overhang as a collider.

## Implementation sequence after review

1. Replace interior `#` clusters with explicit grid-anchored object records
   containing `x`, `y`, `w`, `h`, `solid`, and a named sprite.
2. Keep the boundary map as ordinary single-cell blockers; render edge foliage
   as a non-colliding backdrop so it cannot create a misleading walkable shape.
3. Redraw or crop representative assets to the footprint table, then make
   `wall()` consult the exact same object records used by `draw()`.
4. Add deterministic assertions that a 1 × 1 object blocks one cell and every
   deliberate 2 × 2 exception blocks exactly its four marked cells.

No gameplay source changes occur in this wireframe-only commit. Approval of
the footprint choices is the gate for the next sprite/collider implementation.
