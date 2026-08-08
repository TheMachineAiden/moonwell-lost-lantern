#!/bin/sh
set -eu

# Derives the opaque, repeatable loam substrate from the reviewed no-violet
# loam family. Runtime lays these four retained 16 px cells beneath the larger
# transparent loam patches, so no canvas-painted terrain is visible anywhere
# in the forest floor.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-loam-base.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

for frame in 0 1 2 3; do
  # Each crop samples the settled central loam of one 160 x 96 source frame,
  # then point-reduces it to Moonwell's native tile. Flattening only its
  # transparent pixels to the shared deep-loam color gives a seam-safe raster
  # base while preserving every authored opaque cluster.
  offset=$((frame * 160 + 64))
  magick "$source" -crop "32x32+${offset}+32" +repage \
    -filter point -resize '16x16!' -background '#102a2e' -alpha remove -alpha off \
    -strip -define png:exclude-chunk=date,time PNG32:"$work_dir/loam-base-$frame.png"
done

magick "$work_dir/loam-base-0.png" "$work_dir/loam-base-1.png" \
  "$work_dir/loam-base-2.png" "$work_dir/loam-base-3.png" +append +repage \
  -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-loam-base-tiles-v1.png"

printf '%s\n' "Rebuilt opaque Moonwell loam base tiles in $production"
