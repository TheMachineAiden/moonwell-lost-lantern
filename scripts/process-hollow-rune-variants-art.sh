#!/bin/sh
set -eu

# Builds three subtly distinct grounded echo-stone silhouettes from the
# accepted no-violet rune raster. The runtime keeps every rune in its original
# 16 × 16 cell; only the retained source frame varies by placement.
# ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/moonwell-art/production/moonwell-rune-stone-v3.png"
source_sha256='608ba358262eb16de35098dc93b9e0acc5a3c04ac28beba0ee00cfcd91d8d605'
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
production="$production_dir/moonwell-rune-stone-variants-v1.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-hollow-runes.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Accepted hollow rune source changed; review provenance before rebuilding.' >&2
  exit 1
fi

# Scale and reflection create quiet sibling stones while preserving the cyan
# rune language, transparent cell margins, and a shared rooted baseline.
for spec in '0:16:16:0' '1:15:16:0' '2:15:15:1'; do
  IFS=: read -r variant width height mirror <<EOF
$spec
EOF
  frame="$work_dir/rune-$variant.png"
  magick "$source" -filter point -resize "${width}x${height}!" \
    -gravity south -background none -extent 16x16 \
    -strip -define png:exclude-chunk=date,time PNG32:"$frame"
  if [ "$mirror" -eq 1 ]; then
    magick "$frame" -flop -strip -define png:exclude-chunk=date,time PNG32:"$frame"
  fi
done

magick "$work_dir/rune-0.png" "$work_dir/rune-1.png" "$work_dir/rune-2.png" \
  +append +repage -strip -define png:exclude-chunk=date,time PNG32:"$production"

printf '%s\n' "Rebuilt varied retained Whispering Hollow rune stones at $production"
