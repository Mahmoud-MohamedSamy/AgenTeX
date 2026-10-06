// Probe: section settings UI, layout status switch behaviour (no saves).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const L = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const x = L.find(l => l.name === 'QA MF L1x') || L[0];
await go(`/settings/modules-and-fields/${QA.id}/layouts/${x.id}`, 10000);
const btn = page.getByRole('button', { name: 'Section settings' }).first();
await btn.click(); await sleep(1200); await shot('dbg-g4-section-settings');
const after = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=menu],[role=dialog],aside,[class*=drawer],[class*=Drawer],[class*=popover],[data-state=open]')].map(e => (e.getAttribute('role') || e.tagName) + ': ' + e.innerText.replace(/\s+/g, ' ').slice(0, 300)); return d; });
await page.keyboard.press('Escape'); await sleep(500);
const title = page.locator('[title="Double-click to rename"]').first(); const tn = await title.count();
let rn = '';
if (tn) { await title.dblclick(); await sleep(700); rn = await page.evaluate(() => [...document.querySelectorAll('input')].filter(i => i === document.activeElement).map(i => i.outerHTML.slice(0, 160)).join('')); await page.keyboard.press('Escape'); }
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
const sw = await page.locator('button[aria-label^="Toggle "]').evaluateAll(bs => bs.map(b => `${b.getAttribute('aria-label')} disabled=${b.disabled} checked=${b.getAttribute('aria-checked')} title=${b.title || (b.closest('[title]') || {}).title || ''}`));
page.off('request', onReq);
return JSON.stringify({ layouts: L.map(l => `${l.name}${l.isDefault ? '*' : ''} ${l.status}`), after, dblclickRename: rn, switches: sw });
