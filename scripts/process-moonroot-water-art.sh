#!/bin/sh
set -eu

# Derive a quieter Moonroot surface from the accepted varied-water atlas. The
# four 16 px cells, opaque seam pixels, and their source provenance remain
# fixed; this material-only pass lets the banks and crossing route lead the
# eye instead of a saturated blue field.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production=${MOONWELL_ART_OUTPUT:-"$repo_dir/assets/moonwell-art/production"}
source="$repo_dir/assets/generated/moonwell-world-props-atlas-v2-source.png"
base="$production/moonwell-water-tile-v3.png"
output="$production/moonwell-water-tile-v4.png"

source_sha256='1f28c764f0a3b4e0c50b287e29312471081f35007265219e87e16aeb80a317b4'
digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$source")" != "$source_sha256" ]; then
  printf '%s\n' 'Moonroot water source changed; review provenance before rebuilding.' >&2
  exit 1
fi
if [ ! -f "$base" ]; then
  printf '%s\n' 'Build the accepted varied-water atlas before its quiet derivative.' >&2
  exit 1
fi

# A modest HSL reduction keeps the authored cyan ripple family readable at
# pixel scale while moving its value beneath the mossy banks and bridge.
magick "$base" -colorspace HSL \
  -channel G -evaluate multiply .78 +channel \
  -channel B -evaluate multiply .82 +channel \
  -colorspace sRGB -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt quiet Moonroot water art at $output"
