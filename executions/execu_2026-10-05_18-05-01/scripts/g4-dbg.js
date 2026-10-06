// Debug: what blocks clicks on the new-layout builder.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(8000);
await shot('dbg-g4-newlayout');
const info = await page.evaluate(() => { const els = document.elementsFromPoint(640, 120).slice(0, 4).map(e => e.tagName + '.' + String(e.className).slice(0, 60)); const dl = [...document.querySelectorAll('[role=dialog],[aria-modal=true]')].map(d => d.innerText.slice(0, 200)); return { els, dl, vw: innerWidth, vh: innerHeight }; });
page.off('request', onReq);
return JSON.stringify({ url: page.url().replace(H, ''), ...info });
