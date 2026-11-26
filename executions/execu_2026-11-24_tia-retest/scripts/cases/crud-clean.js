const o = {}; const LEAD = '6ef84830-8152-4f59-abfa-a49c52b2ef3a', FLD = 'e53071d3-0afa-4a0a-a813-90aa2c0c77c1', RULE = 'fdce92b3-daa7-45cf-a96f-8390570939b9';
const r = await api('GET', `/modules/${M.leads}/records/${LEAD}`); o.leadRaw = JSON.stringify(r.j?.data).slice(0, 400);
const F = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data).find(f => f.id === FLD); o.field = F && { fieldName: F.fieldName, apiName: F.apiName, labels: F.labels, type: F.datatypeKey, deletable: F.isDeletable, status: F.status, layouts: F.layouts };
const W = (await api('GET', `/workflow/rules/${RULE}`)).j?.data; o.rule = { active: W?.isActive ?? W?.active ?? W?.status, actions: JSON.stringify(W?.actions).slice(0, 200) };
o.delLead = (await api('DELETE', `/modules/${M.leads}/records/${LEAD}`)).s;
const df = await api('DELETE', `/modules/${M.leads}/fields/${FLD}`); o.delField = df.s + ' ' + (df.t || '').slice(0, 200);
o.delRule = (await api('DELETE', `/workflow/rules/${RULE}`)).s;
ledger('CRUD cleanup: lead ' + LEAD + ' ' + o.delLead + ', field ' + FLD + ' ' + df.s + ', rule ' + RULE + ' ' + o.delRule);
return o;
