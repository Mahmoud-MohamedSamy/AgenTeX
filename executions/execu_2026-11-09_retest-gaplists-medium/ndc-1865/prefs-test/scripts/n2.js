const l=await api('GET','/desk/integrations/crm/links?page_size=3');out.links=l.s+' '+l.t.slice(0,700);
out.crmContacts=await crmMod('contacts');out.crmAccounts=await crmMod('accounts');
out.prefs=await prefs();return out;
