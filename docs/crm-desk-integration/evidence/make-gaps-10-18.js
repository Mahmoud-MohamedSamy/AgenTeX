// Gaps 10–15 and 18 (parity pass, 21 Oct 2026): TAVI request/response (left) vs Zoho docs (right).
// node make-gaps-10-18.js  -> work/<n>-api.json/.png, work/<n>.json, ./<n>-<slug>-vs-zoho.png
// Uses the renderers of the execution run (make-api-shot.js, make-evidence.js).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const TOOLS = path.resolve(__dirname, '../../../executions/execu_2026-10-20_crm-desk-integration/evidence/src');
const WORK = path.join(__dirname, 'work');
fs.mkdirSync(WORK, { recursive: true });
const S1 = 'https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/sales-and-marketing/articles/integrating-zoho-desk-with-zoho-crm';
const S3 = 'https://help.zoho.com/portal/en/kb/crm/integrations/zoho/zoho-desk/articles/zoho-desk-crm-integration';
const S4 = 'https://help.zoho.com/portal/en/kb/desk/faqs/integration/articles/faqs-zoho-desk-integration-with-zoho-crm';
const C2 = 'https://help.zoho.com/portal/en/community/topic/simple-way-to-add-support-contact-to-crm-leads-contacts-on-new-ticket';

const gaps = [
  { n: '10', slug: 'initial-sync-report', title: 'No report when the initial sync finishes',
    blocks: [{ head: 'Connect from the Desk settings screen (20 Oct 2026 15:32 UTC)', lines: ['runs: initial_customers finished, initial_contracts finished', { t: 'GET /notifications (owner) since connect -> []', box: 'no notice' }, 'UI strings (locale crm-desk-integration): no text for a finished-sync notice or report'] }],
    zoho: ['"After setup, admins get an email with counts of added, updated and ignored records and the reasons records were skipped."'], src: [S4],
    rows: [{ n: '1', b: 'Report when the initial sync is done', zoho: 'Email with counts and skip reasons', tavi: 'Nothing', match: 'Gap' }] },
  { n: '11', slug: 'lead-duplicated-as-contact', title: 'A Desk contact with a CRM Lead\'s email is created as a new CRM contact',
    blocks: [{ head: 'CRM Lead "QA CD Lead" (email E), then a Desk contact with the same email E', lines: ['POST /modules/{leads}/records -> 201', 'POST /modules/{desk contacts}/records {email: E} -> 201', { t: 'after 45 s: link {crm d87f4080 (new CONTACT), desk 0999003b, synced}', box: 'duplicate of the lead' }, 'Handshake for a ticket from E: crm_contact_or_lead (correct)'] }],
    zoho: ['"A Desk contact is not created as a CRM contact if the same person exists as a CRM Lead."', 'Source is a Zoho community answer, not the help docs.'], src: [C2],
    rows: [{ n: '1', b: 'Desk contact whose email is a CRM Lead', zoho: 'No CRM contact created', tavi: 'New CRM contact created', match: 'Gap' }] },
  { n: '12', slug: 'crm-users-light-agents', title: 'CRM users are not added to Desk as Light Agents (and cannot comment)',
    blocks: [{ head: 'CRM-only user nameb56175 (CRM profile "User")', lines: [{ t: 'GET /iam/me -> profiles_by_app: { crm: [User] }   (no Desk profile)', box: 'not a Light Agent' }, 'GET tickets/for-record (CRM card) -> 200 (can view)', 'POST /desk/tickets/{id}/close -> 403, PATCH ticket -> 403 APP_KEY_NOT_ENTITLED (correct)', { t: 'POST /desk/tickets/{id}/comments -> 403 "Missing required permission desk:ticket:comment"', box: 'cannot comment' }] }],
    zoho: ['"On integration, CRM users are auto-added to Desk as Light Agents. They can be @mentioned in tickets and receive notifications."', '"CRM-only users can view tickets, priority, due date and assignee, and can only comment."'], src: [S1, S3],
    rows: [{ n: '1', b: 'CRM users become Light Agents', zoho: 'Automatically', tavi: 'No', match: 'Gap' }, { n: '2', b: 'CRM-only user comments on a ticket', zoho: 'Allowed', tavi: '403', match: 'Gap' }] },
  { n: '13', slug: 'crm-contact-owner-mention', title: 'No "@CRM Contact Owner" mention',
    blocks: [{ head: 'GET /desk/integrations/crm/mentionable-users', lines: ['kind agent: 10 users; kind crm_user: 6 users', { t: 'no "CRM Contact Owner" entry', box: 'missing' }, '@mention of a named CRM user reaches their CRM bell (works): desk.ticket.mention "You were mentioned on ticket #350"'] }],
    zoho: ['"Mentioning @CRM Contact Owner in a ticket comment notifies that contact\'s owner in CRM via Signals."'], src: [S1],
    rows: [{ n: '1', b: '@CRM Contact Owner in a comment', zoho: 'Notifies the contact owner', tavi: 'Not offered', match: 'Gap' }] },
  { n: '14', slug: 'act-from-notification', title: 'Desk notifications in CRM can only open the record',
    taviImg: path.resolve(__dirname, '../../../automation/target/evidence/parity/crm-bell.png'),
    zoho: ['Signals for New Ticket, Comment, Response, Overdue, Escalated, Rating: "Users can reply, comment or update from the signal."'], src: [S3],
    rows: [{ n: '1', b: 'Act on a Desk event from the CRM notification', zoho: 'Reply / comment / update in the signal', tavi: 'Click opens the record', match: 'Gap' }] },
  { n: '15', slug: 'integrated-user-inactive', title: 'No handling when the integrated user becomes inactive',
    blocks: [{ head: 'GET /desk/integrations/crm/config → status.integrated_user', lines: ['{user_id: 97be04b6-…, name: ndc-staging-owner}', { t: 'UI strings: no message or action for an inactive / removed integrated user', box: 'missing' }, 'Not testable on staging without deactivating the owner account'] }],
    zoho: ['"If the admin whose login powers the integration leaves or becomes inactive, Desk prompts the other users to either update to an active user\'s details or deactivate and recreate the integration."'], src: [S3],
    rows: [{ n: '1', b: 'Integrated user inactive', zoho: 'Prompt to re-point', tavi: 'No handling found', match: 'Gap' }] },
  { n: '18', slug: 'twelve-month-window', title: 'The 12-month window of the first sync is not stated',
    blocks: [{ head: 'Connect dialog and Overview (UI strings)', lines: [{ t: '"Connecting seeds the default field mappings and starts the initial customer import, followed by the contract import."', box: 'no time window' }, 'Behaviour not testable: staging has no CRM records older than 12 months'] }],
    zoho: ['"Only the records created or modified in the last year will be synced." (shown on the configuration screen)'], src: [S1],
    rows: [{ n: '1', b: 'Initial-sync window stated', zoho: 'Last 1 year, on screen', tavi: 'Not stated', match: 'Gap' }] },
];

