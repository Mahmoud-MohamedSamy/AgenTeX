const MC = page.locator('#main-content'); const dlg = () => page.locator('[role=dialog]').last();
const ctrls = async (loc) => loc.locator('input,textarea,select,button,[role=combobox],[role=switch],[role=tab]').evaluateAll(es => es.filter(e => e.offsetParent).map(e => [e.tagName, e.type || '', e.placeholder || '', e.getAttribute('aria-label') || '', (e.innerText || '').trim().slice(0, 30)].join('|'))).catch(() => []);
await go('/settings/developer/custom-actions', 10000);
for (const tab of ['Variables', 'API sources', 'Actions']) { await MC.getByRole('tab', { name: tab }).first().click().catch(() => MC.getByText(tab, { exact: true }).first().click()); await sleep(3000); out['tab_' + tab] = (await MC.innerText()).replace(/\s+/g, ' ').slice(-1300); await shot('w3/W3-11-tab-' + tab.replace(' ', '-')); }
await MC.getByRole('button', { name: /New action/i }).first().click(); await sleep(4000);
const f = (await dlg().count()) ? dlg() : MC; out.newActionUrl = page.url().replace(H, ''); out.newAction = (await f.innerText()).replace(/\s+/g, ' ').slice(0, 2500); out.newActionCtrls = await ctrls(f); await shot('w3/W3-13-new-action-form');
return fin({ out });
