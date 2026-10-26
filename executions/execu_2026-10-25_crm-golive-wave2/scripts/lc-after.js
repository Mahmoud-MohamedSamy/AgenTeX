const v = (j, k) => { const x = (j.data.data || []).find(e => e.field === k); return x && x.value; };
const lead = await call('GET', `/modules/${MODS.leads}/records/2f937b0e-82a4-4e40-ae43-17a6c78d4788`);
const c = await call('GET', `/modules/${MODS.contacts}/records/f5b35982-86ef-4bf9-8905-3c2acc0b6355`);
const d = await call('GET', `/modules/${MODS.deals}/records/81ef9091-f11c-4c1a-afef-28adb3fb0087`);
const tlc = await call('GET', `/timeline/records/contacts/f5b35982-86ef-4bf9-8905-3c2acc0b6355/feed`);
const tll = await call('GET', `/timeline/records/leads/2f937b0e-82a4-4e40-ae43-17a6c78d4788/feed`);
return { lead: lead.s + ' converted=' + JSON.stringify(lead.j && lead.j.data && (lead.j.data.is_converted ?? lead.j.data.converted ?? v(lead.j, 'is_converted') ?? v(lead.j, 'converted'))) + ' status=' + JSON.stringify(lead.j && lead.j.data && lead.j.data.status),
  contactTags: JSON.stringify(v(c.j, 'tags')), contactPhone: JSON.stringify(v(c.j, 'phone')), contactOwner: JSON.stringify(v(c.j, 'owner')),
  deal: { pipeline: v(d.j, 'pipeline'), stage: v(d.j, 'stage'), contact: String(JSON.stringify(v(d.j, 'contact_name') || v(d.j, 'contact'))), prob: v(d.j, 'probability') },
  tlContact: (tlc.j.data.data || []).map(e => e.entry_type), tlLead: (tll.j.data.data || []).map(e => e.entry_type) };
