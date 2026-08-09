#!/bin/sh
set -eu

# Rebuild every runtime raster derived from retained generated sources, then
# replace purple-family pixels with material-specific bark, teal, moonlit-cyan,
# or character-outline hues. Luna v7 is a direct point reduction of the exact
# owner attachment: transparency, a shared baseline, and frame padding are the
# only transformations applied to her four supplied poses.
# ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production="$repo_dir/assets/moonwell-art/production"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-no-violet.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
legacy="$work_dir/source-derived"
mkdir -p "$legacy" "$production"

luna_owner_source="$repo_dir/artifacts/owner-handoffs/luna-exact-owner-source-2026-08-03.png"
luna_owner_source_sha256='50258352972739d24748684eb433c50aefad4393d08b0b1461e3c82e49a86249'

digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$luna_owner_source")" != "$luna_owner_source_sha256" ]; then
  printf '%s\n' 'Exact Luna owner source changed; review provenance before rebuilding.' >&2
  exit 1
fi

MOONWELL_ART_OUTPUT="$legacy" bash "$repo_dir/scripts/process-moonwell-art.sh"
MOONWELL_ART_OUTPUT="$legacy" MOONWELL_WRITE_COMPARISON=0 \
  bash "$repo_dir/scripts/process-selected-forest-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-luminous-forest-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-bottom-right-clearing-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-starroot-chime-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-firefly-variants-art.sh"

# The vertical bridge is a project-bound image-generation source on a flat
# magenta field. Key, trim, and point-reduce it to the exact 2 × 4-cell span
# before the shared palette pass below.
magick "$repo_dir/assets/generated/moonwell-vertical-bridge-source-v1.png" \
  -alpha on -fuzz 16% -transparent 'rgb(241,11,238)' -trim +repage \
  -filter point -resize '32x64!' -channel A -threshold 50% +channel \
  -strip -define png:exclude-chunk=date,time PNG32:"$legacy/moonwell-bridge-vertical-v4-keyed.png"

# The predicate selects saturated purple/magenta/violet pixels while leaving
# navy moonlight, brown bark, neutral highlights, and cyan pixels intact.
purple_predicate='r>g*1.08 && b>g*1.12 && b>r*.58 && (max(r,b)-g)>.035'
character_purple_predicate='r>g*1.06 && b>g*1.10 && b>r*.30 && (max(r,b)-g)>.035'

recolor() {
  input="$legacy/$1"
  output="$production/$2"
  hue="$3"
  saturation="$4"
  lightness="$5"
  mask="$work_dir/$2-mask.png"
  shifted="$work_dir/$2-shifted.png"

  magick "$input" -alpha off -fx "$purple_predicate ? 1 : 0" "$mask"
  magick "$input" -colorspace HSL \
    -channel R -evaluate set "$hue" +channel \
    -channel G -evaluate multiply "$saturation" +channel \
    -channel B -evaluate multiply "$lightness" +channel \
    -colorspace sRGB "$shifted"
  magick "$input" "$shifted" "$mask" -compose over -composite \
    -strip -define png:exclude-chunk=date,time "$output"
}

flat_recolor() {
  input="$legacy/$1"
  output="$production/$2"
  color="$3"
  mask="$work_dir/$2-mask.png"
  fill="$work_dir/$2-fill.png"
  dimensions=$(magick identify -format '%wx%h' "$input")

  magick "$input" -alpha off -fx "$character_purple_predicate ? 1 : 0" "$mask"
  magick -size "$dimensions" "xc:$color" "$fill"
  magick "$input" "$fill" "$mask" -compose over -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$output"
}

