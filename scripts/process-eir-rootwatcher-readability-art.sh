#!/bin/sh
set -eu

# Eir's accepted v2 atlas has excellent full-size detail, but its small runtime
# 16 x 24 draw can merge into Moonroot's dense north-shore undergrowth. This
# deterministic derivative first resolves each frame to its actual runtime
# pixel grid, then adds a one-pixel, cool teal contact silhouette behind the
# existing opaque figure. It is intentionally a retained raster layer, not a
# runtime fallback: the draw box, anchor, timing, and interaction geometry stay
# exactly as accepted.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$repo_dir/assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v2.png"
source_sha256='4bc70c41fd73e083af2f1654ee38273981da949928c57229b553831f6d22a4cd'
output="$production_dir/moonwell-eir-rootwatcher-idle-v3.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-eir-readability.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$source")" != "$source_sha256" ]; then
  printf '%s\n' 'Eir v2 source changed; review provenance before rebuilding the readability derivative.' >&2
  exit 1
fi

for frame in 0 1 2 3; do
  native="$work_dir/eir-$frame-native.png"
  expanded="$work_dir/eir-$frame-expanded.png"
  framed="$work_dir/eir-$frame-framed.png"
  final="$work_dir/eir-$frame-final.png"
  offset=$((frame * 64))

  # Resolve to the exact 16 x 24 runtime cell before making the contact edge;
  # point expansion is therefore consistently one visible Moonwell pixel.
  magick "$source" -crop "64x96+$offset+0" +repage -filter point -resize '16x24!' \
    -strip -define png:exclude-chunk=date,time PNG32:"$native"
  magick "$native" -alpha extract -morphology Dilate Diamond:1 "$expanded"
  # Keep the native pixels above the expanded teal underlay. Using the complete
  # expanded alpha rather than a translucent halo makes it read as a grounded
  # silhouette at 16 x 24 while preserving the authored figure on top.
  magick -size '16x24' xc:'#275c63' "$expanded" -alpha off -compose copy_opacity -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$framed"
  magick "$framed" "$native" -compose over -composite -filter point -resize '64x96!' \
    -strip -define png:exclude-chunk=date,time PNG32:"$final"
done

magick "$work_dir/eir-0-final.png" "$work_dir/eir-1-final.png" \
  "$work_dir/eir-2-final.png" "$work_dir/eir-3-final.png" +append \
  -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt Eir Rootwatcher readability art at $output"
