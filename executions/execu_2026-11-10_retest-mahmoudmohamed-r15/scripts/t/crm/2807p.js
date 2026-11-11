await page.goto(H + '/settings/data/recycle-bin?group=cd9bb581-0f7c-4757-b7ea-5c36eef080fc', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/2807/.test(await text())) break; }
await sleep(3000);
const t = await text(); const k = t.indexOf('Recycle Bin', 1500); log(t.slice(k, k+1200));
await shot('NDC-2807-bin-group.png');
const btns = await page.$$eval('main button', bs => bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean)); log([...new Set(btns)].slice(0,40));
