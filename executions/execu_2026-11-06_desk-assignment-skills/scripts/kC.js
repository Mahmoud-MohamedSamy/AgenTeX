eval(require('fs').readFileSync('lib.js','utf8'));const o={};
const tries=[
 ['search Equals str',{filters:[{field:'owner',operator:'Equals',value:{kind:'string',value:IDS.A1}}]}],
 ['search eq',{filters:[{field:'owner',operator:'eq',value:{kind:'string',value:IDS.A1}}]}],
 ['search subject StartsWith',{filters:[{field:'subject',operator:'StartsWith',value:{kind:'string',value:'QA AS6 F14'}}]}],
];
for(const [k,b] of tries){const r=await api('POST','/modules/'+T+'/records/search',b);o[k]=r.s+' n='+arr(r.j&&r.j.data).length+' '+(r.s>=300?r.t.slice(0,200):JSON.stringify(r.j.meta).slice(0,200));}
const q=await api('POST','/modules/'+T+'/records/query',{criteria:{op:'eq',field:'owner',value:IDS.A1},limit:200});o.query=q.s+' n='+arr(q.j&&q.j.data).length+' '+(q.s>=300?q.t.slice(0,300):JSON.stringify(q.j.meta).slice(0,300));
const v=await api('GET','/desk/agents/'+IDS.A1+'/workload');o.workload=v.s+' '+v.t.slice(0,300);
return o;
