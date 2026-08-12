#!/bin/sh
set -eu

# Bakes the four map-specific forest falloffs into a retained raster strip.
# The centres track the established dominant moonlight pools, so the dimming
# supports each map's route focus without a runtime canvas gradient. The
# source vocabulary is the accepted no-violet moonlight-pool atlas; its digest
# pins the provenance of this visual derivative.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$production/moonwell-clearing-moonlight-v4.png"
source_sha256='53deeca95664eb4f87255eca69ea0a80595c36e9a72ecfea19e04d946a4a8a39'
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-atmosphere.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Moonwell moonlight source changed; review atmosphere provenance before rebuilding.' >&2
  exit 1
fi

# Each panel is an alpha-only midnight falloff, deliberately quantized to the
# native pixel grid. No terrain or object pixels are painted at runtime.
centres='112 145
232 61
256 149
188 101'
frame=0
while read -r centre_x centre_y; do
  left=$((320 - centre_x))
  top=$((208 - centre_y))
  magick -size '640x416' radial-gradient:'#02061700-#02061784' \
    -crop "320x208+${left}+${top}" +repage -filter point -resize '320x208!' \
    -strip -define png:exclude-chunk=date,time \
    PNG32:"$work_dir/atmosphere-$frame.png"
  frame=$((frame + 1))
done <<EOF
$centres
EOF

magick "$work_dir/atmosphere-0.png" "$work_dir/atmosphere-1.png" \
  "$work_dir/atmosphere-2.png" "$work_dir/atmosphere-3.png" +append +repage \
  -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-forest-atmosphere-v1.png"

printf '%s\n' "Rebuilt retained Moonwell forest atmosphere at $production/moonwell-forest-atmosphere-v1.png"
