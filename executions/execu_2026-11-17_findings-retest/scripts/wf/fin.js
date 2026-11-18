eval(fs.readFileSync('wf/lib.js','utf8'));const o={rules:{},tickets:{},tag:null};
const L=fs.readFileSync('../ledger.md','utf8').split('\n').filter(l=>/WF lane: /.test(l));
const rules=[...new Set(L.filter(l=>/workflow rule "QA RT21 WF/.test(l)).map(l=>l.match(/" ([0-9a-f-]{36})/)[1]))];
const tks=[...new Set(L.filter(l=>/ticket "QA RT21 WF/.test(l)).map(l=>l.match(/" ([0-9a-f-]{36})/)[1]))];
for(const id of rules){const d=await api('DELETE','/workflow/rules/'+id);let s=d.s+'';if(d.s>=300){s+=' '+d.t.slice(0,120);const g=(await api('GET','/workflow/rules/'+id)).j?.data;if(g?.isActive)s+=' deact '+await deact(id);}else led(`workflow rule ${id} deleted`);o.rules[id.slice(0,8)]=s;}
for(const id of tks){const d=await api('DELETE','/modules/'+T+'/records/'+id);o.tickets[id.slice(0,8)]=d.s+(d.s>=300?' '+d.t.slice(0,100):'');if(d.s<300)led(`ticket ${id} deleted (to Recycle Bin)`);}
const tg=await api('DELETE','/desk/tags/883ef82a-cc1f-4271-a2ca-451d6027fc46');o.tag=tg.s+(tg.s>=300?' '+tg.t.slice(0,200):'');if(tg.s<300)led('desk tag 883ef82a QA RT21 WF F03 newtag deleted');
fs.writeFileSync(OUTD+'fin-ids.json',JSON.stringify({rules,tks}));return o;
