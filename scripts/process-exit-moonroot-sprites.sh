#!/bin/sh
set -eu

# Builds the compact route-opening and Moonroot-bank world-art families from
# retained project-bound raster sources. Runtime loads only the deterministic
# PNG derivatives below.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
spruce_source="$repo_dir/assets/moonwell-art/production/moonwell-spruce-overhang-v3.png"
exit_surface_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-root-platform-v3.png"
shore_source="$repo_dir/assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-exit-moonroot.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

# Two retained spruce frames form the route overhang. The four cells part from
# a rooted thicket into a full one-tile gap, so the destination reads as space
# between trees rather than a symbol or lantern mounted on one trunk.
magick "$spruce_source" -crop '80x112+0+0' +repage -filter point \
  -resize '36x56!' "$work_dir/route-left.png"
magick "$spruce_source" -crop '80x112+80+0' +repage -flop -filter point \
  -resize '36x56!' "$work_dir/route-right.png"
for spec in 'closed:-2:30' 'opening:-4:32' 'revealed:-6:34' 'open:-8:36'; do
  state=${spec%%:*}
  rest=${spec#*:}
  left_x=${rest%%:*}
  right_x=${rest#*:}
  magick -size 64x72 xc:none \
    "$work_dir/route-left.png" -geometry "+${left_x}+16" -composite \
    "$work_dir/route-right.png" -geometry "+${right_x}+16" -composite \
    "$work_dir/route-overhang-$state.png"
done
magick "$work_dir/route-overhang-closed.png" "$work_dir/route-overhang-opening.png" \
  "$work_dir/route-overhang-revealed.png" "$work_dir/route-overhang-open.png" +append +repage \
  -strip -define png:exclude-chunk=date,time PNG32:"$production/moonwell-route-opening-overhang-v1.png"

# The threshold is a tapered, source-textured loam path rather than a light
# point. It broadens with the same four states and stays behind the parted
# spruces. A shallow retained root-platform crop grounds its near edge.
magick "$shore_source" -crop '96x80+200+8' +repage -filter point \
  -resize '32x40!' -background '#24463f' -alpha remove -alpha off \
  -modulate '122,72,96' -fill '#9b7041' -colorize 32% "$work_dir/route-path-base.png"
for spec in 'closed:6:4:74' 'opening:10:6:86' 'revealed:14:10:98' 'open:16:12:110'; do
  state=${spec%%:*}
  rest=${spec#*:}
  width=${rest%%:*}
  rest=${rest#*:}
  path=${rest%%:*}
  light=${rest#*:}
  left=$(((32-path)/2))
  right=$((left+path-1))
  top_left=$((16-width/4))
  top_right=$((15+width/4))
  shoulder_left=$((left+1))
  shoulder_right=$((right-1))
  path_x=$(((32-path)/2))
  magick -size 32x40 xc:black -fill white \
    -draw "polygon $top_left,16 $top_right,16 $shoulder_right,26 $right,39 $left,39 $shoulder_left,26" \
    "$work_dir/route-mask-$state.png"
  magick "$work_dir/route-path-base.png" -modulate "$light,100,100" \
    "$work_dir/route-path-$state.png"
  magick "$work_dir/route-path-$state.png" "$work_dir/route-mask-$state.png" \
    -alpha off -compose copyopacity -composite "$work_dir/route-body-$state.png"
  magick "$exit_surface_source" -crop '64x48+64+0' +repage -filter point \
    -resize "${path}x10!" -modulate "$light,82,100" \
    -fill '#9b7041' -colorize 18% "$work_dir/route-threshold-$state.png"
  magick "$work_dir/route-body-$state.png" \
    "$work_dir/route-threshold-$state.png" -geometry "+$path_x+30" -composite \
    "$work_dir/exit-$state.png"
done
magick "$work_dir/exit-closed.png" "$work_dir/exit-opening.png" \
  "$work_dir/exit-revealed.png" "$work_dir/exit-open.png" +append +repage \
  -strip -define png:exclude-chunk=date,time PNG32:"$production/moonwell-exit-clearing-states-v2.png"

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
for asset in moonwell-route-opening-overhang-v1.png moonwell-exit-clearing-states-v2.png moonwell-moonroot-shores-v1.png; do
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
