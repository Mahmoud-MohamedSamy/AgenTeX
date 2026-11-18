#!/bin/bash
# usage: bash ac/run.sh <who> <script>   who=o uses apiw.js; others use ac/apia.js
cd "$(dirname "$0")/.."; W=$1; F=$2; cat ac/lib.js "$F" > ac/_x_$W.js
if [ "$W" = o ]; then APP=desk node apiw.js o ac/_x_$W.js; else APP=desk node ac/apia.js $W ac/_x_$W.js; fi