for (const g of gaps) {
  let img = g.taviImg;
  if (g.blocks) {
    const shot = { out: `${g.n}-api.png`, title: `Gap ${g.n} · TAVI request/response (staging, 20–21 Oct 2026)`, blocks: g.blocks };
    fs.writeFileSync(path.join(WORK, `${g.n}-api.json`), JSON.stringify(shot, null, 1));
    execFileSync('node', [path.join(TOOLS, 'make-api-shot.js'), path.join(WORK, `${g.n}-api.json`)], { stdio: 'inherit' });
    img = `${g.n}-api.png`;
  } else {
    fs.copyFileSync(img, path.join(WORK, `${g.n}-tavi.png`));
    img = `${g.n}-tavi.png`;
  }
  const cfg = { out: `../${g.n}-${g.slug}-vs-zoho.png`, id: `Gap ${g.n}`, title: g.title, verdict: 'Gap', date: '21 Oct 2026',
    subtitle: 'TAVI CRM / Desk (staging, tenant NDC-Staging) vs Zoho help docs',
    panels: [{ side: 'TAVI', caption: 'What TAVI does', img }, { side: 'Zoho', caption: 'Zoho behaviour', text: g.zoho, sources: g.src, flag: 'ZOHO DOCS — not seen on screen' }],
    rows: g.rows, notes: [] };
  fs.writeFileSync(path.join(WORK, `${g.n}.json`), JSON.stringify(cfg, null, 1));
  execFileSync('node', [path.join(TOOLS, 'make-evidence.js'), path.join(WORK, `${g.n}.json`)], { stdio: 'inherit' });
}
console.log('done', gaps.length);
