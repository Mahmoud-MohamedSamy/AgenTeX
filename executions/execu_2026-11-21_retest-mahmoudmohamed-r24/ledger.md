# r24 data ledger (21 Nov 2026) — clean once at end of round
## Desk (staging-desk)
- RR rule "QA RT24 3137 closure" db05d8b9 (QA AO Dept B) — delete
- Tickets #5971 b749a731, #5972 784fd278, #5973 5fbc97e2, #5974 f35f862d (3137) — delete + purge
- QA AO Dept B round-robin preferences — RESTORED 21 Nov (same=true); backup out/3137-base.json
- Blueprints QA RT24 BP PRIV a20f7e78, PUB c18b1e05, ALL c657c9b4, DEF 968030c2 (Customer Support) — deactivate + delete
- Tickets #5975 88c09ac2, #5976 20db8ab8, #5977 dc1637f2, #5978 a3399498, #5979 fa60321e (2799) — delete + purge
- Contact "QA RT24 BP customer" (CRM contacts module used by Desk 43004ce2) — delete
- Desk web form "QA RT24 3138 desk empty" eee94506 — delete
- Ticket #5980 189f62cd (3138 embed) + its contact (qa.rt24.3138@example.com) — delete
## CRM (staging-crm)
- Web forms "QA RT24 2822 A" c9156d42, "QA RT24 2822 NEG3" (id by name), "QA RT24 3138 crm empty" eeadb2f7 — delete
- Leads QA RT24 c3 098ac96c, c5 6bb5b97d, f3 cee077f9, f4 ec3d7452, fe 3aa84834, "QA RT24 3138 crm" 6598c861 — delete + purge (and their uploaded files)
## Local
- node static server on 127.0.0.1:5500 (scratchpad/site), keeper.js — stop at end; delete scratchpad r18-o.json
- Desk tickets #5981 #5982 #5983 (Gmail replies without ticket tag, 2799) — delete
- Desk contact "QA RT24 BP customer2" (qa.rt24.bp2@example.com) + tickets #5984 PRIV2, #5985 PUB2, #5986 ALL3, #5987 DEF2 (2799 private-thread tests) — delete
- Desk tickets #5988-#5991 (Gmail private answers, match None, 2799) — delete

## CLEANUP 21 Nov 2026 (~19:00 UTC) — DONE
- Desk: RR rule db05d8b9 204; blueprints PRIV/PUB/ALL/DEF 204 (after bin purge); web form "QA RT24 3138 desk empty" 204; tickets #5971–#5991 (21) 204; contacts QA RT24 BP customer / customer2 / 3138 desk 204; recycle bin 25 + 4 items purged → 0 QA RT24 left.
- CRM: web forms 2822 A, 2822 NEG3, 3138 crm empty 204; leads 6 × 204; recycle bin 9 purged → 0 left.
- QA AO Dept B RR preferences restored earlier (same=true).
- Local: scratchpad sign-in state deleted; keeper and 127.0.0.1:5500 server already stopped.
