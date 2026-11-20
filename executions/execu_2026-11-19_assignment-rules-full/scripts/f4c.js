const r = {}; for (const k of ['TK_F03', 'TK_F06', 'TK_L1', 'TK_L2']) { const a = await act(IDS[k]); const e = (Array.isArray(a) ? a : []).find(x => /auto_assigned/.test(x.action)); r[k] = e ? (e.created_at || e.occurred_at || e.at || JSON.stringify(Object.keys(e))) : 'none'; }
const w0 = await wlo(IDS.A1, IDS.DA); await sleep(130000); r.L3after130s = await ownN(IDS.TK_L3); r.a1before = w0; r.a1after = await wlo(IDS.A1, IDS.DA);
const lst = await api('GET', '/modules/' + T + '/records?page_size=100&page=1'); r.note = 'ok'; return r;
