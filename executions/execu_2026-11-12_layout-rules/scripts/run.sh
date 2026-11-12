#!/usr/bin/env bash
# run.sh <crm|desk> <step.js> — prepends lib.js and runs as ndc-staging-owner (one token store per app lane)
cd "$(dirname "$0")"
APPN="$1"; STEP="$2"
cat lib.js "$STEP" > ".cur-$APPN.js"
LANE=$([ "$APPN" = desk ] && echo layoutdesk || echo layout)
APP="$APPN" LANE="$LANE" node api.js ndc-staging-owner ".cur-$APPN.js"
