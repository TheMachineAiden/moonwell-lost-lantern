#!/bin/sh
set -eu

# Builds eight restrained collectible variants from the retained animated-props
# source. Each four-frame strip keeps the approved amber firefly animation and
# 16 px runtime cell, while point scaling and reflection prevent the placed
# lights from stamping one silhouette through every map.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/generated/moonwell-animated-props-atlas-v2-source.png"
source_sha256='c933e841e31fa5980764353eb6add1796b4a4623cc413bafe2f492f13b09c815'
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
production="$production_dir/moonwell-firefly-variants-v1.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-fireflies.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Generated animated-props source changed; review provenance before rebuilding.' >&2
  exit 1
fi

magick "$source" -alpha off -fuzz 20% -transparent 'rgb(27,227,22)' "$work_dir/source-alpha.png"

for spec in '0:16:16:0' '1:15:16:1' '2:16:15:0' '3:14:15:1' '4:15:15:0' '5:14:16:1' '6:16:14:1' '7:15:14:0'; do
  IFS=: read -r variant width height mirror <<EOF
$spec
EOF
  for frame in 0 1 2 3; do
    magick "$work_dir/source-alpha.png" -crop "260x190+$((150 + frame * 360))+15" +repage \
      -trim +repage -filter point -resize "${width}x${height}!" -gravity south \
      -background none -extent 16x16 "$work_dir/frame-$variant-$frame.png"
    if [ "$mirror" -eq 1 ]; then
      magick "$work_dir/frame-$variant-$frame.png" -flop "$work_dir/frame-$variant-$frame.png"
    fi
  done
  magick "$work_dir/frame-$variant-0.png" "$work_dir/frame-$variant-1.png" \
    "$work_dir/frame-$variant-2.png" "$work_dir/frame-$variant-3.png" \
    +append +repage -strip -define png:exclude-chunk=date,time "$work_dir/variant-$variant.png"
done

magick "$work_dir"/variant-{0,1,2,3,4,5,6,7}.png +append +repage \
  -strip -define png:exclude-chunk=date,time "$production"

printf '%s\n' "Rebuilt varied sprite-first firefly art at $production"
