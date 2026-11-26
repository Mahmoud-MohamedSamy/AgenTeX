const me = (await api('GET', '/iam/me')).j?.data; const myId = me?.id || me?.user_id || me?.userId;
const f = [{ field: 'is_spam', operator: 'is_false', value: null }, { field: 'is_archived', operator: 'is_false', value: null }, { field: 'status', operator: 'equals', value: 'Open' }, { field: 'owner', operator: 'contains_any_of', value: [myId] }];
const r = await api('GET', `/modules/${M.tickets}/records?page=1&per_page=10&filters=${encodeURIComponent(JSON.stringify(f))}`);
return { myIdLen: String(myId).length, rows: arr(r.j?.data).map(x => { const s = JSON.stringify(x); return { subj: (s.match(/"subject"[^}]*?"value":"([^"]{0,50})/) || [])[1], ownerMatches: s.includes(myId), status: (s.match(/"status"[^}]*?"value":"([^"]{0,20})/) || [])[1] }; }) };
