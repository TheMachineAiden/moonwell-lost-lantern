#!/bin/sh
set -eu

# Derive the quieter Moonroot crossing from the accepted generated bridge.
# The source silhouette, alpha, and exact 2 x 4-tile footprint stay intact;
# only warm constructed-wood pixels are subdued so moss, roots, and water read
# before the bridge's former ladder-like orange block.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production=${MOONWELL_ART_OUTPUT:-"$repo_dir/assets/moonwell-art/production"}
source="$repo_dir/assets/generated/moonwell-vertical-bridge-source-v1.png"
base="$production/moonwell-bridge-vertical-v4.png"
output="$production/moonwell-bridge-vertical-v5.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-bridge.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT

source_sha256='2be0a36c497445282ffe7e971d6a994b4066dd8e765d2fe4a5ff6f7c9b734f91'
digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$source")" != "$source_sha256" ]; then
  printf '%s\n' 'Moonroot bridge source changed; review provenance before rebuilding.' >&2
  exit 1
fi
if [ ! -f "$base" ]; then
  printf '%s\n' 'Build the accepted no-violet bridge base before its quiet derivative.' >&2
  exit 1
fi

warm_mask="$work_dir/warm-mask.png"
shifted="$work_dir/shifted.png"

magick "$base" -alpha off \
  -fx 'r>g*1.07 && g>b*1.05 && r>.16 ? 1 : 0' "$warm_mask"
magick "$base" -colorspace HSL \
  -channel R -evaluate set 8% +channel \
  -channel G -evaluate multiply .68 +channel \
  -channel B -evaluate multiply .82 +channel \
  -colorspace sRGB "$shifted"
magick "$base" "$shifted" "$warm_mask" -compose over -composite \
  -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt quiet Moonroot bridge art at $output"
