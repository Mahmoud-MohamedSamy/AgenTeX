const want = { '5aeb8d85-2820-4c31-991c-ff77e33e9d86': 'QA LR1112 deal G15', 'f444eed2-8406-4afd-a1c6-e1d099549200': 'QA LR1112 imp2', '9bf4cb93-406e-4be1-bfab-ed1fac7c9491': 'QA LR1112 imp3', '32c02805-4a7e-407f-a4bd-16b351dcee3f': 'QA LR1112 imp1', '1b053a48-49dc-4a2e-abe7-8e7952d6c4e6': 'QA LR1112 wf G13' };
let cursor = null; const ok = [];
for (let p = 0; p < 30; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); for (const i of arr(r.j.data && (r.j.data.items || r.j.data))) if (want[i.id] && want[i.id] === i.record_label) ok.push(i.id); cursor = r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
const out = { matched: ok.length }; if (ok.length) out.purge = SR(await api('POST', '/audit/recycle-bin/delete', { ids: ok }));
out.layout = SR(await api('DELETE', '/modules/' + I.mod_leads + '/layouts/' + I.layout)).slice(0, 200);
return out;
