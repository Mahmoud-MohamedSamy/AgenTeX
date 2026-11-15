const ids=process.env.IDS.split(',');const o={};for(const id of ids){const r=(await api('GET','/workflow/rules/'+id)).j?.data;o[id.slice(0,8)]=r?.name;}return o;
