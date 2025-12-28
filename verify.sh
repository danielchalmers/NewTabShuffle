#!/bin/bash

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found"
  exit 1
fi

# Check for key files in dist
FILES=("manifest.json" "newtab/index.html" "options/index.html")

for FILE in "${FILES[@]}"; do
  if [ ! -f "dist/$FILE" ]; then
    echo "Error: dist/$FILE not found"
    exit 1
  fi
done

echo "Build verification successful!"
exit 0
