---
name: tavi-extras-not-bugs
description: TAVI features that go beyond Zoho are pluses, not bugs — don't file parity bugs for extra capabilities
metadata:
  type: feedback
---

When TAVI offers something Zoho does not (an extra capability that works), treat it as a plus and do not file it as a bug or a parity gap. Example: multi-select / radio button fields using a CRM global set. Zoho blocks this for multi-select; TAVI allows it and handles it correctly. NDC-2923 was filed, then deleted from Plane on 11 Nov 2026 (it no longer exists).

**Why:** the user said "ignore this behavior even if it doesn't exist in zoho this is a plus in TAVI".
**How to apply:** list such items as "TAVI extra" in reports. Only file them if the extra is broken, or if it causes a real problem (data loss, a security hole). Related: [[crm-global-sets-intake]], [[annotate-evidence-vs-zoho]].
