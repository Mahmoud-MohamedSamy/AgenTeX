const rp=(await api('o','GET','/workflow/review-processes/c6cfc71d-'+'')).s; const all=arr((await api('o','GET','/workflow/review-processes')).j?.data).find(x=>x.id.startsWith('c6cfc71d'));
return {criteria:JSON.stringify(all.criteria).slice(0,300), rules:JSON.stringify(all.rules).slice(0,600), fields:JSON.stringify(all.fields).slice(0,300)};
