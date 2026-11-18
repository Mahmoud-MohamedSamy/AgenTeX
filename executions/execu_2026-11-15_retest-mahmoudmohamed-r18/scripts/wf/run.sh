#!/bin/sh
# usage: sh wf/run.sh wf/<script>.js   (from scripts/)
CODE="$(cat wf/lib.js "$1")" APP=desk node apiw.js o -
