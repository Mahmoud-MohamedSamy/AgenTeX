---
name: selenium-automation-framework
description: Java Selenium/TestNG/Allure framework in automation/ (skill selenium-test-automation); user wants every tested feature saved as reusable page/test/locator files
metadata:
  node_type: memory
  type: project
  originSessionId: 32d9504d-ca46-4ce4-8ed7-14cf54231a39
  modified: 2026-10-11T14:35:21.914Z
---

Built 11 Oct 2026 at the user's request: skill `~/.claude/skills/selenium-test-automation` (template in assets/framework, scripts init-framework.js / scaffold-feature.js / inventory.js) and the framework in `automation/` (package `qa.*`, Selenium 4.49 — 4.27's driver host is dead; Edge default; mvnw, no global Maven; no Python on this machine).
User choices: Java + Selenium + TestNG (not JS), Allure, auto-update healing (promote fallback in locators.json), framework inside this repo, pilot = Desk Workflow Rules (`features/deskworkflowrules`, tests for NDC-2203/2204/2205/2206).
State (12 Oct 2026): LIVE on staging https://staging-desk.taviportal.com with `docs/Credentials/TAVI Staging Desk Credentials.csv` (account ndc-staging-owner; the earlier .txt/anyware combo was rejected). Login tests LGN-001..004 + Workflow Rules smoke WFR-001/002 pass. Token = cookie aw_staging_access_token (5-min, rotating refresh) — see automation features/login/feature-map.md. Bug tests NDC-2204/2205/2206 NOT run live yet: user said read-only only until they give a separate OK. Skill eval iteration 2 not run.

**Why:** user wants retests/regression to reuse saved automation instead of re-exploring.
**How to apply:** for any test/retest of a feature, use the skill: inventory → feature-map.md → run by tag (`./mvnw test -Dtags=NDC-xxxx`). Always state the step-by-step plan and get confirmation before working (user's explicit preference). Never loop logins. Related: [[desk-workflow-rules-intake]], [[annotate-evidence-vs-zoho]].
