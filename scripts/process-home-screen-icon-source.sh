#!/bin/sh
set -eu

# Preserve the untouched image-generation output and deterministically normalize
# its five isolated near-black violet pixels to the approved blue-green night.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
raw="$repo_dir/assets/generated/moonwell-home-screen-icon-generated-raw-v1.png"
source="$repo_dir/assets/generated/moonwell-home-screen-icon-source-v1.png"

magick "$raw" \
  -fill '#071421' -opaque '#070511' \
  -fill '#121b26' -opaque '#17111e' \
  -fill '#101a25' -opaque '#140f19' \
  -fill '#0b1822' -opaque '#0c0208' \
  -fill '#061421' -opaque '#02010c' \
  -strip -define png:exclude-chunk=date,time "$source"

printf '%s\n' "Rebuilt no-violet Moonwell icon source at $source"
