let p; for (let i = 0; i < 3; i++) { p = await api('PUT', '/desk/tickets/' + TK.SH1 + '/shares', { shares: [{ department_id: DEP.CS, access: 'full' }] }); if (p.s < 300) break; await sleep(4000); } out.SH1 = p.s + ' ' + p.t.slice(0, 120);
return fin({ out });
