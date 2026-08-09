#!/bin/sh
set -eu

# Rebuilds six quiet 48 × 24 root-shelf frames from retained no-violet
# terrain families. The loam caps break the repeated platform silhouette;
# the shallow soil faces reuse the accepted rooted source texture through
# irregular Moonroot-bank alpha masks. Runtime code only selects these PNG
# frames and preserves the existing 2 × 1 platform footprint and collider.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
loam_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png"
root_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-root-platform-v3.png"
shore_source="$repo_dir/assets/moonwell-art/production/moonwell-moonroot-shores-v1.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "$repo_dir/.moonwell-root-shelves.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

for index in 0 1 2 3 4 5; do
  loam_frame=$((index % 4))
  loam_x=$((loam_frame * 160))
  shore_x=$((index * 48))

  # Each natural floor patch becomes a compact, broken shelf cap rather than
  # a straight green rail.
  magick "$loam_source" -crop "160x96+${loam_x}+0" +repage -trim +repage \
    -filter point -resize '48x16!' -modulate 118,96,100 \
    "$work_dir/top-$index.png"

  # Median-filter the old ribbed root face into quiet soil texture, then use
  # one unique retained bank section for the irregular lower silhouette.
  magick "$root_source" -crop '192x30+0+34' +repage \
    -statistic Median 17x3 -filter point -resize '48x10!' \
    -brightness-contrast 10x5 -modulate 100,78,100 -colors 18 \
    "$work_dir/face-texture-$index.png"
  magick "$shore_source" -crop "48x12+${shore_x}+0" +repage \
    -alpha extract -threshold 8% -resize '48x10!' "$work_dir/face-mask-$index.png"
  magick "$work_dir/face-texture-$index.png" "$work_dir/face-mask-$index.png" \
    -alpha off -compose CopyOpacity -composite "$work_dir/face-$index.png"
  if [ $((index % 2)) -eq 1 ]; then
    magick "$work_dir/face-$index.png" -flop "$work_dir/face-$index.png"
  fi

  magick -size 48x24 xc:none \
    "$work_dir/face-$index.png" -geometry +0+10 -composite \
    "$work_dir/top-$index.png" -geometry +0+0 -composite \
    -colors 34 -strip -define png:exclude-chunk=date,time \
    PNG32:"$work_dir/cell-$index.png"
done

magick "$work_dir"/cell-0.png "$work_dir"/cell-1.png \
  "$work_dir"/cell-2.png "$work_dir"/cell-3.png \
  "$work_dir"/cell-4.png "$work_dir"/cell-5.png \
  +append -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-root-shelf-variants-v1.png"

printf '%s\n' "Rebuilt varied root-shelf art in $production"
