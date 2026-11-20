const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {}; const MM = '7e5e7c27-46e4-4bf6-b021-7bd219d34472';
const put = (id, tr, b) => api('PUT', `/modules/${TK}/records/${id}/blueprint/owners/${tr}`, b);
o.vo_cs_MM = E(await put(J.k1, 'end', { userIds: [MM], teamIds: [], departmentOwners: [] }));
o.vo_mine_CES2 = E(await put(J.r2, 'onlyA', { userIds: [AG_A], teamIds: [], departmentOwners: [] }));
o.ok_cs_CES1 = E(await put(J.k1, 'end', { userIds: [AG_B], teamIds: [], departmentOwners: [] })); if (/^2/.test(o.ok_cs_CES1)) LED('ticket-level owners of QA end on #4808 set to CES1 (control for NDC-3065)');
return o;
