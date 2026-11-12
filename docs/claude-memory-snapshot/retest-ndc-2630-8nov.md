---
name: retest-ndc-2630-8nov
description: NDC-2630 failed email shown as sent, retested PASS 8 Nov on NDC-Staging; comment drafted, not posted, QA lead not cleaned
metadata:
  type: project
---

9 Nov: user approved post+Done, but ticket was moved to In Progress by dev (9 Nov 10:19) so NOT posted; lead + drafts cleaned. 8 Nov 2026: NDC-2630 retest PASS on NDC-Staging (folder executions/execu_2026-11-08_retest-ndc2630, draft plane-draft-2630.html, NOT posted; ticket in state Bug). A Zoho anyware.software connection without zoid exists again, so the original case is testable. Successful send → EmailSent not checked (no sender can send). Lead cac2e850 "QA RT13 2630 lead" still live.

**Why:** waiting for the user's decision on posting and state. **How to apply:** post only after approval, then clean up from ledger.md. To reach a failed send on screen when Send is disabled, override /emails/sendability with page.route in the test browser only and say so. Related: [[retest-ready-tickets-skill]].
