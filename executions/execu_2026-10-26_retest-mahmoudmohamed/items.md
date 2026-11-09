# NDC-2203 — DESK Workflow Missings · retest 26 Oct 2026

Ticket uuid 2f7deb90-a42b-43ea-b910-41b4cb4d8114 · urgent · Desk › Workflow Rules · staging-desk.taviportal.com
Developer note (26 Oct 10:41 UTC, 82cf7a79): all items deployed except Custom Functions (→ NDC-1989, "Run Custom Action" instead) and Cliq (N/A, Slack/Teams/Google Chat instead).
User at Gate 1: retest all; QA contact with reachable email OK; QA data OK (cleanup at end); shared settings (chat/WhatsApp connections, business hours, holidays) = (a) test only what is already configured.

| # | Group | Item | Verdict | Proof |
|---|---|---|---|---|
| A1 | Trigger | Customer Reply | | |
| A2 | Trigger | Agent Response | | |
| A3 | Trigger | Comment | | |
| A4 | Trigger | Private Thread (incoming / outgoing / both) | | |
| A5 | Trigger | Happiness Rating (all / good / okay / bad) | | |
| B1 | Action | Add Comment (public / private) | | |
| B2 | Action | Send Email Reply | | |
| B3 | Action | Reply via Instant Messaging | | |
| B4 | Action | Notify via Instant Messaging | | |
| B5 | Action | Add Followers | | |
| B6 | Action | Mark as Spam | | |
| B7 | Action | Share Ticket | | |
| B8 | Action | Change Layout | | |
| B9 | Action | Custom Functions (→ Run Custom Action) | | |
| B10 | Action | Send Cliq Notification (→ Slack / Teams / Google Chat) | | |
| B11 | Action | Add Skills | | |
| B12 | Action | Remove Skills | | |
| B13 | Action | Recalculate Skills | | |
| B14 | Action | Reassign based on Skills | | |
| D1 | Partial | Assign Tickets: team, round robin, load balancing | | |
| D2 | Partial | Email alerts: templates; users / teams / roles / contact | | |
| D3 | Partial | Field Changed: up to 3 fields | | |
| D4 | Partial | Field Changed: All / Any | | |
| E1 | Condition | Contact and Account fields | | |
| E2 | Condition | Execution Time (business hours / holiday) | | |
| E3 | Condition | 20 missing ticket fields (+ Recent Comment, Type, Is Escalated, Is Overdue, # Threads / Comments) | | |
| E4 | Condition | "doesn't contain" | | |
| E5 | Condition | "between" / "not between" (dates) | | |
| E6 | Condition | "Current Time" as a date value | | |
| F1 | Other | Saved actions cover the new actions | | |
| F2 | Other | Department-scoped rules | | |
| F3 | Other | Active / Inactive tabs | | |
| F4 | Other | Ticket History names the rule | | |
