#!/bin/sh
set -eu

# Derive Whispering Hollow's quiet 2 x 2 blocker from its retained generated
# source. The runtime sprite keeps a side safety gutter, grounded baseline,
# binary pixel-art alpha, and no procedural shape or painted fallback.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
output="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
source="$repo_dir/assets/generated/moonwell-hollow-sentinel-source-v1.png"
source_sha256='dc70ee658015592b769d2fdddbc4b8aa549ab9f88bcd634167d0302c642809ea'
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-hollow-sentinel.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$output"

digest() {
  shasum -a 256 "$1" | awk '{print $1}'
}

if [ "$(digest "$source")" != "$source_sha256" ]; then
  printf '%s\n' 'Hollow sentinel source changed; review provenance before rebuilding.' >&2
  exit 1
fi

keyed="$work_dir/keyed.png"
reduced="$work_dir/reduced.png"
mask="$work_dir/purple-mask.png"
shifted="$work_dir/shifted.png"
palette="$work_dir/palette.png"
warm_mask="$work_dir/warm-mask.png"
bark_shifted="$work_dir/bark-shifted.png"
final="$output/moonwell-sentinel-stones-v2.png"
purple_predicate='r>g*1.08 && b>g*1.12 && b>r*.58 && (max(r,b)-g)>.035'
warm_predicate='r>g*1.08 && r>b*1.25 && r>.55'

# The generated field varies slightly around #ff00ff. A hard alpha predicate
# clears only that family, then the complete retained formation is point-
# reduced to a 30 px square inside its unchanged 32 x 32 visual footprint.
magick "$source" -alpha set -channel A \
  -fx 'r>.45 && b>.45 && g<min(r,b)*.45 ? 0 : 1' +channel \
  "$keyed"
magick "$keyed" -trim +repage -filter point -resize '30x30!' \
  -gravity south -background none -extent 32x32 \
  -channel A -threshold 50% +channel "$reduced"

# Normalize the few retained source accents that still fall in the prohibited
# purple family into muted teal; stone, moss, roots, and navy remain unchanged.
magick "$reduced" -alpha off -fx "$purple_predicate ? 1 : 0" "$mask"
magick "$reduced" -colorspace HSL \
  -channel R -evaluate set 44% +channel \
  -channel G -evaluate multiply .48 +channel \
  -channel B -evaluate multiply .72 +channel \
  -colorspace sRGB "$shifted"
magick "$reduced" "$shifted" "$mask" -compose over -composite \
  "$palette"

# Roots remain natural aged brown, but the source's few pale gold clusters are
# lowered below firefly and rune value so the blocker has no warm focal point.
magick "$palette" -alpha off -fx "$warm_predicate ? 1 : 0" "$warm_mask"
magick "$palette" -colorspace HSL \
  -channel R -evaluate set 8% +channel \
  -channel G -evaluate multiply .46 +channel \
  -channel B -evaluate multiply .65 +channel \
  -colorspace sRGB "$bark_shifted"
magick "$palette" "$bark_shifted" "$warm_mask" -compose over -composite \
  -strip -define png:exclude-chunk=date,time PNG32:"$final"

printf '%s\n' "Rebuilt quiet Hollow sentinel art at $final"
