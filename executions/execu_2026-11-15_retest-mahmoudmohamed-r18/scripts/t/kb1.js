const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const st={}; page.on('response', r => { const u=decodeURIComponent(r.url()); if (/\/modules\/[^/]+\/records\?/.test(u)) { const k=(/skip_total=true/.test(u)?'skip ':'')+(/"stage"|"pipeline"|lead_status/.test(u)?'column ':'other ')+r.status(); st[k]=(st[k]||0)+1; } });
await page.goto(H+'/modules/'+D, { waitUntil:'domcontentloaded' }); await sleep(15000);
const t=await text(); await shot('2993-1-deals-kanban.png');
return { kanban:/Probability \d+%/.test(t), couldNot:(t.match(/Could not load these records/g)||[]).length, st, excerpt:t.slice(0,1500).replace(/\s+/g,' ') };
