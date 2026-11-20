#!/bin/bash
# usage: ar.sh <who> <script.js>  — prepends lib.js, runs through apiw-me.js (who = own | tu1 ...)
D="$(cd "$(dirname "$0")" && pwd)"; T="$D/.run-$$.js"; cat "$D/lib.js" "$2" > "$T"
cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/scripts" && node apiw-me.js "$1" "$T"; rc=$?; rm -f "$T"; exit $rc
