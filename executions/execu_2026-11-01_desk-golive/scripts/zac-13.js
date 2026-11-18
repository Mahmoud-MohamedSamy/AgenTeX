const r = await api(page, 'PATCH', 'dataSharingRules', { tickets: MODE }); out.set = r.s + ' ' + r.t.slice(0, 200);
