// NDC-2323: scheduled (2 min) webhook on Leads On Create; convert lead 1 right away, lead 2 is the control.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const URL = 'https://webhook.site/6dfadff1-f7c7-481e-8752-ad6959e29946';
const s = v => ({ kind: 'string', value: v }); const out = {};
const r = await api('POST', '/workflow/rules', { moduleId: L, name: 'QA RT 2323 scheduled webhook', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' },
  criteria: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA RT 2323', caseInsensitive: false },
  actions: [{ order: 0, type: 'Webhook', delaySeconds: 120, url: URL, method: 'POST', bodyTemplate: '{"case":"2323","recordId":"${recordId}"}', headers: {}, timeoutSeconds: 10 }] });
out.rule = r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 250)); out.ruleId = r.j?.data?.id;
const mk = async n => { const c = await api('POST', `/modules/${L}/records`, { layout_id: '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1', data: [{ field: 'first_name', value: s('QA RT 2323 ' + n) }, { field: 'last_name', value: s('QA RT 2323 ' + n) }, { field: 'email', value: s('qa.rt.2323.' + n + '@example.com') }] }); return c.j?.data?.id || c.t.slice(0, 200); };
out.lead1 = await mk('converted'); out.lead2 = await mk('control');
await sleep(3000);
const cv = await api('POST', `/modules/${L}/records/${out.lead1}/convert`, {}); out.convert = cv.s + ' ' + JSON.stringify(cv.j?.data || cv.t).slice(0, 250);
out.at = new Date().toISOString();
return done(out);
