#!/bin/sh
set -eu

# Luna's exact-owner v7 atlas is authoritative, but its accepted 13 x 20
# runtime draw can merge into dense loam and foliage. Add one muted-teal source
# pixel behind the exact v7 figure while preserving every authored source pixel
# and the unchanged 26 x 40 atlas cells.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
production_dir="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$repo_dir/assets/moonwell-art/production/moonwell-keeper-walk-v7.png"
source_sha256='a287641c02f9e243d5f58d8188e7a54084c42a92150542ce52adfa29e8315f07'
output="$production_dir/moonwell-keeper-walk-v8.png"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-luna-readability.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production_dir"

digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$source")" != "$source_sha256" ]; then
  printf '%s\n' 'Luna v7 source changed; review exact-owner provenance before rebuilding the readability derivative.' >&2
  exit 1
fi

for frame in 0 1 2 3; do
  native="$work_dir/luna-$frame-native.png"
  expanded="$work_dir/luna-$frame-expanded.png"
  framed="$work_dir/luna-$frame-framed.png"
  final="$work_dir/luna-$frame-final.png"
  offset=$((frame * 26))

  magick "$source" -crop "26x40+$offset+0" +repage \
    -strip -define png:exclude-chunk=date,time PNG32:"$native"
  magick "$native" -alpha extract -morphology Dilate Diamond:1 "$expanded"
  magick -size '26x40' xc:'#275c63' "$expanded" -alpha off -compose copy_opacity -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$framed"
  magick "$framed" "$native" -compose over -composite \
    -strip -define png:exclude-chunk=date,time PNG32:"$final"
done

magick "$work_dir/luna-0-final.png" "$work_dir/luna-1-final.png" \
  "$work_dir/luna-2-final.png" "$work_dir/luna-3-final.png" +append \
  -strip -define png:exclude-chunk=date,time PNG32:"$output"

printf '%s\n' "Rebuilt Luna readability art at $output"
