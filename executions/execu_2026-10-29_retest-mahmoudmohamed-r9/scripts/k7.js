const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713'; const s = v => ({ kind: 'string', value: v }); const out = {}; const ids = [];
const mk = async (label, extra) => { const r = await api('POST', `/modules/${L}/records`, { layout_id: Q, data: [{ field: 'first_name', value: s('QA RT 2423') }, { field: 'last_name', value: s(label) }, { field: 'phone', value: s('01012345678') }, ...extra] }); if (r.j?.data?.id) ids.push(r.j.data.id); return r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || '') + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 160) : 'ok'); };
out.badPhone = await mk('bad phone', [{ field: 'qa_rt_phone_r6', value: s('123') }, { field: 'qa_rt_email_r6', value: s('qa.rt.2423.a@example.com') }]);
out.goodPhone = await mk('good phone', [{ field: 'qa_rt_phone_r6', value: s('01012345678') }, { field: 'qa_rt_email_r6', value: s('qa.rt.2423.b@example.com') }]);
out.dupEmail = await mk('dup email', [{ field: 'qa_rt_phone_r6', value: s('01112345678') }, { field: 'qa_rt_email_r6', value: s('qa.rt.2423.b@example.com') }]);
out.noEmail = await mk('no email', [{ field: 'qa_rt_phone_r6', value: s('01212345678') }]);
out.ids = ids;
return done(out);
