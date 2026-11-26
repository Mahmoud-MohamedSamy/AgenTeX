const o = {}; const SBT = 'a8b4da7e-8445-4a95-8bd6-dbe5f5ea1bde';
const list = async (hdr) => { const mods = arr((await api.O('GET', '/modules', undefined, hdr)).j?.data); const tk = mods.find(m => m.moduleKey === 'desk_tickets'); const all = []; for (let p = 1; p <= 5; p++) { const r = await api.O('GET', `/modules/${tk.id}/records?page_size=100&page=${p}`, undefined, hdr); const a = arr(r.j?.data); all.push(...a); if (a.length < 100) break; } return { tk: tk.id, total: all.length, all }; };
const main = await list(undefined); const sb = await list({ 'x-tenant-id': SBT });
o.mainModuleId = main.tk; o.sbModuleId = sb.tk; o.mainCount = main.total; o.sbCount = sb.total;
const ca = x => x.createdAt || x.created_at || (x.data || []).find(f => f.field === 'created_time' || f.field === 'created_at')?.value?.value;
const inWin = sb.all.filter(x => { const d = ca(x); return d && d >= '2026-11-24' && d < '2026-11-26'; });
o.sbInWindow = inWin.length; o.sbCreatedSample = sb.all.slice(0, 5).map(ca);
o.overlapIds = sb.all.filter(x => main.all.some(y => y.id === x.id)).length;
return o;
