const me = D((await api('GET', '/iam/me')).j); out.me = me && (me.email || (me.user && me.user.email));
const et = await api('GET', '/desk/email-templates?limit=200'); const l = (D(et.j) || {}).email_templates || [];
out.tpl = et.s + ' n=' + l.length + ' qa=' + l.filter(x => /QA GL W4/.test(x.name)).map(x => x.name + '/' + x.folder_name).join(' ; ');
const fo = await api('GET', '/desk/email-templates/folders'); out.folders = fo.s + ' ' + ((D(fo.j) || {}).folders || []).map(x => x.name + '/' + x.visibility).join(' ; ');
const g1 = await api('GET', '/desk/email-templates/9dfb198b-8f5c-4c38-9dcc-2a4d0ebdc34d'); out.direct = g1.s + ' ' + g1.t.slice(0, 160);
return fin({ out });
