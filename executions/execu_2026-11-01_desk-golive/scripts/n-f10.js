const o = {}; const MID = 'b9f87f12-8fd8-499d-a8e6-b50b092e31b3'; const DA = '44444444-4444-4444-4444-444444444402';
const S = r => ({ s: r.s, code: r.j && r.j.error && r.j.error.code, message: r.j && r.j.error && r.j.error.message });
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=fields', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 25; i++) { await sleep(1000); if (/QA GL N Required/.test(await txt().catch(() => ''))) break; } await sleep(2000);
await page.screenshot({ path: SHOT + '/ndc/NDC-2387-1-fields.png' });
const fl = (await api('GET', '/modules/' + MID + '/fields')).j.data; const req = fl.find(x => x.fieldName === 'qa_req');
o.field = { label: 'QA GL N Required', required: req.required };
o.hidden = S(await api('POST', '/modules/' + MID + '/field-permissions', { fieldId: req.id, profileId: DA, permission: 'hidden' }));
o.readOnly = S(await api('POST', '/modules/' + MID + '/field-permissions', { fieldId: req.id, profileId: DA, permission: 'read_only' }));
const fp = await api('GET', '/modules/' + MID + '/field-permissions'); o.stored = fp.j && fp.j.data;
const blk = (t, b) => `<div style="font:600 15px Segoe UI;margin:14px 0 6px;color:#93c5fd">${t}</div><pre style="background:#1e293b;border-radius:6px;padding:10px;margin:0;white-space:pre-wrap">${b}</pre>`;
const html = `<html><body style="margin:0;font:14px/1.5 Consolas,monospace;background:#0f172a;color:#e2e8f0;padding:24px;width:1552px"><div style="font:600 18px Segoe UI;color:#fff">NDC-2387 retest — field permission on a required field (NDC-Staging, ${new Date().toISOString().slice(0,16)}Z)</div>`
 + blk('Field', 'QA GL N Required (qa_req) — required: ' + req.required + ' · profile: Desk Agent')
 + blk('POST /modules/{QA module}/field-permissions  {"permission":"hidden"}', o.hidden.s + ' ' + o.hidden.code + '\n' + o.hidden.message)
 + blk('POST /modules/{QA module}/field-permissions  {"permission":"read_only"}', o.readOnly.s + ' ' + o.readOnly.code + '\n' + o.readOnly.message)
 + blk('GET /modules/{QA module}/field-permissions', JSON.stringify(o.stored)) + `</body></html>`;
const p2 = await page.context().newPage(); await p2.setViewportSize({ width: 1600, height: 900 }); await p2.setContent(html); await p2.screenshot({ path: SHOT + '/ndc/NDC-2387-2-api.png' }); await p2.close();
o.del = (await api('DELETE', '/modules/' + MID + '?cascade=true')).s;
const still = (await api('GET', '/modules')).j.data; o.gone = !(Array.isArray(still) ? still : still.items || []).some(x => x.id === MID);
return done(o);
