out.t = []; for (const v of ['readOnly', 'publicReadOnly', 'PUBLIC_READ_ONLY', 'public_read_only', 'readonly']) { const r = await api(page, 'PATCH', 'dataSharingRules', { tickets: v }); out.t.push(v + ' ' + r.s); if (r.s < 300) break; }
out.now = (await api(page, 'GET', 'dataSharingRules')).t.slice(0, 200);
