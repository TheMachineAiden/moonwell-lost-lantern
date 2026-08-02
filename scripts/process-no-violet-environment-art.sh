#!/bin/sh
set -eu

# Rebuild every runtime environmental raster from retained generated sources,
# then replace purple-family pixels with material-specific bark, teal, or
# moonlit-cyan hues. Luna and Eir are deliberately outside this processor.
# ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production="$repo_dir/assets/moonwell-art/production"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-no-violet.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
legacy="$work_dir/source-derived"
mkdir -p "$legacy" "$production"

MOONWELL_ART_OUTPUT="$legacy" bash "$repo_dir/scripts/process-moonwell-art.sh"
MOONWELL_ART_OUTPUT="$legacy" MOONWELL_WRITE_COMPARISON=0 \
  bash "$repo_dir/scripts/process-selected-forest-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-luminous-forest-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-bottom-right-clearing-art.sh"
MOONWELL_ART_OUTPUT="$legacy" sh "$repo_dir/scripts/process-starroot-chime-art.sh"

# The predicate selects saturated purple/magenta/violet pixels while leaving
# navy moonlight, brown bark, neutral highlights, and cyan pixels intact.
purple_predicate='r>g*1.08 && b>g*1.12 && b>r*.58 && (max(r,b)-g)>.035'

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
recolor moonwell-sentinel-tile-v4.png moonwell-sentinel-tile-v5.png 44% .42 .72
recolor moonwell-water-tile-v2.png moonwell-water-tile-v3.png 47% .38 .80

# Natural dark bark for rooted structures and crescent-bearing trees.
recolor moonwell-clearing-root-platform-v2.png moonwell-clearing-root-platform-v3.png 8% .58 .68
recolor moonwell-clearing-crescent-landmark-v4.png moonwell-clearing-crescent-landmark-v5.png 8% .52 .70
recolor moonwell-crescent-exit-overhang-v3.png moonwell-crescent-exit-overhang-v4.png 8% .52 .70
recolor moonwell-bridge-segment-v2.png moonwell-bridge-segment-v3.png 8% .48 .72
recolor moonwell-altar-v2.png moonwell-altar-v3.png 8% .44 .72

# Local magical objects use cool moonlit cyan or restrained amber-neutral,
# never contour-forming violet.
recolor moonwell-clearing-moonlight-v3.png moonwell-clearing-moonlight-v4.png 52% .42 .86
recolor moonwell-memory-loop-v2.png moonwell-memory-loop-v3.png 52% .32 .88
recolor moonwell-moonflower-v2.png moonwell-moonflower-v3.png 52% .40 .84
recolor moonwell-rune-stone-v2.png moonwell-rune-stone-v3.png 52% .42 .82
recolor moonwell-starroot-chime-loop-v1.png moonwell-starroot-chime-loop-v2.png 44% .42 .76

printf '%s\n' "Rebuilt no-violet environmental runtime family in $production"
