#!/usr/bin/env bash
set -euo pipefail

# Produces compact, tile-exact runtime sprites from the retained chroma-key
# sources. It is deliberately non-destructive: sources remain under
# assets/generated/ and the game only references the files in production/.

root="$(cd "$(dirname "$0")/.." && pwd)"
generated="$root/assets/generated"
output="${MOONWELL_ART_OUTPUT:-$root/assets/moonwell-art/production}"

mkdir -p "$output"

remove_key() {
  local input="$1"
  local output_file="$2"
  # Generated chroma fields are visually flat but contain small RGB drift.
  # The tolerance is limited to the neon green field, leaving the muted moss
  # palette intact while also clearing background holes inside arches and logs.
  magick "$input" -alpha off -fuzz 20% -transparent 'rgb(27,227,22)' "$output_file"
}

sprite() {
  local source="$1"
  local crop="$2"
  local size="$3"
  local output_file="$4"
  magick "$source" -crop "$crop" +repage -trim +repage -filter point -resize "${size}!" "$output_file"
}

world_source="$generated/moonwell-world-props-atlas-v2-source.png"
animated_source="$generated/moonwell-animated-props-atlas-v2-source.png"
grid_source="$generated/moonwell-grid-sprite-reference-v1.png"
world_alpha="$output/.world-alpha.png"
animated_alpha="$output/.animated-alpha.png"
grid_alpha="$output/.grid-reference-alpha.png"

remove_key "$world_source" "$world_alpha"
remove_key "$animated_source" "$animated_alpha"

# The grid-reference sheet is the approved layout-first source for the three
# objects whose visual footprint must equal their shared world-object record.
# Its slightly off-magenta generated field needs its own sampled key colour.
magick "$grid_source" -alpha off -fuzz 7% -transparent 'rgb(240,12,238)' "$grid_alpha"

# Static world props. The crop regions are intentionally generous so every
# target sprite retains a transparent safety margin after point scaling.
sprite "$world_alpha" '220x330+60+40' 32x48 "$output/moonwell-lantern-off-v2.png"
sprite "$world_alpha" '220x330+290+40' 32x48 "$output/moonwell-lantern-on-v2.png"
sprite "$world_alpha" '240x270+545+115' 32x32 "$output/moonwell-moonflower-v2.png"
sprite "$world_alpha" '330x360+810+15' 48x48 "$output/moonwell-tree-cluster-v2.png"
sprite "$world_alpha" '390x220+1145+165' 48x32 "$output/moonwell-root-platform-v2.png"
sprite "$world_alpha" '390x210+35+455' 64x16 "$output/moonwell-bridge-segment-v2.png"
sprite "$world_alpha" '220x270+480+400' 32x32 "$output/moonwell-rune-stone-v2.png"
sprite "$world_alpha" '190x270+755+390' 32x48 "$output/moonwell-skybell-v2.png"
sprite "$world_alpha" '410x310+985+380' 48x48 "$output/moonwell-sentinel-v3.png"
sprite "$world_alpha" '360x270+145+700' 64x48 "$output/moonwell-altar-v2.png"

# Preserve the accepted water tile as frame zero, then derive three additional
# current-scale surface variants from distinct regions of the same retained
# water source. Every frame receives frame zero's one-pixel perimeter so the
# established edge transition stays stable when unlike variants meet.
magick "$world_alpha" -crop '240x240+620+720' +repage -trim +repage \
  "$output/.water-source.png"
magick "$output/.water-source.png" -filter point -resize '16x16!' \
  "$output/.water-frame-0.png"
magick -size 16x16 xc:black -fill white \
  -draw 'rectangle 0,0 15,0 rectangle 0,15 15,15 rectangle 0,0 0,15 rectangle 15,0 15,15' \
  "$output/.water-border-mask.png"
for spec in '1:96x96+0+0' '2:96x96+104+8' '3:96x96+48+96'; do
  frame=${spec%%:*}
  crop=${spec#*:}
  magick "$output/.water-source.png" -crop "$crop" +repage \
    -filter point -resize '16x16!' -alpha off "$output/.water-variant-$frame.png"
  magick "$output/.water-variant-$frame.png" "$output/.water-frame-0.png" \
    "$output/.water-border-mask.png" -composite "$output/.water-frame-$frame.png"
done
magick "$output"/.water-frame-{0,1,2,3}.png +append \
  "$output/moonwell-water-tile-v2.png"

# Grid-exact replacements: one 16 × 16 tree, one 32 × 16 root platform, and
# one 32 × 32 sentinel. These are intentionally not trimmed beyond their
# declared canvas, so their image edges and collision footprint agree.
magick "$grid_alpha" -crop '270x410+40+370' +repage -trim +repage -filter point -resize '16x16!' "$output/moonwell-tree-tile-v3.png"
magick "$grid_alpha" -crop '650x200+350+585' +repage -trim +repage -filter point -resize '32x16!' "$output/moonwell-root-platform-tile-v3.png"
magick "$grid_alpha" -crop '430x570+1050+200' +repage -trim +repage -filter point -resize '32x32!' "$output/moonwell-sentinel-tile-v4.png"

# Animation strips use fixed-size source cells. Each final strip remains
# horizontal and has four equal frames with a shared ground baseline.
for frame in 0 1 2 3; do
  sprite "$animated_alpha" "260x190+$((150 + frame * 360))+15" 16x16 "$output/.firefly-$frame.png"
  sprite "$animated_alpha" "270x180+$((120 + frame * 360))+195" 16x16 "$output/.memory-$frame.png"
  sprite "$animated_alpha" "270x270+$((110 + frame * 360))+380" 32x48 "$output/.lantern-$frame.png"
  sprite "$animated_alpha" "290x290+$((95 + frame * 360))+650" 32x48 "$output/.skybell-$frame.png"
done

magick "$output"/.firefly-{0,1,2,3}.png -background none -alpha on +append "$output/moonwell-firefly-loop-v2.png"
magick "$output"/.memory-{0,1,2,3}.png -background none -alpha on +append "$output/moonwell-memory-loop-v2.png"
magick "$output"/.lantern-{0,1,2,3}.png -background none -alpha on +append "$output/moonwell-lantern-loop-v2.png"
magick "$output"/.skybell-{0,1,2,3}.png -background none -alpha on +append "$output/moonwell-skybell-loop-v2.png"

rm "$output"/.world-alpha.png "$output"/.animated-alpha.png "$output"/.grid-reference-alpha.png \
  "$output/.water-source.png" "$output/.water-border-mask.png" \
  "$output"/.water-variant-{1,2,3}.png "$output"/.water-frame-{0,1,2,3}.png \
  "$output"/.firefly-{0,1,2,3}.png \
  "$output"/.memory-{0,1,2,3}.png \
  "$output"/.lantern-{0,1,2,3}.png \
  "$output"/.skybell-{0,1,2,3}.png
