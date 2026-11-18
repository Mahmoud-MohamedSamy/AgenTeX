const t = await api(page, 'GET', 'tickets/' + T110); out.t110 = t.s + ' ' + JSON.stringify(t.j && { st: t.j.status, trashed: t.j.isTrashed, del: t.j.isDeleted, merged: t.j.mergedTicketId }).slice(0, 200);
const rb = await api(page, 'GET', 'recycleBin?limit=50'); out.bin = ((rb.j && rb.j.data) || []).map(x => [x.id, x.name || x.displayName || x.subject, x.module || x.entityType]).filter(x => /QA GL TM/.test(x[1] || ''));
const l = await api(page, 'GET', 'tickets?limit=20'); out.list = ((l.j && l.j.data) || []).map(x => '#' + x.ticketNumber + ' ' + x.subject + ' ' + x.status);
