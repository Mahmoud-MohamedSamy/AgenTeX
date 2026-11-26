// Files drafts P7-1..2 and posts comments C6..C7. Key read from Downloads CSV, never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'NDC-Staging (staging-crm.taviportal.com), Tia v27 (baseline settings), Edge and the Tia API, 26 Nov 2026, Owner account. Test data deleted afterwards.';
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const bugs = [
 { title: 'Tia | An expired card disappears from the chat without saying it expired', pri: 'low', mods: ['CRM'],
   summary: 'A card that is not answered within 15 minutes expires. When the user opens that chat again, the card is gone with no explanation, while Tia\'s text above it still asks the user to confirm.',
   steps: ['Sign in to CRM as the Owner and open Tia.', 'Send: Create a lead with first name "QA TIA EXP card" and last name "Expired". Prepare the card for me to confirm.', 'Do not press Confirm or Cancel. Wait 15 minutes.', 'Open the chat again from Past chats.'],
   expected: 'The card is still shown, marked as expired, with no Confirm button and a short note such as "This request has expired. Ask Tia again."',
   actual: 'The card is gone. The chat still shows Tia\'s text "I have prepared the lead card… If you confirm, the lead will be created in the system.", with nothing to confirm and no note that it expired.',
   more: ['A card that has not expired does show Confirm and Cancel when the chat is reopened from Past chats.', 'Confirming the expired card through the API is refused correctly: 409 TIA_ACTION_EXPIRED. No lead was created.'] },
 { title: 'Tia | Knowledge base: an unsupported file type is accepted and only fails later, and deleted files stay listed in Tia\'s settings', pri: 'low', mods: ['CRM'],
   summary: 'Tia\'s knowledge base supports PDF, Markdown and text files. The upload screen blocks other types, but the server accepts them and fails later. Deleting a document also leaves it listed in Tia\'s settings.',
   steps: ['Upload a CSV file and register it as a Tia knowledge-base document (POST /agents/kb/documents with its file_id).', 'Check the document status in the knowledge-base list.', 'Register a supported file (for example a .txt), add it to Tia\'s knowledge base and deploy.', 'Delete that document (DELETE /agents/kb/documents/{id}) and read Tia\'s settings.'],
   expected: 'The CSV is refused when it is registered, with a message that only PDF, Markdown and text are supported. Deleting a document also removes it from Tia\'s knowledge-base list.',
   actual: 'The CSV is accepted (200) and later shows status "failed". After the document is deleted, its id is still in Tia\'s kb_document_ids.',
   more: ['Tia stops using a deleted file at once, so the effect is on the settings only.', 'Working as expected: TXT, Markdown and PDF were processed and answered 3 of 3; a 21 MB file is refused with "Knowledge-base documents are capped at 20MB."'] },
];
const comments = [
 ['NDC-3336', ['Seen again on 26 Nov: in Analytics, "Which dashboards can I see? List their names." got "You can see these dashboards: test, QA RT19 GS Sort report, QA RT19 GS Gold report, and QA RT18 2917 Gold report."', 'Those are the 4 reports. The Owner has 1 dashboard, "Anyware Dashboard" (GET /reporting/dashboards).']],
 ['NDC-3358', ['With the report open in Analytics (page context), "Explain this report" now gives the right grand total, 5,533,912,086,090, but still says "This report has at least 17 rows".', 'A follow-up, "What is the grand total of the Amount column in this report?", got "…is at least 5,533,912,086,090. There are more rows in the report, so this is not the final total", although that is the report\'s grand total (73 deals).']],
];
(async () => {
  const out = { created: [], comments: [] };
  const recent = []; for (let p = 1; p <= 2; p++) { const r = await req('GET', `/work-items/?per_page=100&order_by=-created_at${p > 1 && recent.next ? '&cursor=' + recent.next : ''}`); recent.push(...(r.j?.results || [])); recent.next = r.j?.next_cursor; if (!r.j?.next_page_results) break; }
  const titles = new Set(recent.map(x => x.name)); const bySeq = Object.fromEntries(recent.map(x => ['NDC-' + x.sequence_id, x.id]));
  Object.assign(bySeq, { 'NDC-3283': '41983e8e-7880-47af-8723-a2f8d74998f5', 'NDC-3286': 'd2c7492b-5310-47b7-9f18-d366c5ad028a' });
  for (const b of bugs) {
    if (titles.has(b.title)) { out.created.push({ t: b.title.slice(0, 40), skipped: 'exists' }); continue; }
    const html = `<p><strong>Summary</strong></p><p>${e(b.summary)}</p><p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${e(s)}</p></li>`).join('')}</ol><p><strong>Expected result</strong></p><p>${e(b.expected)}</p><p><strong>Actual result</strong></p><p>${e(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li><p>${e(m)}</p></li>`).join('')}</ul>` : ''}<p><strong>Account</strong></p><p>Owner.</p><p><strong>Environment</strong></p><p>${e(ENV)}</p>`;
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html, priority: b.pri, state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-26' });
    if (c.s >= 300) { out.created.push({ t: b.title.slice(0, 40), err: c.s + ' ' + c.t }); continue; }
    const id = c.j.id; const row = { ndc: 'NDC-' + c.j.sequence_id, id, t: b.title.slice(0, 50), mods: [] };
    for (const m of b.mods) row.mods.push((await req('POST', `/modules/${MOD[m]}/module-issues/`, { issues: [id] })).s);
    row.cycle = (await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] })).s; out.created.push(row);
  }
  for (const [ndc, paras] of comments) {
    let id = bySeq[ndc]; if (!id) { const r0 = await fetch('https://api.plane.so/api/v1/workspaces/ahmed-hegazy/work-items/' + ndc + '/', { headers: H }); if (r0.ok) id = (await r0.json()).id; } if (!id) { out.comments.push({ ndc, err: 'id not found' }); continue; }
    const r = await req('POST', `/work-items/${id}/comments/`, { comment_html: paras.map(p => `<p>${e(p)}</p>`).join('') }); out.comments.push({ ndc, s: r.s });
  }
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-p7.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
