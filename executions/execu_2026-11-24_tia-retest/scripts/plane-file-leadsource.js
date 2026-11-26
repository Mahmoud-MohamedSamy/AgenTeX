// Files retest drafts 12–16 to Plane (NDC), adds module + Sprint 17, attaches annotated images, posts 4 comments.
// The API key is read from the newest Downloads secret-key CSV and never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const title="TIA Assistant | Tia says CRM assignment rules need a lead source condition";
const html="<p><strong>Summary</strong></p><p>When you ask Tia to create a CRM assignment rule that sends every new lead to one person, Tia refuses and says assignment rules need a lead source condition. That is not true: CRM assignment rules can have no condition at all.</p><p><strong>Steps to reproduce</strong></p><ol><li><p>Sign in to NDC-Staging as the Owner and open CRM.</p></li><li><p>Open Tia, start a new chat and send: i want you to create assignment rule</p></li><li><p>Reply: for leads, assign every new lead to Sara</p></li></ol><p><strong>Expected result</strong></p><p>Tia says there is no user called Sara and asks who to assign the leads to. It offers a rule with no condition, which CRM allows (for example the active lead rule \"test\" has no condition and assigns every new lead to one user).</p><p><strong>Actual result</strong></p><p>Tia replied: \"The system cannot create an assignment rule that assigns every new lead to Sara without a lead source condition. The available assignment rule templates require specifying a lead source to assign leads.\"</p><ul><li><p>Existing CRM lead rules \"test\", \"RVW\" and \"test33\" have no condition; the others use first name or name. None of the rules checked uses lead source.</p></li><li><p>Tia also never says that no user named Sara exists (0 of 10 CRM users). Related: NDC-3341.</p></li><li><p>Seen once, in one chat.</p></li></ul><p><strong>Account</strong></p><p>Owner.</p><p><strong>Environment</strong></p><p>NDC-Staging (staging-crm.taviportal.com), Tia v15, Tia chat API (the same calls the Tia panel makes), 26 Nov 2026. The test chat was deleted; no rule was created.</p>";
(async () => {
  const ex = await req('GET', '/work-items/?per_page=100&order_by=-created_at'); if ((ex.j?.results || []).some(x => x.name === title)) return console.log('already exists');
  const c = await req('POST', '/work-items/', { name: title, description_html: html, priority: 'medium', state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-26' });
  if (c.s >= 300) return console.log('ERR', c.s, c.t);
  const id = c.j.id; const out = { ndc: 'NDC-' + c.j.sequence_id, id };
  out.module = (await req('POST', `/modules/${MOD.CRM}/module-issues/`, { issues: [id] })).s;
  out.cycle = (await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] })).s;
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-leadsource.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
