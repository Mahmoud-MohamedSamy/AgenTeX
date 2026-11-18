await sleep(40000); const r = await api('POST', '/desk/tickets/' + TK.CSU + '/move', { department_id: DEP.SAL }); out.move = r.s + ' ' + r.t.slice(0, 120);
return fin({ out });
