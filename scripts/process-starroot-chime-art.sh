#!/bin/sh
set -eu

# Builds the grounded Starfall Grove interaction from its retained generated
# chroma source. Four fixed cells preserve a stable baseline while amber light
# wakes inside the root knot. ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/generated/moonwell-starroot-chime-source-v1.png"
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
production="$production_dir/moonwell-starroot-chime-loop-v1.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-starroot.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

# Standalone regeneration retains the keyed provenance companion. Composite
# rebuilds keep that intermediate isolated with the rest of their work files.
if [ -n "${MOONWELL_ART_OUTPUT:-}" ]; then
  alpha_source="$work_dir/moonwell-starroot-chime-source-v1-alpha.png"
else
  alpha_source="$repo_dir/assets/generated/moonwell-starroot-chime-source-v1-alpha.png"
fi

magick "$source" -alpha on -fuzz 10% -transparent '#ff00ff' \
  -strip -define png:exclude-chunk=date,time "$alpha_source"

for index in 0 1 2 3; do
  x=$((index * 384))
  magick "$alpha_source" -crop "384x1024+${x}+0" +repage -trim +repage \
    -filter point -resize '24x22' -gravity south -background none \
    -extent 24x24 "$work_dir/frame-$index.png"
done

magick "$work_dir/frame-0.png" "$work_dir/frame-1.png" \
  "$work_dir/frame-2.png" "$work_dir/frame-3.png" +append +repage \
  -strip -define png:exclude-chunk=date,time "$production"

printf '%s\n' "Rebuilt grounded starroot chime art at $production"
