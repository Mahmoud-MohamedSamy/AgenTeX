const DL = 'f7845032-d1be-48ff-8708-c539f2360df7'; const out = {};
const r = await api('PATCH', `/modules/${T}/records/${DL}`, { data: [['description', 'QA WF D3all changed all'], ['resolution', 'QA WF resolution'], ['language', 'arabic']].map(([k, v]) => ({ field: k, value: enc(v) })) }); out.dlAll = r.s;
await sleep(15000);
out.D3all = arr((await api('GET', `/desk/tickets/${DL}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html + ' @' + c.created_at.slice(11, 19));
const sources = await api('GET', '/workflow/api-sources'); out.sources = sources.s + ' ' + JSON.stringify(arr(sources.j?.data).map(x => ({ id: x.id, name: x.name, url: x.baseUrl || x.base_url }))).slice(0, 500);
return fin(out);
