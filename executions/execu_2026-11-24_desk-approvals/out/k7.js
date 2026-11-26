const r = await api.A('POST', `/desk/tickets/${ST.N.t1}/approvals`, { subject: 'QA PA K7 arabic notify', approver_user_ids: [U.B] }); ST.N.a4 = r.j?.data?.id; saveState();
await sleep(6000);
const n = arr((await api.B('GET', '/notifications?limit=30')).j?.data); const x = n.find(y => /K7 arabic/.test(JSON.stringify(y)));
const reqAt = r.j?.data?.requested_at;
const lang = (await api.B('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.user.locale.language', scope_type: 'User' }, { app_key: 'general', key: 'general.user.locale.timezone', scope_type: 'User' }] })).t.slice(0, 500);
const arabic = x && /[؀-ۿ]{3,}/.test((x.title || '').replace(/QA PA[^:]*$/, ''));
result('K7', arabic ? 'PASS' : 'FAIL', `B language set to Arabic; new request notification title: "${x?.title}" (event ${x?.event_type})`);
return { title: x?.title, body: x?.body, reqAt, lang, a1req: (await api.B('GET', '/desk/approvals/' + ST.N.a1)).j?.data?.item?.requested_at };
