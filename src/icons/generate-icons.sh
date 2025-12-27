#!/bin/bash
# Generate placeholder icons using ImageMagick
# These are simple colored squares with text

for size in 16 48 128; do
  convert -size ${size}x${size} xc:#4285f4 \
    -gravity center \
    -pointsize $((size / 3)) \
    -fill white \
    -annotate +0+0 "NTS" \
    "icon${size}.png"
done
