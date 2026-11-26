#!/bin/bash
# Runs all phases in order; stops on session loss.
O=../out
step() { echo "=== $1 $(date -u +%T)" >> $O/run-all.log; shift; "$@" >> $O/run-all.log 2>&1; if grep -q "SESSION LOST" $O/run-all.log; then echo "STOPPED: session lost" >> $O/run-all.log; exit 3; fi; }
step "ops build" env SPEC=ops node fx.js build.js crm
step "crm matrix recs" env SPEC=matrix node fx.js recs.js crm
step "crm ops recs" env SPEC=ops node fx.js recs.js crm
step "crm use" node fx.js use.js crm
step "desk build" env DESK=1 SPEC=matrix node fx.js build.js desk
step "desk split" env DESK=1 node fx.js split2.js desk
step "desk recs" env DESK=1 SPEC=matrix node fx.js recs.js desk
step "check crm matrix" env SPEC=matrix node fx.js check2.js crm
step "check crm ops" env SPEC=ops node fx.js check2.js crm
step "check crm import" env SPEC=matrix FILE=recs-crm-import.json node fx.js check2.js crm
step "check desk matrix" env DESK=1 SPEC=matrix node fx.js check2.js desk
echo "=== DONE $(date -u +%T)" >> $O/run-all.log
