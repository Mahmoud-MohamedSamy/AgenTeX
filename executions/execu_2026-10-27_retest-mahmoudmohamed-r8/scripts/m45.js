const out = {}; const M = '064aa360-7e4b-4e0b-9e68-831c469fa6e9'; const enc = v => ({ kind: 'string', value: String(v) });
const r = await page.context().request.get(H + '/locales/en/crm-workflow.json', { timeout: 60000 }); const t = await r.text();
out.multiCondition = [...t.matchAll(/"[^"]*"\s*:\s*"([^"]*(another condition|Condition \d|first condition|records not meeting|else)[^"]*)"/gi)].map(m => m[1]).slice(0, 6);
const lay = arr((await api('GET', `/modules/${M}/layouts`)).j?.data)[0]?.id;
const a = await api('POST', `/modules/${M}/records`, { layout_id: lay, trigger: [], data: [['name', 'QA RT r8 ACT trigger empty'], ['qa_colour', 'Green'], ['qa_child', 'C']].map(([f, v]) => ({ field: f, value: enc(v) })) });
const b = await api('POST', `/modules/${M}/records`, { layout_id: lay, data: [['name', 'QA RT r8 ACT trigger default'], ['qa_colour', 'Green'], ['qa_child', 'C']].map(([f, v]) => ({ field: f, value: enc(v) })) });
await sleep(20000);
for (const [k, x] of [['trigger []', a], ['no trigger', b]]) { const id = x.j?.data?.id; out[k] = x.s + ' rule runs: ' + arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.outcome).join(',') + ' (' + id + ')'; }
return done(out);
