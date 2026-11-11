const {R}=JSON.parse(fs.readFileSync('../a4/p3.json','utf8'));const out={};
for(const [t,x] of Object.entries(R.res)){out[t]={};for(const [e,id] of Object.entries(x.t)){if(!/^[0-9a-f-]{36}$/.test(id))continue;out[t][e]=(await execs(id)).filter(z=>z.rule===x.id).map(z=>z.outcome+' '+z.actions.join(',')).join(' ; ')||'none';}}
const bh=await api('GET','/desk/business-hours');out.bh=[bh.s,JSON.stringify(arr2(bh.j?.data).map(b=>[b.name,b.is_default,b.type||b.mode,b.timezone])).slice(0,300)];
return out;
