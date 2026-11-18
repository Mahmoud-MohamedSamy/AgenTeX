const t = (await api(page, 'GET', 'tickets/1499272000000451643')).j; out.Z2 = { status: t.status, assignee: t.assigneeId, priority: t.priority, shared: JSON.stringify(t.sharedDepartments) };
const s = (await api(page, 'GET', 'tickets/search?subject=' + encodeURIComponent('QA AC Z agent2 into Tech') + '&limit=5')).j; out.created = (s && s.data || []).map(x => x.id + ' #' + x.ticketNumber + ' dept ' + x.departmentId + ' owner ' + x.assigneeId);
const h = (await api(page, 'GET', 'tickets/1499272000000451643/History?limit=20')).j; out.hist = JSON.stringify(h).slice(0, 1500);
