const o = {};
const waitTxt = async (re, n) => { let t = ''; for (let i = 0; i < (n || 30); i++) { await sleep(1000); t = await txt().catch(() => ''); if (re.test(t)) break; } return t; };
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
let t = await waitTxt(/Wonder Travel|Audit/, 30); await sleep(3000);
const sb = page.getByPlaceholder(/search/i).last(); if (await sb.count()) { await sb.fill('Wonder Travel').catch(() => {}); await sleep(4000); }
await page.screenshot({ path: SHOT + '/bugs/W1-B4-1-audit-list.png' }); o.list = (await txt()).replace(/\s+/g, ' ').slice(0, 1200);
const row = page.getByText('Wonder Travel', { exact: false }).nth(1); if (await row.count()) { await row.click().catch(() => {}); await sleep(3500); }
await page.screenshot({ path: SHOT + '/bugs/W1-B4-2-audit-detail.png' }); o.detail = (await txt()).replace(/\s+/g, ' ').match(/.{0,200}[Tt]ime ?[Zz]one.{0,300}/)?.[0];
await page.keyboard.press('Escape').catch(() => {});
await page.goto(H + '/settings/organization/company', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); t = await waitTxt(/Time zone/, 30); await sleep(2500);
await page.screenshot({ path: SHOT + '/bugs/W1-B4-3-company-page.png' }); o.companyTz = t.replace(/\s+/g, ' ').match(/Time zone.{0,40}/)?.[0];
const reads = []; for (let i = 0; i < 6; i++) { const r = await api('GET', '/iam/tenant/company-profile'); const d = r.j && r.j.data; reads.push({ n: i + 1, time_zone: d && d.time_zone, time_zone_version: d && d.time_zone_version, updated_at: d && d.updated_at }); await sleep(800); }
o.reads = reads;
const html = `<html><body style="margin:0;font:15px/1.5 Consolas,monospace;background:#0f172a;color:#e2e8f0;padding:24px;width:1552px"><div style="font:600 18px Segoe UI;margin-bottom:12px;color:#fff">GET /api/v1/iam/tenant/company-profile — 6 reads in a row, nothing saved in between (NDC-Staging, ${new Date().toISOString().slice(0,16)}Z)</div>` + reads.map(r => `<pre style="background:#1e293b;border-radius:6px;padding:10px;margin:0 0 8px">${JSON.stringify(r)}</pre>`).join('') + `</body></html>`;
const p2 = await page.context().newPage(); await p2.setViewportSize({ width: 1600, height: 900 }); await p2.setContent(html); await p2.screenshot({ path: SHOT + '/bugs/W1-B4-4-api-reads.png' }); await p2.close();
return done(o);
