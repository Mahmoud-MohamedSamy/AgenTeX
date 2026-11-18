out.fol = (await api('GET', '/desk/tickets/' + TK.R3 + '/followers')).t.slice(0, 200);
out.move = await prr('POST', '/desk/tickets/' + TK.R3 + '/move', { department_id: DEP.SAL });
await sleep(2000); out.fol2 = (await api('GET', '/desk/tickets/' + TK.R3 + '/followers')).t.slice(0, 200);
out.cmt = await prr('POST', '/desk/tickets/' + TK.R3 + '/comments', { body_html: '<p>QA AC2 owner comment after move (R3)</p>', is_private: true });
out.upd = await prr('PATCH', '/modules/' + TM + '/records/' + TK.R3, { data: [{ field: 'priority', value: sv('high') }] });
return fin({ out });
