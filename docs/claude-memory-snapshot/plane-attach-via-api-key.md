---
name: plane-attach-via-api-key
description: "How to attach local images to Plane work items without a public file host (user's Plane API key in Downloads)"
metadata:
  node_type: memory
  type: reference
  originSessionId: fdfff7bc-3587-435e-8867-5ab09c26bf29
  modified: 2026-11-01T14:41:36.014Z
---

The Plane MCP can only attach from a public URL, and uploads to public hosts (uguu, litterbox) are blocked by the permission check. Instead use the user's Plane API key: `C:/Users/Dell/Downloads/secret-key-1792931401453.csv` (header Title,Description,Expiry,Secret key; key in column 4, starts "plane_"; never print it). The user said to use it (26 Oct 2026). That key expired 30 Oct; on 1 Nov the user created `secret-key-1793537440144.csv` (expires 1 Dec 2026) — on this machine (user a) the file is at `D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv` (user pointed to it 12 Nov); otherwise pick the newest secret-key-*.csv in Downloads (check the expiry column, never print column 4). Node 24 prints a harmless libuv "Assertion failed" on exit.

Flow (works, 26 Oct 2026): POST https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/<pid>/work-items/<id>/attachments/ {name,type,size} → POST the file to `upload_data.url` with `upload_data.fields` → PATCH …/attachments/<asset_id>/ {is_uploaded:true}. Script: scratchpad plane-attach.js (`node plane-attach.js <workItemId> <file>`); copy it into the execution folder's scripts when the scratchpad is gone. Read back with workitem_attachment list.

Related: [[annotate-evidence-vs-zoho]]
