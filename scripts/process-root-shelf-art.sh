#!/bin/sh
set -eu

# Rebuilds six irregular 48 × 24 root-shelf frames from the retained generated
# world-props rootfall. Each state keeps its moss, branch forks, and spreading
# ground roots, then varies only retained scale, placement, and reflection.
# Runtime code only selects these PNG frames and preserves the existing 2 × 1
# footprint and collider.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
root_source="$repo_dir/assets/moonwell-art/production/moonwell-root-platform-v2.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "$repo_dir/.moonwell-root-shelves.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

for spec in \
  '0:46:22:1:2:0:76' '1:44:21:2:3:1:72' '2:47:20:0:4:0:78' \
  '3:45:22:2:2:1:74' '4:43:23:3:1:0:76' '5:46:20:1:4:1:72'; do
  IFS=: read -r index width height x y mirror lightness <<EOF
$spec
EOF
  magick "$root_source" -trim +repage -filter point \
    -resize "${width}x${height}!" -modulate "$lightness,72,100" \
    -strip -define png:exclude-chunk=date,time PNG32:"$work_dir/root-$index.png"
  if [ "$mirror" -eq 1 ]; then
    magick "$work_dir/root-$index.png" -flop "$work_dir/root-$index.png"
  fi
  magick -size 48x24 xc:none "$work_dir/root-$index.png" -geometry "+$x+$y" -composite \
    -colors 42 -strip -define png:exclude-chunk=date,time \
    PNG32:"$work_dir/cell-$index.png"
done

magick "$work_dir"/cell-0.png "$work_dir"/cell-1.png \
  "$work_dir"/cell-2.png "$work_dir"/cell-3.png \
  "$work_dir"/cell-4.png "$work_dir"/cell-5.png \
  +append -strip -define png:exclude-chunk=date,time \
  PNG32:"$work_dir/root-shelves-raw.png"

# Scaling can expose a handful of interpolated source-edge pixels that cross
# the shared no-violet predicate. Normalize only those pixels with the same
# muted-teal material pass used by the managed environmental workflow.
purple_predicate='r>g*1.08 && b>g*1.12 && b>r*.58 && (max(r,b)-g)>.035'
magick "$work_dir/root-shelves-raw.png" -alpha off \
  -fx "$purple_predicate ? 1 : 0" "$work_dir/purple-mask.png"
magick "$work_dir/root-shelves-raw.png" -colorspace HSL \
  -channel R -evaluate set 44% +channel \
  -channel G -evaluate multiply .48 +channel \
  -channel B -evaluate multiply .72 +channel \
  -colorspace sRGB "$work_dir/root-shelves-teal.png"
magick "$work_dir/root-shelves-raw.png" "$work_dir/root-shelves-teal.png" \
  "$work_dir/purple-mask.png" -compose over -composite \
  -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-root-shelf-variants-v2.png"

printf '%s\n' "Rebuilt full rooted-shelf art in $production"
