#!/bin/sh
set -eu

# Rebuild the complete browser, iOS, Android, and maskable icon family from
# the retained image-generation source. ImageMagick 7+ is required.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
source="$repo_dir/assets/generated/moonwell-home-screen-icon-source-v1.png"
output="$repo_dir/assets/moonwell-art/app-icon"
qa_output="$repo_dir/artifacts/qa"

"$repo_dir/scripts/process-home-screen-icon-source.sh"

mkdir -p "$output"
mkdir -p "$qa_output"

render() {
  size="$1"
  target="$2"
  magick "$source" -resize "${size}x${size}" -depth 8 \
    -fill '#071421' -opaque '#07050f' \
    -fill '#0a1925' -opaque '#0a0916' \
    -fill '#0d1722' -opaque '#0e040a' \
    -fill '#0d1724' -opaque '#0d0711' \
    -strip \
    -define png:exclude-chunk=date,time "$output/$target"
}

render 1024 moonwell-home-screen-icon-1024.png
render 512 moonwell-home-screen-icon-512.png
render 192 moonwell-home-screen-icon-192.png
render 180 moonwell-apple-touch-icon-180.png
render 32 moonwell-favicon-32.png
render 16 moonwell-favicon-16.png

# The source's central Luna + moonwell composition occupies less than Android
# maskable's central safe zone; retain its opaque forest bleed for all masks.
render 512 moonwell-maskable-512.png

magick "$output/moonwell-favicon-16.png" "$output/moonwell-favicon-32.png" \
  -strip "$repo_dir/favicon.ico"

# Retained visual proof: the primary icon plus native small-size equivalents.
magick \
  \( "$output/moonwell-home-screen-icon-512.png" -resize 224x224 -gravity center -background '#06182a' -extent 256x256 \) \
  \( "$output/moonwell-home-screen-icon-192.png" -resize 128x128 -gravity center -background '#06182a' -extent 192x256 \) \
  \( "$output/moonwell-favicon-32.png" -filter point -resize 96x96 -gravity center -background '#06182a' -extent 128x256 \) \
  \( "$output/moonwell-favicon-16.png" -filter point -resize 64x64 -gravity center -background '#06182a' -extent 128x256 \) \
  +append -strip -define png:exclude-chunk=date,time "$qa_output/moonwell-home-screen-icon-scale-proof.png"

printf '%s\n' "Rebuilt Moonwell home-screen icon family in $output"
