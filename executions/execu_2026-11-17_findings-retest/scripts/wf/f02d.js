eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const ID='0b861ad1-c411-4acb-b125-5c52fc691d81';
let g=(await api('GET','/workflow/rules/'+ID)).j?.data;o.before=g?.isActive;
if(g?.isActive)o.deact=await deact(ID);
g=(await api('GET','/workflow/rules/'+ID)).j?.data;o.after=g?.isActive;
const e=await execsRaw('c9e9eb3a-71db-4c89-8ef2-07f25276e402');o.t4=e.map(x=>x.ruleId.slice(0,8)+' '+x.outcome+' '+(x.startedAt||x.createdAt||x.firedAt)+' '+Object.keys(x).join(','));
return o;
