// Comment on NDC-2799 with the 14 Nov recheck, attach the 2 annotated images, move to Bug. node post-2799.js [--post]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(','));
const ki = rows[0].findIndex(h => /secret key/i.test(h)); const KEY = rows[1][ki >= 0 ? ki : rows[0].length - 1].trim();
const WS = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy'; const B = WS + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' }; const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const IMG = ['BP-Z10-reply-trigger-has-no-public-private-filter-vs-zoho.png', 'BP-Z7-no-widget-item-in-transition-form.png'];
const html = `<p><strong>Recheck on NDC-Staging, 14 Nov 2026</strong>: moved to Bug because 2 items are still missing.<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge + API, account ndc-staging-owner (owner). Test blueprints, tickets and a QA business-hours set were created for the check and deleted after.</p>
<p><strong>Now built and working</strong> (can come off this list)</p>
<ul>
<li><strong>Item 11, several escalation levels per state:</strong> the state panel has "Escalation levels" with Level 1, 2 and more. Each level has When (before, at or after the limit), Send to (ticket owner, transition owners, teams, agents) and a template. Tried on a ticket with a 2-minute limit and 3 levels: the reminder came at 09:45:03, and the two escalations at 09:46:04 and 09:47:06 (UTC), one each.</li>
<li><strong>Item 12, business-hours set per state:</strong> the state panel has a "Business hours" list (the ticket's SLA hours, Default, or any set). Tried with a QA Monday-to-Friday set: a 2-hour limit started Saturday 11:43 Cairo was due Monday 02:00 Cairo. The same limit on calendar time was due Saturday 13:43.</li>
<li><strong>Item 10, rating part:</strong> "For these ratings: Good / Okay / Bad" works (checked 13 Nov on tickets #3465 to #3467).</li>
</ul>
<p><strong>Still missing</strong></p>
<ul>
<li><strong>Item 10, reply part:</strong> "When the customer replies, run" has no filter, so any customer reply runs the transition. Zoho: the Incoming Response trigger has its own filter ("All Threads", seen live 1 Nov); Zoho's API lists all, public and private replies. Image: ${IMG[0]}</li>
<li><strong>Item 7, widgets in the transition form:</strong> the During "Add item" list has Field, Checklist, Message, Reply to the contact, Internal comment, Attachment, Resolution, Submit for approval and Share, but no widget. Zoho: from its help pages only (1 widget per transition on Professional, 3 on Enterprise); not checked live because the Zoho test org has no extension installed. Image: ${IMG[1]}</li>
</ul>
<p>With the 13 Nov comment (items 8, 9, 13 and 14 built), these two are the only items left on this list.</p>`;
fs.writeFileSync(path.join(RUN, 'plane-2799-draft.html'), html);
if (process.argv[2] !== '--post') { console.log('draft written'); return; }
(async () => {
  const w = await (await fetch(`${WS}/work-items/NDC-2799/`, { headers: H })).json(); const id = w.id; const out = { id, stateBefore: w.state };
  const c = await fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: H, body: JSON.stringify({ comment_html: html }) }); out.comment = c.status;
  const u = await fetch(`${B}/work-items/${id}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ state: BUG }) }); out.state = u.status;
  out.attach = IMG.map(f => { try { execFileSync('node', [path.join(RUN, '../execu_2026-11-13_retest-mahmoudmohamed-r17/scripts/plane-attach.js'), id, path.join(RUN, 'evidence/annotated', f)]); return 'ok'; } catch (e) { return String(e.stderr || e.message).slice(0, 200); } });
  const r = await (await fetch(`${B}/work-items/${id}/`, { headers: H })).json(); out.stateAfter = r.state;
  const a = await (await fetch(`${B}/work-items/${id}/attachments/`, { headers: H })).json(); out.attachments = (Array.isArray(a) ? a : a.results || []).map(x => x.attributes?.name || x.name).filter(n => /BP-Z/.test(n || ''));
  fs.writeFileSync(path.join(RUN, 'plane-2799-posted.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})().catch(e => console.error('ERR', e.message));
