// SM-03 replies: find a working reply body on a control ticket, then check strict mode.
const EMAIL = 'mahmoud.mmohamedsamy+qae1@gmail.com';
const variants = [{ address: EMAIL }, { email: EMAIL, name: 'QA BP Reg Customer' }, { address: EMAIL, name: 'QA BP Reg Customer' }, { contact_id: CONTACT }];
const gc = 'SM3C' + uid(); await mkBp(BASIC(gc)); const tc = await mkT(gc); await waitIn(tc);
let body = null, last;
for (const v of variants) { const b = { mode: 'reply', subject: 'QA BP R', body_html: '<p>QA BP R strict reply control</p>', to: [v], cc: [], bcc: [] }; last = await A('POST', `/desk/tickets/${tc}/replies`, b); if (ok(last)) { body = b; break; } }
if (!body) { R('SM-03', 'INCONCLUSIVE', 'no reply body accepted on the control ticket: ' + E(last)); return await cleanup(); }
const g = 'SM3' + uid(); await mkBp({ ...BASIC(g), strictMode: { scope: 'specified', actions: ['reply'] } }); const t = await mkT(g); await waitIn(t);
const r = await A('POST', `/desk/tickets/${t}/replies`, body);
const c = await A('POST', `/desk/tickets/${t}/comments`, { content_html: '<p>QA allowed</p>' });
const ga = 'SM3X' + uid(); await mkBp({ ...BASIC(ga), strictMode: { scope: 'allExcept', actions: ['reply'] } }); const t2 = await mkT(ga); await waitIn(t2);
const r2 = await A('POST', `/desk/tickets/${t2}/replies`, body);
R('SM-03', r.s >= 400 && ok(c) && ok(r2) ? 'PASS' : 'FAIL', `control reply (to ${JS(body.to[0])}) → 2xx; Restrict Specified [replies]: reply → ${E(r)}, comment still → ${E(c)}; All Except [replies]: reply → ${E(r2)}`);
R('SM-09', ok(r2) ? 'PASS' : 'FAIL', 'All Except [replies]: reply allowed → ' + E(r2) + '; fields / comments / approvals / resolutions / attachments refused (70-strict)');
return await cleanup();
