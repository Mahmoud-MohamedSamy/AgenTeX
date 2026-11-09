eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const DA=IDS.DA;o.isOwnerAcct=String(IDS.O).slice(0,8);
const add=await api('POST','/desk/skill-types',{name:'Tech',department_id:DA});o.readd=add.s+' '+((add.j&&add.j.error&&add.j.error.message)||'');if(add.s<300)LED('"Tech" re-added in QA AS6 Dept A');o.A=(await api('GET','/desk/skill-types?department_id='+DA)).j.data.types.map(t=>t.name);
const R=await api('GET','/modules/'+T+'/records?page=1&page_size=30');const L=arr(R.j&&R.j.data&&(R.j.data.records||R.j.data)).map(fl).filter(x=>/rt14/.test(x.subject||''));o.found=L.map(x=>({id:x.id,sub:x.subject}));
if(L[0]){const a=await act(L[0].id);o.acts=(Array.isArray(a)?a:[]).map(e=>e.action+' '+JSON.stringify(e.summary||{}).slice(0,190)+' by '+String(e.actor_id||e.actor||'').slice(0,8));}
// Control: same steps, no skill, sequential RR rule on create
o.rrSeq=(await getRule(IDS.RR_SEQ)).execute_on;
const DRl=(await api('GET','/desk/assignment-rules?type=direct')).j.data.rules.filter(r=>r.is_active&&JSON.stringify(r).includes(DA)).map(r=>r.name+' on '+r.execute_on+' '+JSON.stringify(r.targets[0].criteria).slice(0,90));o.activeDirect=DRl;
return o;
