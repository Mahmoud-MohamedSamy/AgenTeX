# RT19 Notifications lane progress (16 Nov 2026) — DONE, handed back
Tools: scripts/ntf/lib.js + ntf/run.sh (owner via apiw), ntf/runs.sh + apiw-samy.js + ui-samy.js (Mahmoud Samy, scratchpad r19-ntf-samy.json, signed in once 12:20Z). Ids: scripts/ntf/out/ids.json.
| Ticket | Verdict | Evidence |
|---|---|---|
| NDC-2864 | PASS in app; email PENDING USER | annotated/NDC-2864-retest-PASS.png |
| NDC-3053 | PASS; inbox PENDING USER | annotated/NDC-3053-retest-PASS.png |
| NDC-2851 | PASS; inbox PENDING USER | annotated/NDC-2851-retest-PASS.png |
| NDC-3061 | PASS | annotated/NDC-3061-retest-PASS.png |
| NDC-3000 | rating link PASS; acks PENDING USER | annotated/NDC-3000-retest-PENDING.png |
Left for the user step (NDC-3000): QA RT19 NTF Dept (owner only), its hosted address qa-rt19-ntf, dept contact rules ack/reply-ack/closing ON. Blueprint 44f7305d off. Happiness restored (3 times, diff none). No locks held.

## 3000 user step
Support address (system receiving address of QA RT19 NTF Dept, active, receiving, verified): qa-rt19-ntf@help-staging.anyware.software
1. From the user's own Gmail, send a new email to qa-rt19-ntf@help-staging.anyware.software, subject "QA RT19 NTF 3000 ack test".
2. Expect: ticket in QA RT19 NTF Dept + ack "Re: QA RT19 NTF 3000 ack test [#<n>]" ("Thanks for getting in touch… it is now ticket #<n>").
3. Agent (owner) replies on the ticket; user replies to that email -> expect reply acknowledgement.
4. Optional: close with Happiness on for this dept (happiness.lock) -> closed email with Good/Okay/Bad links.
