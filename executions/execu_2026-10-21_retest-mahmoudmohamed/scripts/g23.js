for (let i = 0; i < 20 && !/QA RT imp|Restore/i.test(await txt()); i++) await sleep(1500);
const s = page.getByPlaceholder(/Search/i); const ph = await s.evaluateAll(es => es.map(e => e.placeholder));
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 1800);
await shot('1587-04-recycle-bin');
return done({ ph, t });
