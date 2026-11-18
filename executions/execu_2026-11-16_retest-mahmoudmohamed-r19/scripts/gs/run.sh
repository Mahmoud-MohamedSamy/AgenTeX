#!/bin/sh
# usage: sh gs/run.sh gs/step.js   (from RUN/scripts)
cd "$(dirname "$0")/.." && cat gs/common.js "$1" > gs/_cur.js && APP=crm node apiw.js o gs/_cur.js
