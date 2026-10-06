// I5 save-time check: turn Read-only on for the required QA field, Apply, Save — expect the conflict message.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
const before = JSON.stringify((await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data);
const reqInLayout = (before.match(/"fieldName":"qa_req"[^}]*?"required":(true|false)/) || [])[1];
await go(`/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, 10000);
const c = page.getByText('QA MF Required', { exact: true }); let lab = null; for (let i = 0; i < await c.count(); i++) { const bb = await c.nth(i).boundingBox(); if (bb && bb.x > 340) { await c.nth(i).scrollIntoViewIfNeeded(); await c.nth(i).hover(); lab = await c.nth(i).boundingBox(); break; } }
await sleep(500); const btns = page.locator('[title="Field options"]'); let best = null, bd = 1e9; for (let i = 0; i < await btns.count(); i++) { const bb = await btns.nth(i).boundingBox(); if (!bb) continue; const dy = Math.abs(bb.y - lab.y); if (bb.x > lab.x && dy < 30 && dy < bd) { bd = dy; best = btns.nth(i); } }
await best.click(); await sleep(600); await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(1200);
await page.getByText('PERMISSIONS', { exact: true }).first().click(); await sleep(800);
const lb = await page.getByText('Read-only', { exact: true }).last().boundingBox(); const cands = page.locator('button, input[type=checkbox], [role=switch]'); let sw = null; for (let i = 0; i < await cands.count(); i++) { const bb = await cands.nth(i).boundingBox().catch(() => null); if (bb && Math.abs(bb.y - lb.y) < 25 && bb.x > lb.x + 200) { sw = cands.nth(i); break; } } if (!sw) { await page.mouse.click(1240, lb.y + 8); } else await sw.click({ force: true }); await sleep(500);
const t1 = await txt();
await page.locator('aside button, [role=dialog] button').filter({ hasText: /^Apply$/ }).last().click(); await sleep(800);
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(3500);
const t2 = (await txt()).replace(/\s+/g, ' ');
const s = await shot('I5-save-required-readonly');
const after = JSON.stringify((await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data);
const both = /"fieldName":"qa_req"[^}]*?"required":true[^}]*?"read_only":true|"fieldName":"qa_req"[^}]*?"read_only":true[^}]*?"required":true/.test(after);
const msg = (t2.match(/Cannot save:[^.]*\./) || [''])[0];
rec('I5', msg && !both ? 'PASS' : 'FAIL', `field required in layout=${reqInLayout}; after toggling Read-only: warning in drawer=${/no longer allowed|can't be read-only/.test(t1)}; Save → message "${msg}"; layout saved with required+read_only=${both}`, { shot: s });
if (both) { const L = JSON.parse(after); delete L.id; const fix = JSON.parse(JSON.stringify(L).replace(/("fieldName":"qa_req"[^}]*?)"read_only":true/, '$1"read_only":false')); await api('PUT', `/modules/${MID}/layouts/${DEF.id}`, fix); }
await go('/hq', 3000);
return done();
