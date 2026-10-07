const QAD = 'a7265f03-326f-46ab-b009-f17bad4ad555';
const g = (await api('GET', '/desk/departments/' + QAD)).j; const d0 = g && g.data || {};
const body = { name: d0.name, help_center_display_name: d0.help_center_display_name ?? null, logo_file_id: d0.logo_file_id ?? null, description: d0.description ?? null, display_in_help_center: !!d0.display_in_help_center, routing_strategy: d0.routing_strategy || 'round_robin', agent_user_ids: [], cc_enabled: !!d0.cc_enabled, auto_private_non_contacts: !!d0.auto_private_non_contacts, send_as_email_enabled: !!d0.send_as_email_enabled, mass_comments_enabled: !!d0.mass_comments_enabled }; const p = await api('PATCH', '/desk/departments/' + QAD, body);
let del = await api('DELETE', '/desk/departments/' + QAD); let how = 'after emptying';
if (del.s >= 300) { const tt = await api('GET', '/desk/departments/' + QAD + '/transfer-targets'); how = 'transfer targets ' + (tt.t || '').slice(0, 200); }
const dl = arr((await api('GET', '/desk/departments')).j.data).map(d => d.name);
rec('CLEANUP.dept', dl.includes('QA MF Dept') ? 'FAIL' : 'PASS', `members before ${JSON.stringify(d0.agent_user_ids || d0.agents || '').slice(0, 120)}; PATCH agent_user_ids [] → ${p.s} ${p.s >= 300 ? p.t.slice(0, 160) : ''}; DELETE → ${del.s} ${del.s >= 300 ? del.t.slice(0, 160) : ''} (${how}); departments now [${dl.join(', ')}]`);
return done();
