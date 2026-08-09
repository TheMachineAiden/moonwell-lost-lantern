#!/bin/sh
set -eu

# Separates Starfall's sleeping chimes from the awakened amber objective state.
# The retained v4 atlas remains the only input: this deterministic derivative
# cools its tiny lantern-bright dormant pixels while preserving every authored
# root, moss, silhouette edge, alpha pixel, and the full lit frames.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$production_dir/moonwell-starroot-chime-variants-v4.png"
source_sha256='b0878645ab0d9ad743a2aa18e07bc8da610583317ddd138b74398b9c51640b7d'
output="$production_dir/moonwell-starroot-chime-variants-v5.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-starroot-dormant.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT

if [ "$(shasum -a 256 "$source" | awk '{print $1}')" != "$source_sha256" ]; then
  printf '%s\n' 'Starroot v4 source changed; review its provenance before rebuilding the dormant-state derivative.' >&2
  exit 1
fi

for variant in 0 1 2; do
  for frame in 0 1 2 3; do
    cell="$work_dir/starroot-$variant-$frame.png"
    offset=$(((variant * 4 + frame) * 24))
    magick "$source" -crop "24x24+$offset+0" +repage "$cell"
    # Frames zero and one are the only runtime sleeping states. Shift only
    # actual lantern-bright amber points to restrained moonlit cyan; bark and
    # moss remain their authored material colours, and frames two/three retain
    # their waking and fully-lit amber progression.
    if [ "$frame" -lt 2 ]; then
      mask="$work_dir/starroot-$variant-$frame-mask.png"
      fill="$work_dir/starroot-$variant-$frame-fill.png"
      magick "$cell" -alpha off \
        -fx 'r>g*1.08 && g>b*1.20 && r>.62 && g>.32 && b<.32 ? 1 : 0' "$mask"
      magick -size '24x24' xc:'#83b9b2' "$fill"
      magick "$cell" "$fill" "$mask" -compose over -composite \
        -strip -define png:exclude-chunk=date,time PNG32:"$cell"
    fi
  done
  magick "$work_dir/starroot-$variant-0.png" "$work_dir/starroot-$variant-1.png" \
    "$work_dir/starroot-$variant-2.png" "$work_dir/starroot-$variant-3.png" \
    +append +repage -strip -define png:exclude-chunk=date,time \
    PNG32:"$work_dir/starroot-variant-$variant.png"
done

magick "$work_dir/starroot-variant-0.png" "$work_dir/starroot-variant-1.png" \
  "$work_dir/starroot-variant-2.png" +append +repage \
  -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt cool-dormant Starroot chime art at $output"
