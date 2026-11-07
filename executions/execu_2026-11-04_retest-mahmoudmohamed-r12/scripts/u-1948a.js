const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
await page.goto(H + '/settings/timeline/visibility', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(3000); if (/Allow|Deny|Visible|Hidden/i.test(await text())) break; } await sleep(4000);
await shot('1948-a-policy.png'); st.url = page.url(); const t = (await text()).split('\n').map(s => s.trim()).filter(Boolean); const i = t.findIndex(x => /Timeline Visibility/i.test(x)); st.body = t.slice(Math.max(0, i), i + 60).join(' | ');
st.reqs = reqs.filter(x => /timeline|visib|polic/i.test(x)).slice(-8).map(x => x.slice(0, 900)); return st;
