#!/bin/sh
set -eu

# Builds the two small world-art families that replace the former canvas
# rectangles.  Both inputs are retained project-bound image-generation
# outputs; runtime loads only the compact PNG derivatives below.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
forest_source="$repo_dir/assets/generated/moonwell-bottom-right-clearing-source-v3-alpha.png"
exit_surface_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-root-platform-v3.png"
shore_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-exit-moonroot.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

# A pair of rooted, generated forest fragments makes the opening read as a
# place between trees. The mossy loam is also cropped from the retained sprite
# family, so the runtime strip contains no code-drawn world art.
magick "$forest_source" -crop '176x288+98+554' +repage -filter point -resize '12x30!' "$work_dir/exit-left.png"
magick "$forest_source" -crop '176x288+480+554' +repage -flop -filter point -resize '12x30!' "$work_dir/exit-right.png"
for spec in 'closed:6:4' 'opening:10:6' 'revealed:14:10' 'open:16:12'; do
  state=${spec%%:*}
  rest=${spec#*:}
  width=${rest%%:*}
  path=${rest#*:}
  path_x=$(((32-path)/2))
  edge_x=$(((32-width)/2))
  magick "$exit_surface_source" -crop '64x48+64+0' +repage -filter point \
    -resize "${path}x14!" "$work_dir/exit-loam-$state.png"
  magick -size 32x36 xc:none \
    "$work_dir/exit-left.png" -geometry "+$((edge_x-3))+5" -composite \
    "$work_dir/exit-right.png" -geometry "+$((edge_x+width-9))+5" -composite \
    "$work_dir/exit-loam-$state.png" -geometry "+$path_x+22" -composite \
    "$work_dir/exit-$state.png"
done
magick "$work_dir/exit-closed.png" "$work_dir/exit-opening.png" \
  "$work_dir/exit-revealed.png" "$work_dir/exit-open.png" +append +repage \
  -strip -define png:exclude-chunk=date,time "$production/moonwell-exit-clearing-states-v1.png"

# A continuous, low-contrast loam-to-wet-soil bank avoids turning the river
# edge into a root fence or bright tiled rail. Eight overlapping crops retain
# the generated loam family's small stones, moss, and irregular transparent
# fringe. The seven-pixel opaque underlayer joins the forest floor while the
# five-pixel source-shaped fringe breaks the waterline at the native scale.
for sample in 0 1 2 3 4 5 6 7; do
  cell=$((sample % 4))
  offset=$((cell*160+8+(sample/4)*8))
  fringe_y=$((50+(sample % 3)*3))
  fringe_light=$((88+(sample % 4)*3))
  soil_light=$((74+(sample % 3)*3))
  magick "$shore_source" -crop "144x40+$offset+$fringe_y" +repage \
    -filter point -resize '36x8!' -modulate "$fringe_light,78,100" "$work_dir/shore-fringe-$sample.png"
  magick "$shore_source" -crop "144x28+$offset+32" +repage \
    -filter point -resize '36x7!' -modulate "$soil_light,68,100" \
    -background '#17251f' -alpha remove -alpha off \
    "$work_dir/shore-soil-solid-$sample.png"
  magick -size 36x12 xc:none \
    "$work_dir/shore-soil-solid-$sample.png" -geometry +0+0 -composite \
    "$work_dir/shore-fringe-$sample.png" -geometry +0+4 -composite \
    "$work_dir/shore-$sample.png"
done
shore_strip() {
  output="$1"
  : > "$work_dir/shore-inputs.txt"
  for sample in 0 1 2 3 4 5 6 7; do
    printf '%s\n' "$work_dir/shore-$sample.png" >> "$work_dir/shore-inputs.txt"
  done
  # shellcheck disable=SC2046
  magick $(tr '\n' ' ' < "$work_dir/shore-inputs.txt") +append +repage "$output"
}
shore_strip "$work_dir/shore-north.png"
magick "$work_dir/shore-north.png" -flip "$work_dir/shore-south.png"
magick "$work_dir/shore-north.png" "$work_dir/shore-south.png" -append +repage \
  -strip -define png:exclude-chunk=date,time "$production/moonwell-moonroot-shores-v1.png"

# These crops inherit a few violet wildflower pixels from their broad source
# sheets. Recolor only the established purple-family predicate to quiet teal;
# warm path loam and all retained source detail stay intact.
purple_predicate='r>g*1.08 && b>g*1.12 && b>r*.58 && (max(r,b)-g)>.035'
for asset in moonwell-exit-clearing-states-v1.png moonwell-moonroot-shores-v1.png; do
  mask="$work_dir/$asset-mask.png"
  shifted="$work_dir/$asset-shifted.png"
  magick "$production/$asset" -alpha off -fx "$purple_predicate ? 1 : 0" "$mask"
  magick "$production/$asset" -colorspace HSL \
    -channel R -evaluate set 44% +channel \
    -channel G -evaluate multiply .48 +channel \
    -channel B -evaluate multiply .72 +channel \
    -colorspace sRGB "$shifted"
  magick "$production/$asset" "$shifted" "$mask" -compose over -composite \
    -strip -define png:exclude-chunk=date,time "$production/$asset"
done
