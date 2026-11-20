const ids=fs.readFileSync('../ledger.md','utf8').split('\n').filter(l=>/WF lane: (CRM )?workflow rule "QA RT20 WF/.test(l)).map(l=>l.match(/" ([0-9a-f-]{36})/)[1]);
const o={};for(const id of [...new Set(ids)]){const r=(await api('GET','/workflow/rules/'+id)).j?.data;o[id.slice(0,8)]=r?(r.name+' active='+r.isActive):'n/a (other app)';}return o;
