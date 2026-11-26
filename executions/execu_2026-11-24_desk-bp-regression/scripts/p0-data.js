// Phase 0 test data. Every item recorded in ../made.json for cleanup. Safe to re-run (skips what exists).
const MADE = '../made.json';
const made = JSON.parse(fs.readFileSync(MADE, 'utf8')); made.other = made.other || [];
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const has = k => made.other.find(x => x.kind === k);
const rec = (kind, id, name, extra = {}) => { made.other.push({ kind, id, name, ...extra }); keep(); };
const E = r => r.s + (r.s >= 300 ? ' ' + JSON.stringify(r.j?.error || r.t).slice(0, 400) : '');
const DEPT = made.dept, AG_B = '2a7c1bc4-f6d4-4bd3-805e-0496ece13987', AG_A = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const f = (field, v) => ({ field, value: { kind: 'string', value: v } });
const o = {};

// 1 team
if (!has('team')) {
  const tl = (await api('GET', '/desk/teams')).j; o.teamListShape = Object.keys(tl?.data || {}).slice(0, 6);
  const r = await api('POST', '/desk/teams', { name: 'QA BP Reg Team', description: 'QA blueprint regression', department_id: DEPT, member_user_ids: [AG_B, AG_A] });
  o.team = E(r); if (r.j?.data?.id) rec('team', r.j.data.id, 'QA BP Reg Team');
} else o.team = 'exists';

// 2 contact (Help Center customer on the +qae1 Gmail address)
if (!has('contact')) {
  const r = await api('POST', `/modules/${CONTACTS}/records`, { data: [f('last_name', 'QA BP Reg Customer'), f('email', 'mahmoud.mmohamedsamy+qae1@gmail.com')] });
  o.contact = E(r); if (r.j?.data?.id) rec('contact', r.j.data.id, 'QA BP Reg Customer');
} else o.contact = 'exists';

// 3 statuses through Add State (Open type + Closed type)
for (const [name, type] of [['QA BP Verify', 'open'], ['QA BP Done', 'closed']]) {
  if (has('status:' + name)) continue;
  const st = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || [];
  if (st.find(s => s.value === name || s.label === name)) { o[name] = 'already in tenant (not ours, left alone)'; continue; }
  const r = await api('POST', '/desk/blueprints/states', { name, type }); o[name] = E(r);
  if (r.s < 300) rec('status:' + name, name, name, { type });
}

// 4 webhook.site inbox
if (!has('webhook')) {
  const w = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ default_status: 200, default_content: 'ok', expiry: false }) });
  const j = await w.json().catch(() => ({})); o.webhook = w.status + ' ' + (j.uuid ? 'ok' : 'no uuid');
  if (j.uuid) rec('webhook', j.uuid, 'webhook.site inbox', { url: 'https://webhook.site/' + j.uuid });
} else o.webhook = 'exists';

// 5 safe custom action "QA BP echo" -> POST to our webhook.site inbox
const wh = has('webhook');
if (wh && !has('ca_action')) {
  const P = '/' + wh.id + '/qa-bp-echo/{ref}';
  const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA BP Reg echo', version: '1.0' }, servers: [{ url: 'https://webhook.site' }], paths: { [P]: { post: { operationId: 'qaBpEcho', summary: 'QA BP echo', parameters: [{ name: 'ref', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { note: { type: 'string' } } } } } }, responses: { 200: { description: 'ok' } } } } } });
  let sid = (has('ca_source') || {}).id;
  if (!sid) { const s = await api('POST', '/workflow/custom-actions/sources', { name: 'QA BP Reg echo API', baseUrl: 'https://webhook.site', specFormat: 'openapi3', origin: 'paste', rawSpec: spec }); o.caSource = E(s); sid = s.j?.data?.id; if (sid) rec('ca_source', sid, 'QA BP Reg echo API'); }
  if (sid) {
    const a = await api('POST', '/workflow/custom-actions', { sourceId: sid, name: 'QA BP echo', description: 'QA BP regression echo to webhook.site', method: 'POST', path: P, targetApps: ['desk'], usageGuide: '', inputBindings: [{ name: 'ref', location: 'path', required: true, handling: 'runtime' }, { name: 'note', location: 'body', required: false, handling: 'runtime' }], dependencies: [], errorMappings: [], outputMappings: [] });
    o.caAction = E(a); const aid = a.j?.data?.id;
    if (aid) { rec('ca_action', aid, 'QA BP echo'); o.caPublish = (await api('POST', '/workflow/custom-actions/' + aid + '/publish')).s; }
  }
} else o.ca = has('ca_action') ? 'exists' : 'no webhook';

// 6 email template: find the list route first
for (const p of ['/email-templates', '/notifications/email-templates', '/desk/email-templates']) { const r = await api('GET', p); o['tpl ' + p] = r.s + ' ' + (r.s < 300 ? arr(r.j?.data).length + ' items' : ''); }
return o;
