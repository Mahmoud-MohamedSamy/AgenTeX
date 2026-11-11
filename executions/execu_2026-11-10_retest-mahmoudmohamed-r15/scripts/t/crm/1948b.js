const reqs=[]; page.on('response', async r => { const u=r.url(); if (/api\/v1/.test(u) && !/iam\/auth/.test(u) && /timeline|visib|polic/i.test(u)) { let b=''; try{ b=(await r.text()).slice(0,500);}catch(e){} reqs.push(r.request().method()+' '+r.status()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+b); } });
await page.goto(H + '/settings/timeline/visibility', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/Allow|Deny/i.test(await text())) break; } await sleep(3000);
const t = await text(); const k = t.indexOf('Timeline Visibility'); log(t.slice(k, k+1500));
await shot('NDC-1948-policy-before.png'); log(reqs);
