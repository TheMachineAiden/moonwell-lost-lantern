#!/bin/sh
set -eu

# Rebuilds the v2 overhanging forest family from the retained generated sources.
# ImageMagick 7+ is required. Crops are intentionally fixed: runtime and tests
# treat the packed dimensions below as part of the visual/logical contract.
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
generated="$repo_dir/assets/generated"
production="$repo_dir/assets/moonwell-art/production"
work_dir=$(mktemp -d "${TMPDIR:-/var/tmp}/moonwell-luminous.XXXXXX")

key_alpha() {
  magick "$1" -alpha on -fuzz "$2" -transparent "$3" "$4"
}

environment="$generated/moonwell-luminous-forest-production-source-v2.png"
eir="$generated/moonwell-eir-rootwatcher-sprite-source-v1.png"
portrait="$generated/moonwell-eir-rootwatcher-portrait-source-v1.png"
exit_source="$generated/moonwell-selected-forest-production-source-v1.png"

key_alpha "$environment" 6% '#f00bec' "$work_dir/environment.png"
key_alpha "$eir" 6% '#e50be9' "$work_dir/eir.png"
key_alpha "$exit_source" 6% '#eb0bcc' "$work_dir/exit.png"

# The generated sheets are laid out in source cells with generous key-field
# gutters. Crop each object independently before packing so gutters never
# become transparent seams in the runtime strips.
for i in 0 1 2 3 4 5; do
  x=$((i * 256))
  magick "$work_dir/environment.png" -crop "256x336+${x}+0" +repage -filter point -resize 80x112! "$work_dir/tree-$i.png"
done
magick "$work_dir/tree-0.png" "$work_dir/tree-1.png" "$work_dir/tree-2.png" "$work_dir/tree-3.png" "$work_dir/tree-4.png" "$work_dir/tree-5.png" +append +repage "$production/moonwell-spruce-overhang-v2.png"

for i in 0 1; do
  x=$((i * 768))
  magick "$work_dir/environment.png" -crop "768x304+${x}+336" +repage -filter point -resize 256x112! "$work_dir/canopy-$i.png"
done
magick "$work_dir/canopy-0.png" "$work_dir/canopy-1.png" +append +repage "$production/moonwell-canopy-curtains-v1.png"

for i in 0 1 2 3; do
  x=$((i * 384))
  magick "$work_dir/environment.png" -crop "384x208+${x}+624" +repage -filter point -resize 128x96! "$work_dir/loam-$i.png"
done
magick "$work_dir/loam-0.png" "$work_dir/loam-1.png" "$work_dir/loam-2.png" "$work_dir/loam-3.png" +append +repage "$production/moonwell-loam-patches-v1.png"

for i in 0 1 2; do
  x=$((i * 256))
  magick "$work_dir/environment.png" -crop "256x192+${x}+832" +repage -filter point -resize 128x96! "$work_dir/moon-$i.png"
done
magick "$work_dir/moon-0.png" "$work_dir/moon-1.png" "$work_dir/moon-2.png" +append +repage "$production/moonwell-moonlight-pools-v2.png"

for i in 0 1; do
  x=$((768 + i * 384))
  magick "$work_dir/environment.png" -crop "384x192+${x}+832" +repage -filter point -resize 128x48! "$work_dir/platform-$i.png"
done
magick "$work_dir/platform-0.png" "$work_dir/platform-1.png" +append +repage "$production/moonwell-root-platform-overhang-v1.png"

for i in 0 1 2 3; do
  x=$((i * 470))
  magick "$work_dir/eir.png" -crop "470x836+${x}+0" +repage -filter point -resize 64x96! "$work_dir/eir-$i.png"
done
magick "$work_dir/eir-0.png" "$work_dir/eir-1.png" "$work_dir/eir-2.png" "$work_dir/eir-3.png" +append +repage "$production/moonwell-eir-rootwatcher-idle-v1.png"

for i in 0 1 2 3; do
  x=$((128 + i * 256))
  magick "$work_dir/exit.png" -crop "256x248+${x}+228" +repage -filter point -resize 80x112! "$work_dir/exit-$i.png"
done
magick "$work_dir/exit-0.png" "$work_dir/exit-1.png" "$work_dir/exit-2.png" "$work_dir/exit-3.png" +append +repage "$production/moonwell-crescent-exit-overhang-v3.png"

magick "$portrait" -resize 512x512! "$production/moonwell-eir-rootwatcher-portrait-v1.png"

printf '%s\n' "Rebuilt luminous Moonwell production art in $production"
printf '%s\n' "Temporary keyed intermediates retained at $work_dir"
