const ids = { pick: '1f981cdf-a487-48eb-88d4-e9d29c17e0e2', num: 'a5b681c7-e4cf-4158-80f9-9e50e9d54fa8', date: '65e360e0-0274-4f06-ae61-77efbf448745', url: '4f8b5ff2-bb0b-406c-aa11-08a21bb31f04', email: 'de223289-1d12-4117-9502-11edb80e01f4', multi: 'b5a5926e-fb88-4ed6-ad24-d78096545d2a', check: '1e671085-1692-4763-8903-ee2c16daead4' };
await go('/modules/' + CM + '/customers/' + C1, 12000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.shown = ['QA GL W5 field', 'QA GL W5 number', 'QA GL W5 date', 'QA GL W5 url', 'QA GL W5 multi', 'QA GL W5 checkbox'].filter(l => t.includes(l)); out.beta = t.includes('Beta');
await shot('w5/W5-53-contact-fields');
out.del = {}; for (const [k, id] of Object.entries(ids)) out.del[k] = (await api('DELETE', '/modules/' + CM + '/fields/' + id)).s;
const ex = await api('GET', '/modules/' + CM + '/fields'); out.left = arr(D(ex.j)).filter(f => /qa_gl_w5/.test(f.apiName)).map(f => f.apiName);
const rec = await api('GET', '/modules/' + CM + '/records/' + C1); out.recLeft = (D(rec.j).data || []).filter(d => /qa_gl_w5/.test(d.field)).map(d => d.field);
return fin({ out });
