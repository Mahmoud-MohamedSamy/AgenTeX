// Execution plan for the Desk Blueprint regression (step 2 of 3). Rendered by make-plan-html.js.
// phaseOf(case) assigns every case in cases.json to exactly one phase.
const BROWSER_TYPES = new Set(['UI', 'UX', 'i18n', 'Accessibility', 'Compatibility']);
const BROWSER_GROUPS = new Set(['LS', 'UX']);
const phaseOf = c => {
  if (c.group === 'RG') return 'P1';
  if (c.group === 'E2E') return 'P5';
  if (c.needs) return 'P4';
  if (c.group === 'PF') return 'P3';
  if (BROWSER_TYPES.has(c.type) || BROWSER_GROUPS.has(c.group) || c.group === 'RS' || c.group === 'DO') return 'P3';
  if (c.group === 'ZP') return 'P6';
  return 'P2';
};

const phases = [
  { id: 'P0', name: 'Prepare', time: '~1 h', how: 'API (owner)', body: [
    'Fresh baseline into the run folder: blueprints (all departments), ticket statuses, departments, business hours + holiday lists, Customer Happiness, direct-assignment switch, workflow rule count (paged by name, the list stops at 50), SLA policies.',
    'Create department "QA BP Reg Dept". Members: owner, Agent A (Desk Agent), Agent B (Desk Admin), CES 1 + CES 2 (Supervisors), one Light Agent / view-only member. Agent C stays in Tech for cross-department cases. Team "QA BP Reg Team" (Agent B + CES 1).',
    'Test data: contact "QA BP Reg Customer" on the +qae1 Gmail address (Help Center invite, used on 15 Nov), email template "QA BP Reg template", webhook.site inbox, safe custom action "QA BP echo" (own API source, as on 13 Nov), status "QA BP Verify" (Open type) and "QA BP Done" (Closed type).',
    'Guard: every QA blueprint gets entry criterion Subject starts with "QA BP R " and department QA BP Reg Dept. Tickets use that prefix. Never Priority High unless the case needs it: a teammate\'s rule "AC-07…" acts on High tickets in all departments.',
    'Refresh the build hash (bundle index-*.js). If it changed since 24 Nov, diff the Blueprint strings and add or drop cases before Phase 1.',
  ] },
  { id: 'P1', name: 'Fast regression sweep', time: '~1.5 h', how: 'Existing automation + API scripts', body: [
    'Point the Java suite automation/…/deskblueprint (61 tests: Run, Admin, Timer, UiBug, Phase2Api, Screen, Smoke) and the a6 API helpers (a6/lib-bp.js) at the new department, then run them class by class (staging drops long runs).',
    'Each of the 53 RG cases gets PASS (still fixed) or FAIL. A FAIL is retested once on fresh data before it counts.',
    'Result: early warning on regressions before the long runs. I send you a short note if any Done ticket fails.',
  ] },
  { id: 'P2', name: 'Feature cases through the API', time: '~6 h', how: 'API scripts, 2 lanes', body: [
    'Lane A (designer, owner token): DT, SM, CV, TB, TU, TF, ST, PI, VR, API. Save checks, refusals, issue codes, stored values. Each blueprint built, checked and deleted inside its case.',
    'Lane B (tickets, owner + agent tokens): EN, RN, TM, IN. Real tickets run through real blueprints. Timer cases use minute limits and are batched, so 10 timers wait together, not one after another.',
    'Lanes never share a blueprint. Only lane B activates blueprints in the department, so entry order stays predictable.',
    'Every case that shows a message also gets a screen check in Phase 3, because the API does not prove the UI text.',
  ] },
  { id: 'P3', name: 'Screens', time: '~5 h', how: 'Browser (Playwright, Edge), one sign-in per account', body: [
    'List, designer, ticket Steps card and forms, dynamic owners dialog, views, dashboard, Approvals page, Recycle Bin, Audit Log.',
    'Visual layer at 1366, 1920 and 390 px; Arabic pass; keyboard-only pass; Chrome and Firefox for the designer and the ticket form.',
    'As Agent A, Agent B, Light Agent and Agent C for the permission and cross-department screens.',
    'Performance cases: big blueprint (30 states, 80 transitions), 500-ticket include and revoke, Steps card load time.',
  ] },
  { id: 'P4', name: 'Customer and shared settings', time: '~2.5 h', how: 'Browser as customer + API', body: [
    'Customer replies through the Help Center portal as "QA BP Reg Customer" (Gmail replies from the main address are untrusted). Ratings through the ticket\'s rating link.',
    'Business hours: one window of ~15 min with the default set at Mon–Fri plus one holiday, then restored and diffed field by field. Due times compared only once settled (not provisional).',
    'Customer Happiness: on for QA BP Reg Dept only, off after.',
    'Email delivery checked in the +qae1 Gmail inbox and mmohamed@anyware.software. I ask you to check the inbox only if a mail can\'t be confirmed another way.',
    'Webhook and custom-action cases against the webhook.site inbox and "QA BP echo".',
  ] },
  { id: 'P5', name: 'End-to-end journeys', time: '~2 h', how: 'Browser + API, agents as real users', body: [
    'The 8 journeys run in the browser as the people in them (admin builds, customer writes, Agent A and B act). API only to read state and history.',
  ] },
  { id: 'P6', name: 'Failures, Zoho and report', time: '~2 h', how: 'API + browser + live Zoho', body: [
    'Every FAIL retested on fresh data. A fail that doesn\'t reproduce becomes INCONCLUSIVE, not FAIL.',
    'Zoho check on the 7 Zoho-tagged cases and on every FAIL where Zoho has the behaviour: your org techegysolutions, headed Edge, throwaway records deleted and the Recycle Bin purged after.',
    'Annotated image per FAIL, TAVI next to Zoho (or "Zoho not checked live"). Passed cases get one line of text.',
    'Results go onto this page (results card + a pill per case). Plane drafts in "Feature | Title" format, not filed.',
  ] },
  { id: 'P7', name: 'Cleanup and proof', time: '~0.5 h', how: 'API', body: [
    'Revoke and delete every QA BP blueprint, purge it from the Recycle Bin. Delete QA tickets, tasks, contact, template, custom action and API source, team, statuses, then the department (transfer to Customer Support if asked).',
    'Diff against the Phase 0 baseline. The only allowed differences are ones you agreed to. Each one is listed on the page.',
  ] },
];

