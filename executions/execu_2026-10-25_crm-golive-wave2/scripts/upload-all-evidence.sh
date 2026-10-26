#!/usr/bin/env bash
# Uploads every annotated evidence image of Waves 1 and 2 to litterbox.catbox.moe (public link, kept 72 h) and writes
# ticket -> link pairs to evidence-links.txt next to this script, so Claude can attach them in Plane (upload_from_url).
cd "$(dirname "$0")" || exit 1
OUT="$PWD/evidence-links.txt"; : > "$OUT"
for dir in ../../execu_2026-10-25_crm-golive-wave1/evidence/annotated ../evidence/annotated; do
  for f in "$dir"/*.png; do
    [ -e "$f" ] || continue
    url=$(curl -s -F "reqtype=fileupload" -F "time=72h" -F "fileToUpload=@$f" https://litterbox.catbox.moe/resources/internals/api.php)
    echo "$(basename "$f") $url" | tee -a "$OUT"
  done
done
echo "done: $(wc -l < "$OUT") files -> $OUT"
