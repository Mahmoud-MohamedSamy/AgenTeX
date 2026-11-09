const cf = (await api('o', 'GET', 'desk:/desk/integrations/crm/config')).j?.data;
return Object.fromEntries(Object.entries(cf || {}).filter(([k, v]) => typeof v !== 'object' || v === null));
