# Existing automation coverage of the Desk specs

Counted 8 Nov 2026 by matching case ids in source files. No test was run. "Covered" means a test or script is tagged with the row's id. It does not mean the test passes on today's build.

## Totals

| Spec | Rows | Covered | Uncertain | Not covered |
|---|---|---|---|---|
| `docs/desk-assignment-rules/spec-v2-assignment-rules-skills.md` | 114 | 66 | 14 | 34 |
| `docs/desk-workflow-rules/spec-desk-workflow-rules.md` | 237 | 107 | 9 | 121 |
| `docs/desk-blueprint/spec-desk-blueprint.md` | 195 | 77 | 19 | 99 |
| **Total** | **546** | **250** | **42** | **254** |

## How I counted

**Rows.** A row is a table row whose first cell is a case id.
- Assignment: `A-01`..`J-04` and `E2E-1..3`. The 5 setup rows `S-1..5` are not counted. This spec has no Group Z.
- Workflow and Blueprint: groups A-O (A-N for Blueprint), Z and `E2E-n`. API, field-register and traceability tables are not counted.

**Assignment** (`executions/execu_2026-11-06_desk-assignment-skills/scripts`).
- Covered: the id is the key of a `cs('<id>', ...)` call. `D-09/10` counts for both rows.
- Uncertain: the id appears only in a comment or string of a script, or the `cs` key is a requirement id that maps to the row (`EO-2`, `EO-3`, `EO-4/5`, `NF-3`).
- Not scanned for case ids: `env.sh`, `login.js`, `plane*`, report builders and helpers.

**Workflow and Blueprint** (the two Java packages).
- Covered: the id is in a `@CaseId` on a `@Test`. `WFR-Z01` is read as `Z1`.
- Uncertain: see the lists below.
- Ids that map to no spec row were ignored: `WFR-001`, `002`, `012`, `013`, `020`, `031`, `WFR-API-T1..3`, `BP-001`, and the `NDC-*` tags.

## Per-group detail

Group letters with counts, as covered / rows.

| Spec | Detail |
|---|---|
| Assignment | A 5/15, B 6/9, C 3/8, D 12/17, E 12/19, F 12/14, G 3/6, H 10/14, I 0/5, J 0/4, E2E 3/3 |
| Workflow | A 2/11, B 7/14, C 1/10, D 2/12, E 3/16, F 7/24, G 4/10, H 19/20, I 26/33, J 9/11, K 7/10, L 2/6, M 3/8, N 0/5, O 0/13, E2E 0/6, Z 15/28 |
| Blueprint | A 3/11, B 3/11, C 10/23, D 2/10, E 7/14, F 5/10, G 8/11, H 5/12, I 10/15, J 7/15, K 9/17, L 4/8, M 1/6, N 3/11, E2E 0/6, Z 0/15 |

## Uncertain rows

**Assignment (14)**
- Named in a script but not a `cs` key: A-11, A-12, B-06, B-07, B-08, D-14, E-03, G-06, H-09, J-04.
- Requirement-keyed `cs` only: D-15, D-16, D-17, I-03.

**Workflow (9)**
- Z2, Z3, Z4, Z5 are named in the description of the `WFR-Z01` test, which asserts all five triggers, but are not tagged.
- Z15, Z19, Z20, Z21, Z22 are named in the description of the `WFR-Z14` test in the same way.

**Blueprint (19)**
- F3, F6: `BlueprintPhase2ApiTest` always ends with `SkipException`, because the actor and ticket owner are the same account.
- 15 rows tagged only in `BlueprintScreenTest`: C1, C7, C21, C22, C23, E1, E9, E10, G1, G10, K16, N1, N5, N6, N7. The spec's run status says this class was 5/10 passing on 2 Nov with test fixes pending, and does not say which five.
- J9: only a variant tag `BP-J9b`.
- N11: named in `BlueprintScreenTest` but not tagged.

## Not covered by id, but tested before

The 34 assignment rows with no id in a script still have results in `report.md`, for example A-01, C-01, H-04, I-01. The report's method line says browser checks were done in `scripts/ui*.js`. Those scripts mostly carry no case ids, so I did not count them. Inferred: many of these rows are exercised by a UI script, but finding which one means reading each script.

## Limits on "could be run"

Observed in the source:

1. **The assignment scripts do not judge results.** `cs` stores whatever the function returns, and none of the `g*.js` scripts contains an assert or a PASS / FAIL. Verdicts in `report.md` were made by reading the output.
2. **The assignment scripts depend on a past run.** `lib.js` loads `out/ids.json` from that run. `ledger.md` records QA data being deleted, so some ids may be gone. A re-run may need `setup1.js` first, and the scripts change tenant settings and tickets.
3. **Parity tests invert on purpose.** `WorkflowParityGapsTest` says it fails while a gap is open and passes once built. Today's bundle shows most of those gaps built, so these may now pass (inferred, not run). Its text checks use English labels, so a wording change can fail a test even if the feature exists.
4. **Inconclusive skips.** 23 lines in the two Java packages mention `SkipException` (imports included), mostly for a control rule that did not fire or a missing precondition. For example, `WorkflowHijTest` needs "QA WF Layout" from `WorkflowDiagTest#qaLayoutSetup`. A covered row can come back skipped.
5. **Record rows.** `WorkflowHijTest` prints `[RECORD]` for rows with no fixed expectation and passes them. They are counted as covered but check nothing.
6. **`WorkflowDiagTest`** has 15 `@Test` methods and no `@CaseId` (setup and probes), so it adds no coverage.

Inferred:

7. **The Workflow spec is from 12 Oct and the Blueprint spec from 1 Nov.** `gap-recheck-existing-features.md` shows most gaps built since then. Spec rows and tests written for the older screens may have stale expectations, such as trigger panels and action lists. Expect some covered rows to fail for that reason, not because of a product bug.
8. **No test reaches the new features as functions.** Blueprint Group Z has no automation at all. Workflow Group Z tests only check that an option is offered, not that it runs.
