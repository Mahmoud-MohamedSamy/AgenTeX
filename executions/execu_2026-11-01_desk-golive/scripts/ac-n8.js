const r = await api('PUT', '/desk/notification-rules/departments/' + DEP.CS + '/rules/department.ticket_shared', { is_enabled: false, template_id: null }); out.off = r.s + ' ' + r.t.slice(0, 160);
return fin({ out });
