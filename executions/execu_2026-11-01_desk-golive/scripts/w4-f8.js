const ly = await api('GET', '/modules/' + TM + '/layouts'); const L = arr(D(ly.j));
out.layouts = L.map(x => x.id + ' | ' + x.name + ' | ' + JSON.stringify(x.department_ids || x.departments || x.scope || '').slice(0, 120));
const std = L.find(x => /^Standard$/i.test(x.name)) || L[0];
const cs = arr(D((await api('GET', '/web-forms')).j)).find(f => f.name === 'Customer Support Webform');
const def = { ...cs.definition, fields: [{ key: 'contact.last_name', required: true }, { key: 'email', required: true }, { key: 'subject', required: true }, { key: 'description', required: false }], allowed_origins: [], share_link_enabled: true, success_message: 'QA GL W4 thank you.' };
let r = await api('POST', '/web-forms', { kind: 'advanced_form', name: 'QA GL W4 form', department_id: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', layout_id: std.id, definition: def });
out.create = r.s + ' ' + r.t.slice(0, 400); if (r.j && r.j.data && r.j.data.id) { CREATED.push({ kind: 'web-form', id: r.j.data.id, name: 'QA GL W4 form' }); out.id = r.j.data.id; out.fields = (r.j.data.definition.fields || []).map(f => f.key + (f.required ? '*' : '')); out.keys = Object.keys(r.j.data); out.hosted = r.j.data.share_url || r.j.data.hosted_url || r.j.data.links || null; }
out.limits = JSON.stringify(D((await api('GET', '/web-forms/limits')).j));
r = await api('POST', '/web-forms', { kind: 'advanced_form', name: 'QA GL W4 form 6th', department_id: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', layout_id: std.id, definition: def });
out.sixth = r.s + ' ' + r.t.slice(0, 300); if (r.j && r.j.data && r.j.data.id) CREATED.push({ kind: 'web-form', id: r.j.data.id, name: 'QA GL W4 form 6th' });
await go('/settings/channels/web-forms', 10000);
out.counter2 = ((await txt()).match(/(\d+) of (\d+) used/) || [''])[0];
out.newBtn = await page.getByRole('button', { name: /^New advanced form/ }).evaluate(e => e.disabled + ' ' + (e.title || '')).catch(() => 'n/a');
await page.getByRole('button', { name: /^New advanced form/ }).click().catch(() => {}); await sleep(2500); out.afterClick = page.url() + ' ' + (await page.locator('[data-sonner-toast],[role=alert],[role=dialog]').allInnerTexts()).join(' / ').slice(0, 300);
await shot('w4/W4-33-limit');
return fin({ out });
