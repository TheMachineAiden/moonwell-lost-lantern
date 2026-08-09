#!/bin/sh
set -eu

# Builds four full-width lower-forest clusters from the retained no-violet
# spruce family.  The packed raster replaces the visible picket row while the
# existing twenty rooted bottom-edge collision records stay exactly where they
# are. Runtime only selects a map frame and draws this retained PNG.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
base="$repo_dir/assets/moonwell-art/production/moonwell-spruce-overhang-v3.png"
production="${MOONWELL_ART_OUTPUT:-$repo_dir/assets/moonwell-art/production}"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-bottom-forest.XXXXXX")
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$production"

cluster() {
  frame="$1"
  sequence="$2"
  panel="$work_dir/bottom-forest-$frame.png"
  canvas="$work_dir/bottom-forest-$frame-canvas.png"
  magick -size '320x64' xc:none "$canvas"
  index=0
  for record in $sequence; do
    set -- $(printf '%s' "$record" | tr ':' ' ')
    source_frame="$1" width="$2" height="$3" x="$4" y="$5" mirror="$6"
    sprite="$work_dir/bottom-$frame-$index.png"
    magick "$base" -crop "80x112+$((source_frame * 80))+0" +repage \
      -filter point -resize "${width}x${height}!" "$sprite"
    if [ "$mirror" = 1 ]; then magick "$sprite" -flop "$sprite"; fi
    magick "$canvas" "$sprite" -geometry "+${x}+${y}" -compose over -composite \
      -strip -define png:exclude-chunk=date,time PNG32:"$canvas"
    index=$((index + 1))
  done
  mv "$canvas" "$panel"
}

# Each panel overlaps differently sized retained silhouettes from 20 px before
# to 16 px beyond the world edge.  The repeated contact faces remain visual
# only: collision continues to be provided by the pre-existing bottom anchors.
cluster 0 '2:44:60:-20:4:0 0:38:54:8:10:1 1:42:58:32:6:0 2:36:52:58:12:1 0:40:57:80:7:0 1:44:55:105:9:1 0:36:59:132:5:1 2:42:53:156:11:0 1:39:60:180:4:0 0:43:56:204:8:1 2:37:54:230:10:0 1:41:58:252:6:1 0:44:52:276:12:0 2:38:57:300:7:1'
cluster 1 '1:42:58:-18:6:1 2:36:52:6:12:0 0:40:57:29:7:1 1:44:55:54:9:0 0:36:59:82:5:0 2:42:53:105:11:1 1:39:60:130:4:1 0:43:56:154:8:0 2:37:54:180:10:1 1:41:58:202:6:0 0:44:52:228:12:1 2:38:57:252:7:0 1:43:55:278:9:1 0:37:60:302:4:0'
cluster 2 '0:40:57:-20:7:0 1:44:55:5:9:1 0:36:59:33:5:1 2:42:53:56:11:0 1:39:60:82:4:0 0:43:56:106:8:1 2:37:54:132:10:0 1:41:58:154:6:1 0:44:52:180:12:0 2:38:57:204:7:1 1:43:55:230:9:0 0:37:60:254:4:1 2:41:54:278:10:0 1:36:58:302:6:1'
cluster 3 '2:36:52:-16:12:1 0:40:57:7:7:0 1:44:55:31:9:1 0:36:59:59:5:0 2:42:53:82:11:1 1:39:60:106:4:1 0:43:56:130:8:0 2:37:54:156:10:1 1:41:58:178:6:0 0:44:52:204:12:1 2:38:57:228:7:0 1:43:55:252:9:1 0:37:60:278:4:0 2:41:54:300:10:1'

magick "$work_dir/bottom-forest-0.png" "$work_dir/bottom-forest-1.png" \
  "$work_dir/bottom-forest-2.png" "$work_dir/bottom-forest-3.png" \
  +append +repage -strip -define png:exclude-chunk=date,time \
  PNG32:"$production/moonwell-bottom-forest-clusters-v1.png"

printf '%s\n' "Rebuilt bottom forest clusters at $production/moonwell-bottom-forest-clusters-v1.png"
