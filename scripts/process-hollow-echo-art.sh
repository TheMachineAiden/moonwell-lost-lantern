#!/bin/sh
set -eu

# Whispering Hollow replays Luna's exact owner-authored walk silhouette, but a
# translucent copy of the dark production atlas nearly vanishes over loam and
# the sentinel. This deterministic character derivative preserves every alpha
# pixel, frame boundary, pose, baseline, and 26 x 40 source cell while mapping
# only the opaque RGB values into a restrained moonlit cyan range.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$production_dir/moonwell-keeper-walk-v7.png"
source_sha256='a287641c02f9e243d5f58d8188e7a54084c42a92150542ce52adfa29e8315f07'
output="$production_dir/moonwell-keeper-echo-v1.png"
mkdir -p "$production_dir"

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Luna v7 source changed; review exact-owner provenance before rebuilding the Hollow echo.' >&2
  exit 1
fi

magick "$source" -channel RGB -colorspace gray -level '4%,82%' \
  +level-colors '#173348','#9eeaf5' +channel \
  -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt Whispering Hollow echo art at $output"
