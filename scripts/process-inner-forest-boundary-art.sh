#!/bin/sh
set -eu

# Builds the dense inner-forest curtain from the retained selected-canopy
# raster. The source-sized composition is kept beside the other generated
# sources, then point-reduced into the exact two-frame runtime footprint.
# Runtime only consumes the production PNG; no canvas shape stands in for it.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
base="$repo_dir/assets/moonwell-art/production/moonwell-clearing-canopy-v3.png"
source="$repo_dir/assets/generated/moonwell-inner-forest-boundary-source-v1.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-inner-forest.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

panel() {
  frame="$1"
  crop_x=$((frame * 256))
  crop="$work_dir/canopy-$frame.png"
  out="$work_dir/boundary-$frame.png"

  # Offset canopy copies overlap at different heights, leaving varied crowns,
  # bark, moss, and root shadow rather than a regular row of cropped trees.
  magick "$base" -crop "256x112+${crop_x}+0" +repage -filter point -resize '512x224!' "$crop"
  magick -size 512x224 'xc:none' \
    \( "$crop" -geometry -88-40 \) -composite \
    \( "$crop" -flop -geometry +62-30 \) -composite \
    \( "$crop" -geometry +218-48 \) -composite \
    \( "$crop" -flop -geometry +370-34 \) -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$out"
}

panel 0
panel 1
magick "$work_dir/boundary-0.png" "$work_dir/boundary-1.png" +append +repage \
  -strip -define png:exclude-chunk=date,time PNG32:"$source"
magick "$source" -filter point -resize '512x112!' \
  -strip -define png:exclude-chunk=date,time PNG32:"$production/moonwell-inner-forest-boundary-v1.png"
