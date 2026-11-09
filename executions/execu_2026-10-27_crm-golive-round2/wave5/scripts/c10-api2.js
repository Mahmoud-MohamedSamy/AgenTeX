const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', PID = '2d617f97-13b9-4d22-bb52-742533b4b1a3';
const res = {};
const b = await call('POST', `/modules/${M}/buttons`, { name: 'qa_r2w5_btn2', label: { en: 'QA R2W5 Button2' }, actionType: 'Url', actionTarget: 'https://example.com/', placement: 'Detail' }); res.button2 = b.s + ' ' + b.t.slice(0, 200);
const l = await call('POST', `/modules/${M}/links`, { name: 'qa_r2w5_link2', label: { en: 'QA R2W5 Link2' }, url: 'https://example.com/' }); res.link2 = l.s + ' ' + l.t.slice(0, 200);
const t0 = Date.now();
await page.goto(H + `/modules/${M}/records/${PID}`, { waitUntil: 'domcontentloaded' });
let t = ''; for (let i = 0; i < 40; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/QA R2W5 Parent/.test(t) && !/^Loading/.test(t)) break; }
res.secs = (Date.now() - t0) / 1000;
await sleep(2000); t = (await page.innerText('main')).replace(/\s+/g, ' ');
res.recordHasButton = /QA R2W5 Button/.test(t); res.recordHasLink = /QA R2W5 Link/.test(t);
res.btns = [...new Set(await page.$$eval('main button, main a', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean)))].slice(0, 40);
res.top = t.slice(0, 600);
await shot('c10-record-page');
// SUM formula value on a record
const v = await call('GET', `/modules/${M}/records/${PID}`); res.sumVal = JSON.stringify((v.j.data.data || []).filter(x => /qa_sumf|qa_num/.test(x.field)));
return res;
