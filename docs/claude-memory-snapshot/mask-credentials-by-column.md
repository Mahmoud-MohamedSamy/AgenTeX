---
name: mask-credentials-by-column
description: "When inspecting any credentials file, never print cell values chosen by content (e.g. \"contains @\") — passwords contain @; print only column count/lengths, mask by column index"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 3b03ac4f-1ce1-4a04-9337-4cb90e2010e4
  modified: 2026-11-11T09:44:21.166Z
---

Never inspect a credentials file (CSV/JSON/xlsx in docs/Credentials) by printing cells that "look like" usernames or URLs. On 3 Nov 2026 a "contains @" check printed the TAVI Desk Credentials.csv password column (passwords contain @) — the second such leak in two days (the first was the JSON file).

**Why:** every leak means the user has to rotate passwords; content-based masking fails on real passwords.

**How to apply:** to learn a file's layout print only row count, column count and cell lengths (`<n>`), never values. Read the header by column index only when you know row 0 is a header. Convert to the login CSV (name,url,username,password) in one script that writes a file and prints nothing but a count. Related: [[one-owner-signin-per-run]].

API responses too: on 11 Nov 2026 an invite response printed `invitation_token` because the mask listed key names (`token`, `link`) instead of matching them. Return only whitelisted fields (status, ids) from scripts. The desk-automation-order `scripts/api.js` now masks any key containing token/secret/password/api_key and JWTs in everything it prints; copy that `redact` when making a new helper.
