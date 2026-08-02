#!/bin/sh
set -eu

# Rebuilds the corrected bottom-right clearing family from the retained
# image-generated alpha source. The runtime consumes only the compact packed
# derivatives below; it never loads the source atlas or a baked scene.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
chroma_source="$repo_dir/assets/generated/moonwell-bottom-right-clearing-source-v3.png"
source="$repo_dir/assets/generated/moonwell-bottom-right-clearing-source-v3-alpha.png"
production="$repo_dir/assets/moonwell-art/production"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-bottom-right.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT

# The generated key field has a slight compression gradient, so remove only
# the border-connected magenta field. This preserves the deliberately sparse
# violet crystals inside opaque silhouettes.
magick "$chroma_source" -alpha on -fuzz 22% -fill none \
  -draw 'alpha 0,0 floodfill' "$source"
magick "$source" -strip -define png:exclude-chunk=date,time "$source"

crop_trim() {
  magick "$source" -crop "$2" +repage -trim +repage "$work_dir/$1.png"
}

# Dominant crescent landmark and broad root platform.
crop_trim crescent "512x416+64+0"
magick "$work_dir/crescent.png" -gravity south -background none -extent 320x384 \
  -filter point -resize 96x128! "$production/moonwell-clearing-crescent-landmark-v4.png"

crop_trim platform "704x256+512+160"
magick "$work_dir/platform.png" -gravity south -background none -extent 640x192 \
  -filter point -resize 192x64! "$production/moonwell-clearing-root-platform-v2.png"

# Calm, irregular loam patches. Fixed cells let the renderer overlap them
# without exposing source gutters or hard rectangular seams.
for spec in \
  "0:384x208+32+400" \
  "1:384x208+384+400" \
  "2:384x208+736+400" \
  "3:384x208+1088+400"
do
  index=${spec%%:*}
  geometry=${spec#*:}
  crop_trim "loam-$index" "$geometry"
  magick "$work_dir/loam-$index.png" -gravity center -background none -extent 384x208 \
    -filter point -resize 160x96! "$work_dir/loam-cell-$index.png"
done
magick "$work_dir/loam-cell-0.png" "$work_dir/loam-cell-1.png" \
  "$work_dir/loam-cell-2.png" "$work_dir/loam-cell-3.png" +append +repage \
  "$production/moonwell-clearing-loam-patches-v2.png"

# Two non-colliding perimeter clusters create enclosure without occupying the
# playable clearing.
for spec in "0:704x272+32+576" "1:704x272+720+576"
do
  index=${spec%%:*}
  geometry=${spec#*:}
  crop_trim "canopy-$index" "$geometry"
  magick "$work_dir/canopy-$index.png" -gravity south -background none -extent 704x272 \
    -filter point -resize 256x112! "$work_dir/canopy-cell-$index.png"
done
magick "$work_dir/canopy-cell-0.png" "$work_dir/canopy-cell-1.png" +append +repage \
  "$production/moonwell-clearing-canopy-v2.png"

# Soft moonlight stays separate so the renderer can screen-compose a visible
# luminous pool at normal play scale.
for spec in "0:288x176+32+848" "1:288x176+320+848" "2:288x176+608+848"
do
  index=${spec%%:*}
  geometry=${spec#*:}
  crop_trim "moon-$index" "$geometry"
  magick "$work_dir/moon-$index.png" -gravity center -background none -extent 288x176 \
    -filter point -resize 192x112! "$work_dir/moon-cell-$index.png"
done
magick "$work_dir/moon-cell-0.png" "$work_dir/moon-cell-1.png" \
  "$work_dir/moon-cell-2.png" +append +repage \
  "$production/moonwell-clearing-moonlight-v3.png"
magick "$production/moonwell-clearing-moonlight-v3.png" -alpha on -fuzz 18% \
  -transparent '#c50ebe' "$production/moonwell-clearing-moonlight-v3.png"
magick "$production/moonwell-clearing-moonlight-v3.png" -alpha on -fuzz 14% \
  -transparent '#600b91' -fuzz 12% -transparent '#310c88' \
  "$production/moonwell-clearing-moonlight-v3.png"

# Four restrained amber accents share the existing four-frame animation
# contract, but are newly derived from the corrected clearing family.
for spec in "0:72x72+952+888" "1:72x72+1036+888" "2:72x72+1120+888" "3:72x72+1204+888"
do
  index=${spec%%:*}
  geometry=${spec#*:}
  crop_trim "firefly-$index" "$geometry"
  magick "$work_dir/firefly-$index.png" -gravity center -background none -extent 72x72 \
    -filter point -resize 16x16! "$work_dir/firefly-cell-$index.png"
done
magick "$work_dir/firefly-cell-0.png" "$work_dir/firefly-cell-1.png" \
  "$work_dir/firefly-cell-2.png" "$work_dir/firefly-cell-3.png" +append +repage \
  "$production/moonwell-clearing-firefly-loop-v5.png"

# Strip generator metadata so identical source pixels produce byte-identical
# runtime files. This makes the art build suitable for deterministic checks.
for asset in \
  moonwell-clearing-crescent-landmark-v4.png \
  moonwell-clearing-root-platform-v2.png \
  moonwell-clearing-loam-patches-v2.png \
  moonwell-clearing-canopy-v2.png \
  moonwell-clearing-moonlight-v3.png \
  moonwell-clearing-firefly-loop-v5.png
do
  magick "$production/$asset" -strip -define png:exclude-chunk=date,time \
    "$production/$asset"
done

printf '%s\n' "Rebuilt corrected bottom-right clearing art in $production"
