#!/usr/bin/env bash
set -euo pipefail

# Converts the owner-selected forest direction into tile-exact runtime assets.
# The retained source is provenance only; the game loads the compact alpha
# strips below. All ordinary sprites stay inside one 16 × 16 cell, while the
# root ledges keep their declared 32 × 16 platform footprint.

root="$(cd "$(dirname "$0")/.." && pwd)"
source="$root/assets/generated/moonwell-selected-forest-production-source-v1.png"
output="$root/assets/moonwell-art/production"
work="$(mktemp -d "$root/.moonwell-selected-art.XXXXXX")"
trap 'rm -rf "$work"' EXIT

mkdir -p "$output"

# The generated field is intentionally flat magenta. A hard alpha edge is
# appropriate for native pixel art and prevents semi-transparent key fringe.
magick "$source" -alpha off -fuzz 25% -transparent '#f704db' \
  -channel alpha -threshold 34% +channel "$work/source-alpha.png"

sprite() {
  local crop="$1"
  local size="$2"
  local name="$3"
  magick "$work/source-alpha.png" -crop "$crop" +repage -trim +repage \
    -filter point -resize "${size}!" -colors 28 PNG32:"$work/$name.png"
}

fit_sprite() {
  local crop="$1"
  local size="$2"
  local name="$3"
  magick "$work/source-alpha.png" -crop "$crop" +repage -trim +repage \
    -filter point -resize "$size" -gravity south -background none \
    -extent "$size" -colors 28 PNG32:"$work/$name.png"
}

# Four compact Keeper gait frames.
sprite '140x160+120+45' 16x16 keeper-0
sprite '140x160+270+45' 16x16 keeper-1
sprite '140x160+430+45' 16x16 keeper-2
sprite '140x160+580+45' 16x16 keeper-3
magick "$work"/keeper-{0,1,2,3}.png +append \
  PNG32:"$output/moonwell-keeper-walk-v5.png"

# Three spruce silhouettes and the selected crescent-exit state sequence.
sprite '150x220+785+20' 16x16 spruce-0
sprite '150x220+980+30' 16x16 spruce-1
sprite '150x220+1150+40' 16x16 spruce-2
magick "$work"/spruce-{0,1,2}.png +append \
  PNG32:"$output/moonwell-spruce-family-v2.png"

sprite '230x270+135+215' 16x16 exit-0
sprite '230x270+395+215' 16x16 exit-1
sprite '230x270+670+215' 16x16 exit-2
sprite '230x270+940+215' 16x16 exit-3
magick "$work"/exit-{0,1,2,3}.png +append \
  PNG32:"$output/moonwell-crescent-exit-states-v2.png"

# Collision-safe root-platform pair.
sprite '300x150+110+840' 32x16 platform-0
sprite '300x150+435+840' 32x16 platform-1
magick "$work"/platform-{0,1}.png +append \
  PNG32:"$output/moonwell-root-platform-variants-v5.png"

# Non-solid forest-floor vocabulary. Every strip uses equal 16 × 16 cells.
fit_sprite '180x120+125+480' 16x16 foliage-0
fit_sprite '180x120+375+480' 16x16 foliage-1
fit_sprite '180x120+620+480' 16x16 foliage-2
magick "$work"/foliage-{0,1,2}.png +append \
  PNG32:"$output/moonwell-foliage-variants-v1.png"

sprite '230x110+115+615' 16x16 ground-0
sprite '230x110+360+615' 16x16 ground-1
sprite '230x110+595+615' 16x16 ground-2
magick "$work"/ground-{0,1,2}.png +append \
  PNG32:"$output/moonwell-ground-texture-variants-v1.png"

fit_sprite '160x100+120+720' 16x16 stone-0
fit_sprite '170x100+280+720' 16x16 stone-1
fit_sprite '180x100+450+720' 16x16 stone-2
magick "$work"/stone-{0,1,2}.png +append \
  PNG32:"$output/moonwell-stone-variants-v1.png"

fit_sprite '160x110+740+710' 16x16 mushroom-0
fit_sprite '190x120+900+700' 16x16 mushroom-1
magick "$work"/mushroom-{0,1}.png +append \
  PNG32:"$output/moonwell-mushroom-variants-v1.png"

fit_sprite '90x90+1095+745' 16x16 firefly-0
fit_sprite '90x90+1180+745' 16x16 firefly-1
fit_sprite '90x90+1260+745' 16x16 firefly-2
fit_sprite '90x90+1340+745' 16x16 firefly-3
magick "$work"/firefly-{0,1,2,3}.png +append \
  PNG32:"$output/moonwell-firefly-loop-v4.png"

sprite '180x130+790+855' 16x16 light-0
sprite '180x130+1005+855' 16x16 light-1
sprite '180x130+1215+855' 16x16 light-2
magick "$work"/light-{0,1,2}.png +append \
  PNG32:"$output/moonwell-light-pool-variants-v1.png"

# Representative comparison: source-direction crop above, native production
# strips enlarged with nearest-neighbour below for owner-visible inspection.
magick "$source" -crop '1310x965+105+25' +repage -resize 655x483 \
  "$work/reference.png"
magick \
  "$output/moonwell-keeper-walk-v5.png" \
  "$output/moonwell-spruce-family-v2.png" \
  "$output/moonwell-crescent-exit-states-v2.png" \
  "$output/moonwell-root-platform-variants-v5.png" \
  "$output/moonwell-foliage-variants-v1.png" \
  "$output/moonwell-ground-texture-variants-v1.png" \
  "$output/moonwell-stone-variants-v1.png" \
  "$output/moonwell-mushroom-variants-v1.png" \
  "$output/moonwell-firefly-loop-v4.png" \
  "$output/moonwell-light-pool-variants-v1.png" \
  -background '#08111f' -gravity west -splice 6x0 -append \
  -filter point -resize 400% "$work/production.png"
magick "$work/reference.png" -gravity center -background '#08111f' \
  -extent 700x520 "$work/reference-card.png"
magick "$work/production.png" -gravity center -background '#08111f' \
  -extent 700x520 "$work/production-card.png"
magick "$work/reference-card.png" "$work/production-card.png" +append \
  PNG32:"$root/assets/generated/moonwell-selected-reference-sprite-comparison-v1.png"
