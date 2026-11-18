const r = await api(page,'GET','tickets?limit=50&sortBy=-createdTime&include=assignee');
out.s = r.s; out.t = (r.j && r.j.data || []).map(t => ({ n: t.ticketNumber, subj: (t.subject||'').slice(0,60), created: t.createdTime, owner: t.assigneeId || null, ownerName: t.assignee && (t.assignee.firstName+' '+t.assignee.lastName), dept: t.departmentId, ch: t.channel }));
