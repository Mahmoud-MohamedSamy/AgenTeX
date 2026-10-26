#!/usr/bin/env bash
# Uploads the 5 annotated evidence images to uguu.se (public for ~3 h) and prints one link per ticket,
# so Claude can attach them to Plane with workitem_attachment upload_from_url.
cd "$(dirname "$0")/../evidence/annotated" || exit 1
for t in NDC-2542 NDC-2543 NDC-2545 NDC-2546 NDC-2547; do
  printf '%s ' "$t"; curl -s -F "files[]=@$t-vs-zoho.png" https://uguu.se/upload | grep -o '"url":"[^"]*"'
done
