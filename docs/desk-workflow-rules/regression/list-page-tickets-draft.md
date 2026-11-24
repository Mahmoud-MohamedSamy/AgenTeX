# FILED 23 Nov 2026: Ticket 1 = NDC-3231, Ticket 2 = NDC-3232 (Sprint 17, Desk, screenshots attached)

# Workflow Rules list page — two ticket drafts (not filed)

Checked on the current build, 23 Nov 2026 (NDC-Staging, 56 rules). Duplicate search in Plane: none. The closest are NDC-3207 (list speed) and NDC-3119 (Execution History reachable from the app, Done).

---

## Ticket 1

| Field | Value |
|---|---|
| Title | Workflow Rules \| The rules list has no pagination: every rule loads on one page |
| Priority | Medium (suggested) |
| Labels | Workflow Rules |
| Assignees | MahmoudMohamed, mfathy, Hegazy |
| State / module / cycle | Bug · Desk · Sprint 17 |
| Related | NDC-3207 (rules list takes about a minute with ~200 rules) |

### Summary

The Workflow Rules list shows every rule on one long page. There are no page numbers, no next/previous, no rows-per-page choice and no "load more". With the limit of 200 rules per department, a tenant can have several hundred rules, so the page becomes very long and slow to load (NDC-3207).

### Steps to Reproduce

1. Go to **Settings → Automation → Workflow Rules**.
2. Scroll to the bottom of the list.

### Expected Result

- The list is paged: for example 25 or 50 rules per page, with page controls and a total count.
- Or the list loads more rules as you scroll.
- Search, filters and the All / Active / Inactive tabs keep working with the paging.

### Actual Result

- All 56 rules are shown on one page, and there is no paging control at the bottom.
- With 227 rules the first row took 49 seconds to appear, and all rows rendered at once (NDC-3207).

### Note

- The app already loads the rules from the server page by page (200 per request), then shows them all together.
- Reordering rules is only offered with a module filter. Paging should keep that working.

### Environment

- App: Anyware Desk (staging) — staging-desk.taviportal.com (NDC-Staging), owner account
- Microsoft Edge, Windows 10
- 23 Nov 2026

### Attachment

- Screenshots of the top and bottom of the list: U19-list-top.png, U19-list-bottom.png.

---

## Ticket 2

| Field | Value |
|---|---|
| Title | Workflow Rules \| No Execution History button on the Workflow Rules list page |
| Priority | Low (suggested) |
| Labels | Workflow Rules |
| Assignees | MahmoudMohamed, mfathy, Hegazy |
| State / module / cycle | Bug · Desk · Sprint 17 |
| Related | NDC-3119 (Done, Execution History not reachable from the app) |

### Summary

The Workflow Rules list page has no button to open Execution History. To see the runs of all rules, the admin has to leave the page and find **Execution History** in the Setup sidebar. From the list, only one rule's history can be opened, through that rule's **⋯** menu.

### Steps to Reproduce

1. Go to **Settings → Automation → Workflow Rules**.
2. Look at the page header and the toolbar above the list.
3. Open the **⋯** menu of any rule.

### Expected Result

The list page has an **Execution History** button (for example next to **New Rule**) that opens the history of all workflow rules, ideally keeping the module and department filters already chosen on the list.

### Actual Result

- The header has only **New Rule**. The toolbar has the search box, the module and department filters, and the All / Active / Inactive tabs.
- Execution History for all rules is only in the Setup sidebar (Automation → Execution History).
- Each rule's **⋯** menu has **Execution history**, which shows that one rule's runs only.

### Environment

- App: Anyware Desk (staging) — staging-desk.taviportal.com (NDC-Staging), owner account
- Microsoft Edge, Windows 10
- 23 Nov 2026

### Attachment

- Screenshots of the list header and the rule's ⋯ menu: U19-list-top.png, U19-row-menu.png.
