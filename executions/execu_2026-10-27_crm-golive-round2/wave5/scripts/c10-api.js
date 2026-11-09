const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842', PID = '2d617f97-13b9-4d22-bb52-742533b4b1a3';
const res = {};
const b = await call('POST', `/modules/${M}/buttons`, { name: 'qa_r2w5_btn', labels: { en: 'QA R2W5 Button' }, actionType: 'Url', actionTarget: 'https://example.com/?id=${id}', placement: 'Detail' }); res.button = b.s + ' ' + b.t.slice(0, 300);
const l = await call('POST', `/modules/${M}/links`, { name: 'qa_r2w5_link', labels: { en: 'QA R2W5 Link' }, url: 'https://example.com/' }); res.link = l.s + ' ' + l.t.slice(0, 300);
const lr = await call('POST', `/modules/${M}/layout-rules`, { name: 'QA R2W5 LR', triggerField: 'qa_pick', layoutId: L, conditions: [{ field: 'qa_pick', operator: 'equals', value: 'Blue' }], actions: [{ type: 'show', targetField: 'qa_text' }] }); res.layoutRule = lr.s + ' ' + lr.t.slice(0, 300);
res.lists = { buttons: (await call('GET', `/modules/${M}/buttons`)).t.slice(0, 400), links: (await call('GET', `/modules/${M}/links`)).t.slice(0, 400) };
await page.goto(H + `/modules/${M}/records/${PID}`, { waitUntil: 'domcontentloaded' }); await sleep(7000);
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
res.recordHasButton = /QA R2W5 Button/.test(t); res.recordHasLink = /QA R2W5 Link/.test(t);
res.recordTop = t.slice(0, 500);
await shot('c10-record-page');
// formula SUM (NDC-2536 item 3)
const f = await call('POST', `/modules/${M}/fields`, { fields: [{ fieldName: 'qa_sumf', labels: { en: 'QA SumF' }, datatypeKey: 'formula', required: false, unique: false, datatypeOptions: { expression: 'sum(qa_num, 5)', return_kind: 'number' } }] }); res.sumFormula = f.s + ' ' + f.t.slice(0, 250);
// currencies (NDC-2536 item 1)
const c = await call('GET', '/currencies'); res.currencies = c.s + ' ' + c.t.slice(0, 200);
const c2 = await call('GET', '/iam/tenant/currencies'); res.currencies2 = c2.s + ' ' + c2.t.slice(0, 200);
return res;
