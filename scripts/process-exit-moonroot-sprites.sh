#!/bin/sh
set -eu

# Builds the compact route-opening and Moonroot-bank world-art families from
# retained project-bound raster sources. Runtime loads only the deterministic
# PNG derivatives below.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
spruce_source="$repo_dir/assets/moonwell-art/production/moonwell-spruce-overhang-v3.png"
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

# The threshold is a quiet, tapered, source-textured loam clearing rather than
# a light point. It broadens with the same four states and stays behind the
# parted spruces. A single retained floor cell, rather than a large opaque loam
# crop, keeps the finished opening visibly porous at native scale: it reads as
# a narrow path through the trees rather than a flat dark 32-pixel panel.
magick "$repo_dir/assets/moonwell-art/production/moonwell-loam-base-tiles-v1.png" -crop '16x16+16+0' +repage -filter point \
  -resize '32x40!' -background '#24463f' -alpha remove -alpha off \
  -modulate '124,63,100' -fill '#b58550' -colorize 30% "$work_dir/route-path-base.png"
for spec in 'closed:4:6:8:76' 'opening:7:10:14:86' 'revealed:10:14:18:96' 'open:12:16:22:108'; do
  state=${spec%%:*}
  rest=${spec#*:}
  mouth=${rest%%:*}
  rest=${rest#*:}
  middle=${rest%%:*}
  rest=${rest#*:}
  apron=${rest%%:*}
  light=${rest#*:}
  top_left=$(((32-mouth)/2))
  top_right=$((top_left+mouth-1))
  middle_left=$(((32-middle)/2))
  middle_right=$((middle_left+middle-1))
  apron_left=$(((32-apron)/2))
  apron_right=$((apron_left+apron-1))
  foot_left=$((apron_left+2))
  foot_right=$((apron_right-2))
  magick -size 32x40 xc:black -fill white \
    -draw "polygon $top_left,14 $top_right,14 $middle_right,24 $((apron_right-1)),30 $apron_right,33 $((foot_right-1)),36 $foot_right,38 $((foot_right-2)),39 $foot_left,39 $((foot_left+1)),36 $((apron_left+1)),34 $apron_left,32 $((middle_left+1)),25 $middle_left,24" \
    "$work_dir/route-mask-$state.png"
  magick "$work_dir/route-path-base.png" -modulate "$light,100,100" \
    "$work_dir/route-path-$state.png"
  magick "$work_dir/route-path-$state.png" "$work_dir/route-mask-$state.png" \
    -alpha off -compose copyopacity -composite \
    -fill '#a66d3c' -draw 'point 16,20 point 15,27 point 17,33' \
    "$work_dir/exit-$state.png"
done
magick "$work_dir/exit-closed.png" "$work_dir/exit-opening.png" \
  "$work_dir/exit-revealed.png" "$work_dir/exit-open.png" +append +repage \
  -strip -define png:exclude-chunk=date,time PNG32:"$production/moonwell-exit-clearing-states-v5.png"

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
for asset in moonwell-route-opening-overhang-v1.png moonwell-exit-clearing-states-v5.png moonwell-moonroot-shores-v1.png; do
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