# The selected spruce and canopy sources contain tiny warm pinlights that are
# harmless in isolation but repeat into dozens of false collectible cues when
# the runtime tiles them around a scene. Keep their authored clusters and
# transparency, but cool only those fixed ambient points to muted moss-teal.
# Gameplay fireflies, Luna's lantern, starroots, exits, and the altar never pass
# through this coordinate mask and retain their established amber hierarchy.
cool_ambient_glints() {
  output="$production/$1"
  regions="$2"
  dimensions=$(magick identify -format '%wx%h' "$output")
  warm_mask="$work_dir/$1-warm-mask.png"
  region_mask="$work_dir/$1-region-mask.png"
  mask="$work_dir/$1-ambient-mask.png"
  shifted="$work_dir/$1-ambient-shifted.png"
  cooled="$work_dir/$1-cooled.png"

  magick "$output" -alpha off \
    -fx 'r>g*1.05 && r>b*1.12 && r>.14 ? 1 : 0' "$warm_mask"
  magick -size "$dimensions" xc:black -fill white -draw "$regions" "$region_mask"
  magick "$warm_mask" "$region_mask" -compose multiply -composite "$mask"
  magick "$output" -colorspace HSL \
    -channel R -evaluate set 44% +channel \
    -channel G -evaluate multiply .52 +channel \
    -channel B -evaluate multiply .58 +channel \
    -colorspace sRGB "$shifted"
  magick "$output" "$shifted" "$mask" -compose over -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$cooled"
  mv "$cooled" "$output"
}

# Palette replacement can shift equivalent near-navy edge pixels by a few
# values when source variants contain different keyed colour families. Copy
# frame zero's final opaque perimeter onto every water frame after recoloring,
# preserving the established tile transition while keeping varied interiors.
normalize_water_perimeters() {
  output="$production/moonwell-water-tile-v3.png"
  top="$work_dir/water-border-top.png"
  bottom="$work_dir/water-border-bottom.png"
  left="$work_dir/water-border-left.png"
  right="$work_dir/water-border-right.png"
  magick "$output" -crop '16x1+0+0' +repage "$top"
  magick "$output" -crop '16x1+0+15' +repage "$bottom"
  magick "$output" -crop '1x16+0+0' +repage "$left"
  magick "$output" -crop '1x16+15+0' +repage "$right"
  for frame in 0 1 2 3; do
    cell="$work_dir/water-frame-final-$frame.png"
    magick "$output" -crop "16x16+$((frame * 16))+0" +repage \
      "$top" -geometry +0+0 -compose over -composite \
      "$bottom" -geometry +0+15 -compose over -composite \
      "$left" -geometry +0+0 -compose over -composite \
      "$right" -geometry +15+0 -compose over -composite "$cell"
  done
  magick "$work_dir"/water-frame-final-{0,1,2,3}.png +append \
    -strip -define png:exclude-chunk=date,time PNG32:"$output"
}

# Deep, muted teal for foliage, loam, silhouettes, and small ground detail.
recolor moonwell-spruce-overhang-v2.png moonwell-spruce-overhang-v3.png 44% .48 .72
recolor moonwell-clearing-canopy-v2.png moonwell-clearing-canopy-v3.png 44% .48 .72
recolor moonwell-clearing-loam-patches-v2.png moonwell-clearing-loam-patches-v3.png 44% .44 .72
recolor moonwell-foliage-variants-v1.png moonwell-foliage-variants-v2.png 44% .48 .76
recolor moonwell-ground-texture-variants-v1.png moonwell-ground-texture-variants-v2.png 44% .44 .72
recolor moonwell-stone-variants-v1.png moonwell-stone-variants-v2.png 47% .30 .74
recolor moonwell-mushroom-variants-v1.png moonwell-mushroom-variants-v2.png 44% .38 .78
recolor moonwell-light-pool-variants-v1.png moonwell-light-pool-variants-v2.png 48% .38 .82
recolor moonwell-clearing-firefly-loop-v5.png moonwell-clearing-firefly-loop-v6.png 44% .42 .78
recolor moonwell-firefly-variants-v1.png moonwell-firefly-variants-v2.png 44% .42 .78
recolor moonwell-sentinel-tile-v4.png moonwell-sentinel-tile-v5.png 44% .42 .72
recolor moonwell-water-tile-v2.png moonwell-water-tile-v3.png 47% .38 .80
normalize_water_perimeters

# The final floor substrate is a retained opaque derivative of the freshly
# rebuilt loam raster. Keep it after the palette pass so its source and output
# remain byte-reproducible in this one managed environment-art workflow.
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-loam-base-art.sh"

