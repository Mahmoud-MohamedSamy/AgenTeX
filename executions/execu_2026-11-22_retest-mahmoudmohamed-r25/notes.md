# Retest r25 — 22 Nov 2026 — NDC-2837, NDC-2997 (regression)
| Ticket | Verdict | Notes |
|---|---|---|
| NDC-2997 | PASS (regression; was already Done) | mgrQAO DT2,TU1,DT2,TU1; prQAO DT2×3; ouQAO/prEmpty Skipped w/ reason; ouCS Skipped because CES1/CES2 moved out of CEO (setup); seq 3 tickets × 5 edits = 5 runs each, alternation 9/9; History #6230 5 runs + 5 owner changes. POSTED 10:37 Cairo: comment + NDC-2997-retest-PASS.png (attach verified). State stayed Done. |
| NDC-2837 | FAIL → Bug (posted 10:51 Cairo, comment + NDC-2837-retest-FAIL.png) | inbound-health 404; no Last email received; round trip OK (#6235 reply 08:40:30Z); 9 Nov reply became #5992 (noted as "differs from dev note") |
- 08:40:30Z customer reply landed on #6235 (HeaderChain, untrusted DKIM). Overview reload 08:47Z: still 404, "We could not check", no Last email received.
- Another session (owner account) bulk-deleted CS tickets 08:32:54Z incl. #6214-6216 (ouCS); #1 Check-in and #5992 now 404 too (not by me).
- NDC-2837 verdict FAIL; image NDC-2837-retest-FAIL.png built; Gate 2 draft shown, waiting approval.
- 10:51 Cairo POSTED NDC-2837: comment + state Bug + NDC-2837-retest-FAIL.png (attach 200/204/204). Cleanup done (see ledger). Round CLOSED.

## NDC-2799 retest (added 22 Nov, user asked after round close)
- Dev moved 2799 back to RFT 05:46 Cairo (mail #58 + desk #275 deployed). Re-signed in once, keeper restarted.
- Negatives: 'xyz' → 422 not a reply thread; threads without reply transition → 422. Blueprints QA RT25 BP PRIV/PUB/ALL/DEF saved (private/public/all/none).
- Tickets On Hold: customer (Gmail contact) #6252 CPRIV, #6253 CPUB, #6254 CALL; third party (contact example.com, Forward private to Gmail) #6255 FPRIV, #6256 FPUB, #6257 FALL, #6258 FDEF.
- 09:13Z 3 customer replies + 4 private Forwards sent to Gmail (201, sent). Waiting for user's Gmail answers.
- Expected: CPRIV stays On Hold (no reopen); CPUB, CALL → Escalated; FPRIV, FALL answer joins ticket as private thread → Escalated; FPUB, FDEF answer joins ticket, no transition, stays On Hold; no new tickets.
- 09:17:25–09:17:50Z all 7 Gmail answers arrived (HeaderChain). Fix 1 PASS: 4 private answers joined their tickets as Private thread, 0 new tickets; FPRIV #6255 + FALL #6257 → Escalated; FPUB #6256 + FDEF #6258 stay On Hold. CPUB #6253, CALL #6254 → Escalated.
- Fix 2 FAIL: CPRIV #6252 customer reply 09:17:25Z → no transition, but 09:17:43Z status On Hold → Open (source engine); blueprint step Open. Same as 21 Nov.
- User asked owners → ndc-staging-owner: done via POST /desk/tickets/{id}/assign at 09:17:54–09:18:09Z (PATCH owner → 422 OWNERSHIP_MANAGED_BY_DESK). After the reopen, not its cause.
- Private answers show "Unverified sender" (sender_not_entitled, gmail.com) — info only.
- Image NDC-2799-retest-FAIL.png built. Verdict FAIL → Bug (draft to user).
- 11:30 Cairo POSTED NDC-2799: comment (Passed / Failed sections) + state Bug + NDC-2799-retest-FAIL.png (attach 200/204/204). Cleanup done, all zero.

## Recheck after Desk build restored (22 Nov, 12:30 Cairo)
- Devs: 07:54–09:35Z another team's upgrade ran an old Desk build → both fails. Both back to RFT.
- 2837: inbound-health 200 (10:31Z last 10:17:34Z → 10:41Z last 10:35:52Z = Gmail reply); Overview "Mail is arriving", "Last email received 8 minutes ago". PASS. Not checked: red state (mail waiting) — cannot force.
- 2799: #6300 CPRIV (Private thread answers) customer reply 10:35:52Z → no transition, no status change, On Hold 6+ min. #6301 CPUB → Escalated 10:35:53Z. PASS. Item 7 widgets still blocked → Done vs keep = user decision.
- Images NDC-2799-retest-PASS.png, NDC-2837-retest-PASS.png. Data to clean: blueprints QA RT25B BP PRIV/PUB, contact QA RT25B BP customer, tickets #6300/#6301.
- 12:48 Cairo POSTED NDC-2837 → Done + PASS comment + NDC-2837-retest-PASS.png. 2799 waiting on user (item 7 question).
- 12:50 Cairo POSTED NDC-2799 → Done + PASS comment + NDC-2799-retest-PASS.png (user chose Done; item 7 noted as blocked). Cleanup zero. CLOSED.