const gates = [
  ['Gate A', 'After Phase 1', 'Short note: which Done tickets regressed. I continue unless you say stop.'],
  ['Gate B', 'Before Phase 4', 'Only if you have not answered the shared-settings question. Business hours and Customer Happiness are not touched without your OK.'],
  ['Gate C', 'After Phase 6', 'Report and Plane drafts on this page. You pick what to file. Nothing goes to Plane before that.'],
];

const rules = [
  'NDC-Staging only, department QA BP Reg Dept only. The Demo blueprints and other people\'s departments are never touched.',
  'One sign-in per account for the whole run; tokens reused from the token store; never print credential files (lengths only).',
  'At most 2 lanes at once. On HTTP 429 or a staging outage: stop, wait, resume. A network error is retried once, then marked INCONCLUSIVE.',
  'Never run the real NDC booking custom actions; never switch auto-archive on; never assign QA tickets away from the admin more than a case needs (each one leaves a ticket only the owner can delete).',
  'Assignment and timers are asynchronous: poll blueprint-state up to 2 min past the due time instead of fixed sleeps.',
  'Verdicts: PASS, FAIL, FINDING (works but differs from Zoho or is unclear), PARTIAL, BLOCKED (needs something we don\'t have), INCONCLUSIVE, N/A.',
  'Progress is written to executions/execu_2026-11-24_desk-bp-regression/PROGRESS.md and results.jsonl after each group, so a stop can resume where it left off.',
];

const decisions = [
  ['Zoho writes', 'Throwaway blueprints and tickets in your Zoho org techegysolutions for the 7 Zoho cases and for fails, all deleted after. Without it those become "Zoho not checked live".'],
  ['Shared settings', 'Default business hours Mon–Fri + one holiday for ~15 min, and Customer Happiness on for the QA department only. Without it 5 cases are BLOCKED (TM-06..08, TM-13, E2E-06).'],
  ['Out of scope', 'Mobile apps, SMS, AI and CRM-only bugs stay out unless you say otherwise.'],
  ['Second tenant', 'AC-09 and API-02 need a token from another tenant to prove it cannot read or change NDC-Staging blueprints. You asked me on 2 Nov to leave Anyware-Staging alone: may I use its owner token for read-only cross-tenant calls (nothing is written in Anyware)? Without it both are BLOCKED.'],
  ['Automation kept', 'Should I save the new API and browser checks as reusable automation (extending the deskblueprint suite), or run them as throwaway scripts like the Workflow Rules regression? Saving adds ~3 h now and makes the next retest much faster.'],
];

module.exports = { phaseOf, phases, gates, rules, decisions };
