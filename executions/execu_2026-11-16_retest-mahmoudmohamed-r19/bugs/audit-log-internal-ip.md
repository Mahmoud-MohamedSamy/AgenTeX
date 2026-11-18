# Audit Log | Changes made in the web app show the server's internal address ::ffff:172.19.0.19 instead of the user's IP

**Summary**
Every change line in the Desk Audit Log (added, updated, published, deleted) shows IP ::ffff:172.19.0.19/128, an internal server address, for every user. Sign-in lines show the user's real public IP.

**Steps to Reproduce**
1. Sign in to Desk and change anything (edit a blueprint description, add a skill, edit a ticket field).
2. Open Setup › Audit Log.
3. Compare the IP under your change with the IP under your sign-in line.

**Expected Result**
- Each change line shows the IP of the user who made the change, the same as their sign-in line.

**Actual Result**
- Change lines show "IP ::ffff:172.19.0.19/128" for every user and every entity.
- GET /api/v1/audit/events: login/logout rows have the public IP (41.40.x.x, 41.44.x.x); desk created/updated rows have ::ffff:172.19.0.19/128 (48 of today's rows) or no IP.

**Environment**
staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner.

**Suggested priority**: Medium

**Related**: NDC-3029 (blueprint audit entries), NDC-3027

**Evidence**: screenshots/annotated/BUG-audit-log-internal-ip-FAIL.png (spec scripts/specs-bugs/BUG-audit-log-internal-ip.json)


