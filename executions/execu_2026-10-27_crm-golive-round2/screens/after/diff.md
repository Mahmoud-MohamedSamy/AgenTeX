# Clean-up and diff — screen-checks lane (28 Oct 2026)

Baseline (baseline/snapshot.json, 07:17 UTC): 0 QA R2SC records anywhere, bin had no QA R2SC items.
Everything this lane created was QA R2SC-prefixed and removed at the end.

Removed:
- Leads: 3 attachment-holding leads (63a27a2d perf lead, d16b108c SVG-recheck lead, plus the suite's own AT/MD leads — each class cleaned itself).
- Kanban view "QA R2SC KB" on Transactions (204).
- Recycle-bin: 12 + 1 QA R2SC items purged.

After (after/diff.json, after/clean2.json):
- QA R2SC records: leads 0, contacts 0, deals 0, accounts 0, tasks 0, cases 0.
- QA R2SC bin items: 0.
- QA R2SC kanban views: 0.
- No tenant-wide change by this lane. Test user 2 language restored to English.

Changed on staging by someone else during the run:
- company time_zone: Africa/Cairo (baseline 07:17) -> UTC (final diff). Not this lane.
- business hours: unchanged (preset 24_7, 09:00-17:00).
