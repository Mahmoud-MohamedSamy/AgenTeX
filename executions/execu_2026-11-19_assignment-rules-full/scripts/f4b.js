IDS.TK_F06='8168a5b5-5ceb-4823-b7de-4b740de7a396'; saveIds();
const r = {}; for (const k of ['TK_F03','TK_F06','TK_L1','TK_L2','TK_L3']) { const d = (await api('GET','/desk/tickets/'+IDS[k])).j.data; r[k] = { owner: await ownN(IDS[k]), in_backlog: d.in_backlog, h: (await hist(IDS[k])).filter(x=>/auto_assigned/.test(x)).map(x=>x.slice(0,200)) }; }
r.a1 = await wlo(IDS.A1, IDS.DA); r.prefs = await prefsG(IDS.DA); return r;
