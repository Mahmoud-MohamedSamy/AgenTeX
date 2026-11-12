# Zoho CRM Scoring Rules — reference inventory (12 Nov 2026)

Sources: official Zoho help and API v8 docs (read by a research agent), plus a read-only look at Zoho test org
org944965048 (Enterprise trial, to 17 Nov 2026). Nothing was saved in Zoho.

Key help pages:
- HELP  https://help.zoho.com/portal/en/kb/crm/automate-business-processes/scoring-rules/articles/multiple-scoring-rule
- ZIA   https://help.zoho.com/portal/en/kb/crm/automate-business-processes/scoring-rules/articles/scoring-rules-zia-scores
- WF    https://help.zoho.com/portal/en/kb/crm/automate-business-processes/workflows/articles/configuring-workflow-rules
- API   https://www.zoho.com/crm/developer/docs/api/v8/ (create-, update-, delete-scoring-rules, update-rule-status,
        clone-scoring-rule, execute-scoring-rules, get-entity-scores, get-signals)

## Seen live in Zoho (12 Nov 2026)
- Setup › Automation › Scoring Rules: empty list, one "New Scoring Rule" button, intro text
  "Scores are calculated based on the field values and your customer's interactions. If you have multiple departments
  in your organization, you can even set up multiple Scoring Rules."
- Create popup: Name, Type (Manual Score / Zia Score), Module (Leads, Contacts, Accounts, Deals — no custom modules
  in this org), Layout (Standard / All Layouts), Description; Cancel / Next.
- Editor: header chips "Leads - All Layouts", "Type - Manual Score", "Add Description"; box "Leads Fields › Add
  Criteria"; button "Add channel"; prompt "Would you like to add score fields to the records? Yes, proceed"; Save / Cancel.
- Screenshots: executions/execu_2026-11-12_crm-scoring-rules/evidence/zoho-intake/.

## Docs conflicts (settle live during execution)
- Rule limits: help says 10 rules per layout, 5 active; API table says Enterprise 25 active / 50 total per module.
- Score fields per rule: help says 6; API table says 30 on Enterprise+.
- Points: API says -100..100 per field or signal rule.

## A. Modules, editions, limits
1. Modules: Leads, Accounts, Contacts, Deals, custom modules (people-type included).
2. Signal (touchpoint) rules only on people modules (Leads, Contacts, people custom modules).
3. Touchpoint scores shown only for Leads/Contacts.
4. Rule targets one layout or All Layouts.
5. API limits table: Standard 1/1 rule, 10 criteria; Professional 1/1, 20; Enterprise 25 active / 50 total, 30 criteria;
   Ultimate 40/80, 50 criteria.
6. Score custom fields count against the module's integer custom-field limit.

## B. Creating a rule
7. Popup: Name (required, unique, max 25 chars), Type, Module, Layout, Description (max 500).
8. Optional record filter criteria: the rule scores only records that match.
9. Field rules: score + criteria group (AND/OR, nested); comparators equals, not_equal, starts_with, contains, in,
   greater/less (equal), between.
10. Channels / signal rules: Add channel › criteria › Add or Subtract › score. Factors support counts and time
    windows ("more than 10 email responses IN LAST 15 days"). Channels: Calls, Call insights, Campaigns, Email,
    Email insights, Desk, SalesIQ (missed chat), Survey, Facebook, X, Webinar, Backstage, WhatsApp, VOC, Deal insights.
11. Points -100..100, negative allowed; out of range → INVALID_DATA.
12. Validations: duplicate name/criteria (DUPLICATE_DATA), same criteria twice (ALREADY_USED), no rules
    (EXPECTED_FIELD_MISSING), field not in layout / score field in criteria (NOT_SUPPORTED), edition limits.

## C. Mechanics
13. Score recalculates when the record is modified; signal scores update on activity.
14. Automation order: Assignment › Review › Scoring › Workflow; scoring runs twice so the score reflects actions.
15. On create/edit: "Update Old Record?" → Update old records / Continue without updating (records created or
    modified in the last 6 months). Duration-based rules update old records by default.
16. Backfill ("Update old records", "Run Scoring Rule") does not trigger workflows.
17. Each rule keeps its own scores per record (Entity Scores: one row per rule).
18. Score values: Positive, Negative, Touchpoint +/−, Total Touchpoint, Total Score.
19. Score fields on the record are optional; mapping (label → score type) can't be edited after save; removed when
    the rule (or all rules) is deleted.
20. Deactivate keeps existing scores, stops new calculation; reactivate resumes.
21. Delete removes the rule's scores and score fields; blocked while a lookup filter / custom field uses the score field.
22. Clone: More › Clone.

## D. Where scores appear
23. Record detail: "Scoring Rules" section showing each active rule's values and a graph.
24. No native per-criterion breakdown (per-rule only).
25. List views, reports: through the mapped score fields (inferred: number fields).

## E. Automation
26. Workflow "Score" trigger: Increased / Decreased / Updated, optional condition.
27. Zia Score is a separate type (not part of manual parity).

## F. Permissions
28. "Manage Automation" profile permission; API scopes ZohoCRM.settings.scoring_rules.*, entity_scores.READ.

## G. API
29. GET/POST/PUT/DELETE /settings/automation/scoring_rules[/{id}] (list filters: module, layout_id, active, name).
30. PUT|DELETE …/{id}/actions/activate; POST …/{id}/actions/clone.
31. PUT /{module}/actions/run_scoring_rules (async job, last 6 months).
32. GET /{module}/{id}/Entity_Scores__s?fields=…
33. GET /settings/signals.

## H. List page
34. Search by name, filter by status, status toggle per row, More › Clone / Delete.
