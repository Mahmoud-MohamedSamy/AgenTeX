const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const L = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
await go(`/settings/modules-and-fields/${QA.id}/layouts/${L[0].id}`, 10000);
await shot('dbg-g4-saved-builder');
const info = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.childElementCount <= 2 && /NEW SECTION/i.test(e.textContent || '') && (e.textContent || '').length < 40).map(e => `${e.tagName} vis=${!!e.getClientRects().length} txt=${e.textContent.trim()} y=${Math.round(e.getBoundingClientRect().y)}`).slice(0, 8));
const tabs = await page.locator('button.mf-tab').allInnerTexts();
page.off('request', onReq);
return JSON.stringify({ layouts: L.map(x => x.name + (x.isDefault ? '*' : '')), info, tabs, url: page.url().replace(H, '') });