cool_ambient_glints moonwell-spruce-overhang-v3.png \
  'rectangle 39,85 50,97'
cool_ambient_glints moonwell-clearing-canopy-v3.png \
  'rectangle 86,68 98,81 rectangle 154,77 166,89 rectangle 340,68 352,79 rectangle 414,82 426,96 rectangle 454,79 466,91'

# Natural dark bark for rooted structures and crescent-bearing trees.
recolor moonwell-clearing-root-platform-v2.png moonwell-clearing-root-platform-v3.png 8% .58 .68
recolor moonwell-clearing-crescent-landmark-v4.png moonwell-clearing-crescent-landmark-v5.png 8% .52 .70
recolor moonwell-crescent-exit-overhang-v3.png moonwell-crescent-exit-overhang-v4.png 8% .52 .70
recolor moonwell-bridge-segment-v2.png moonwell-bridge-segment-v3.png 8% .48 .72
recolor moonwell-bridge-vertical-v4-keyed.png moonwell-bridge-vertical-v4.png 8% .48 .72
recolor moonwell-altar-v2.png moonwell-altar-v3.png 8% .44 .72

# Local magical objects use cool moonlit cyan or restrained amber-neutral,
# never contour-forming violet.
recolor moonwell-clearing-moonlight-v3.png moonwell-clearing-moonlight-v4.png 52% .42 .86
recolor moonwell-memory-loop-v2.png moonwell-memory-loop-v3.png 52% .32 .88
recolor moonwell-moonflower-v2.png moonwell-moonflower-v3.png 52% .40 .84
recolor moonwell-rune-stone-v2.png moonwell-rune-stone-v3.png 52% .42 .82
recolor moonwell-starroot-chime-variants-v3.png moonwell-starroot-chime-variants-v4.png 44% .42 .76

# Eir's retained keyed sheet leaves saturated magenta/fuchsia fringe after the
# 64 x 96 frame reduction. Replace it with the established near-black outline;
# the larger portrait maps its sparse purple undergrowth accents to muted teal.
flat_recolor moonwell-eir-rootwatcher-idle-v1.png moonwell-eir-rootwatcher-idle-v2.png '#081928'
flat_recolor moonwell-eir-rootwatcher-portrait-v1.png moonwell-eir-rootwatcher-portrait-v2.png '#0F4559'

# The attachment is four 499 px-wide poses on a magenta generation background.
# For each pose, key only that background family into alpha, trim transparent
# space, point-reduce the literal figure to 38 px high, and place it in a
# 26 x 40 cell with safe side padding and a shared one-pixel ground margin.
# No pixel clusters are redrawn or recolored. The fourth source slice is
# naturally 498 px wide.
luna_frames=
for frame in 0 1 2 3; do
  offset=$((frame * 499))
  output="$work_dir/luna-frame-$frame.png"
  magick "$luna_owner_source" -crop "499x788+$offset+0" +repage \
    -alpha set -channel A -fx 'r>.45 && b>.45 && g<min(r,b)*.45 ? 0 : 1' +channel \
    -trim +repage -filter point -resize 23x38 \
    -gravity south -background none -extent 26x39 \
    -gravity north -extent 26x40 \
    -strip -define png:exclude-chunk=date,time PNG32:"$output"
  luna_frames="$luna_frames $output"
done
# shellcheck disable=SC2086 # one controlled path per generated frame
magick $luna_frames +append -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-keeper-walk-v7.png"

# Rebuild the routed exit threshold and Moonroot banks only after their final
# no-violet forest inputs exist. This keeps both derivatives inside the same
# deterministic managed world-art pass as their retained source families.
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-exit-moonroot-sprites.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-root-shelf-art.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-hollow-sentinel-art.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-hollow-rune-variants-art.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-moonroot-bridge-art.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-moonroot-water-art.sh"
MOONWELL_ART_OUTPUT="$production" sh "$repo_dir/scripts/process-starroot-dormant-art.sh"

printf '%s\n' "Rebuilt no-violet Moonwell runtime family in $production"
