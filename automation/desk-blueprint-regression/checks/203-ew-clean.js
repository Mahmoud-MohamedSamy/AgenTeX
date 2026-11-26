const EV = JSON.parse(fs.readFileSync(RUN + '/evidence/plane-evidence2.json', 'utf8'));
for (const t of EV.keep || []) MADE.tickets.push(t); keep();
const r = await cleanup();
const extra = []; if (EV.tf09?.action) extra.push((await api('DELETE', `/workflow/custom-actions/${EV.tf09.action}`)).s); await sleep(1500);
if (EV.tf09?.source) extra.push((await api('DELETE', `/workflow/custom-actions/sources/${EV.tf09.source}`)).s);
let qa = []; for (let i = 0; i < 5; i++) { const items = arr((await api('GET', '/audit/recycle-bin/items?limit=100')).j?.data).filter(x => /QA BP R EW|QA BP R EV|QA BP R EW echo/.test(JS(x))); if (!items.length) break; qa.push(items.length); await api('POST', '/audit/recycle-bin/delete', { ids: items.map(x => x.id) }); await sleep(3000); }
const left = (await listBps()).filter(b => /^QA BP R /.test(b.definition?.name || '')).length;
const caLeft = arr((await api('GET', '/workflow/custom-actions')).j?.data).filter(x => /QA BP/.test(x.name || '')).length;
return { ...r, caDeletes: extra, binPurged: qa, qaBlueprintsLeft: left, qaCustomActionsLeft: caLeft };
