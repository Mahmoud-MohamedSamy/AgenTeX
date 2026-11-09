#!/usr/bin/env bash
# ui.sh <playwright-cli args...>  — runs one playwright-cli command in session w5 (owner), quietly.
R="D:/Software Testing/Automation/Agentex Installation/Agentex Installation"; cd "$R"
timeout ${TMO:-90} node node_modules/@playwright/cli/playwright-cli.js -s=${SESSION:-w5} "$@" 2>&1
