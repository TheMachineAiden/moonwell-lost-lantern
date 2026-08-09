#!/bin/sh
set -eu

# Builds three grounded Starfall Grove interaction variants from the retained
# generated chroma source. Every four-state strip preserves the authored roots,
# moss, stable baseline, and waking amber light while varying retained scale
# and reflection so the three placed chimes do not stamp one silhouette.
# ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/generated/moonwell-starroot-clearing-source-v2.png"
source_sha256='a5b36b3470eea3e0eaf854938c0e58f0c25b94c1eb2df8c75cdd8d5107db9aa7'
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
production="$production_dir/moonwell-starroot-chime-variants-v3.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-starroot.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Generated starroot grounding source changed; review provenance before rebuilding.' >&2
  exit 1
fi

# Standalone regeneration retains the keyed provenance companion. Composite
# rebuilds keep that intermediate isolated with the rest of their work files.
if [ -n "${MOONWELL_ART_OUTPUT:-}" ]; then
  alpha_source="$work_dir/moonwell-starroot-clearing-source-v2-alpha.png"
else
  alpha_source="$repo_dir/assets/generated/moonwell-starroot-clearing-source-v2-alpha.png"
fi

magick "$source" -alpha set -channel A \
  -fx 'r>.55 && b>.55 && g<min(r,b)*.50 ? 0 : 1' +channel \
  -strip -define png:exclude-chunk=date,time "$alpha_source"

for spec in '0:22:22:0' '1:20:21:1' '2:22:20:0'; do
  IFS=: read -r variant width height mirror <<EOF
$spec
EOF
  for index in 0 1 2 3; do
    x=$((index * 384))
    magick "$alpha_source" -crop "384x1024+${x}+0" +repage -trim +repage \
      -filter point -resize "${width}x${height}!" -gravity south \
      -background none -extent 24x24 "$work_dir/frame-$variant-$index.png"
    if [ "$mirror" -eq 1 ]; then
      magick "$work_dir/frame-$variant-$index.png" -flop \
        "$work_dir/frame-$variant-$index.png"
    fi
  done
  magick "$work_dir/frame-$variant-0.png" "$work_dir/frame-$variant-1.png" \
    "$work_dir/frame-$variant-2.png" "$work_dir/frame-$variant-3.png" \
    +append +repage -strip -define png:exclude-chunk=date,time \
    "$work_dir/variant-$variant.png"
done

magick "$work_dir/variant-0.png" "$work_dir/variant-1.png" \
  "$work_dir/variant-2.png" +append +repage \
  -strip -define png:exclude-chunk=date,time "$production"

printf '%s\n' "Rebuilt varied sprite-first grounded starroot chime art at $production"
