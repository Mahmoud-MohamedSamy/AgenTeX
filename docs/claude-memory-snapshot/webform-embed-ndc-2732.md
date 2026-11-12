---
name: webform-embed-ndc-2732
description: "Jam ffd66840 (29 Oct 2026) web form \"Test your form\" 404 — hosted link nginx 404 on NDC-1488, iframe session 500 filed as NDC-2732"
metadata:
  node_type: memory
  type: project
  originSessionId: 6de892e3-bc75-4040-ba17-363a0e9ed779
  modified: 2026-10-29T13:47:46.954Z
---

Jam ffd66840 (29 Oct 2026, reporter noles40331): Web Forms › Embed code › "Test your form" → 404. Two causes:
- Hosted link `/embed/feedback/f/<key>` → raw nginx 404 (no fallback route). Tracked on NDC-1488 (Web Form, state Bug); commented 29 Oct. Same class as [[blueprint-revert-ndc-2730]]-era NDC-2634 portal nginx 404 (fixed 28 Oct, covered `/portal/` only).
- iframe `/embed/feedback/index.html?key=…&mode=frame` loads, but `POST /api/v1/web-forms/public/<key>/session` → 500 INTERNAL_ERROR (bogus key → clean 404). Filed NDC-2732, High, Bug, CRM, Sprint 13, same assignees as NDC-2634. Regression vs Wave 4 (26–27 Oct).

**Why:** retests of NDC-2732/NDC-1488 should re-hit both URLs and the session POST.
**How to apply:** retest = curl hosted link (expect 200 app page) + session POST (expect 200 with session_token) + load iframe in signed-out browser. See [[retest-means-full-feature]].

1 Nov 2026: iframe works again (session 200; NDC-2732 moved by a dev). Potential Leads is in tenant **Anyware** (…0002), not unreachable. Script embed ("Add it to your website") blocked by CORS on any outside site — session API only sends Access-Control-Allow-Origin for staging-crm itself → filed NDC-2751 (High, Bug, CRM+Desk, Sprint 14, image attached via plane-attach with secret-key-1793537440144.csv). Desk forms load from staging-crm by design (staging-desk serves no /embed/). Anyware owner relogin crashed twice ("Page crashed") on 1 Nov.
