# UI automation — Selenium 4 · TestNG · Allure · self-healing locators

```
./mvnw test -Dsuite=selftest -Dheadless=true      # prove self-healing offline
./mvnw test -Dtags=NDC-1234                        # retest one bug
./mvnw test -Dfeature=<name> -Dtags=regression     # a feature's regression
./mvnw allure:report                               # target/site/allure-maven-plugin/index.html
```
(PowerShell / cmd: `.\mvnw.cmd …`)

- Each feature: `src/main/java/qa/features/<f>/` (pages, API helper), `src/test/java/qa/features/<f>/` (tests),
  `src/test/resources/features/<f>/` (`locators.json`, `testdata.json`, `feature-map.md`, `zoho/` references).
- Locators have ranked fallbacks; a fallback that works is promoted in `locators.json` (review with `git diff`).
  Every heal/broken locator: `target/healing/healing-report.json`. Per-test results: `target/run-summary.json`.
- Failed tests only: screenshot + app-vs-reference image in `target/evidence/`.
- Secrets: never in `config.properties`. Use `config.local.properties`, env vars, or the gitignored credentials file. Sessions are cached in `.auth/` (gitignored).
