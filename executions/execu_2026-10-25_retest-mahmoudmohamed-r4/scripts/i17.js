const c = (await api('GET','/desk/integrations/crm/config')).j.data; return done({ panel: JSON.stringify(c.panel).slice(0, 900) });
