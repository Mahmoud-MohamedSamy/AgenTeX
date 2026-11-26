for (const id of ['7666662000000760608', '7666662000000760662']) { const g = await zf('GET', `/crm/v8/settings/modules/${id}`); const m = g.j?.modules?.[0] || {}; log(id, g.s, 'visible', m.visible, 'deletable', m.deletable, 'status', m.status, 'generated', m.generated_type);
  if (m.deletable) log('delete', (await zf('DELETE', `/crm/v8/settings/modules/${id}`)).t.slice(0, 200)); }
