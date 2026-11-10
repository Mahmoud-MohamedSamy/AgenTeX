const out={};const S=v=>({kind:'string',value:v});
const me=(await api('GET','/iam/me')).j.data;out.me={name:me.display_name||me.displayName,prof:(me.profiles||[]).map(p=>p.name+'@'+p.rank).join(',')};
const exp={LD:'visible (sub-unit, lower rank)',LE:'hidden (sibling HR, lower rank)',LF:'visible (same unit, lower rank)',LA:'hidden (sub-unit, equal rank)',LB:'hidden (HR, equal rank)',LC:'hidden (same unit, equal rank)',LO:'hidden (owner, higher rank)'};
out.get={};for(const k of Object.keys(exp)){const r=await api('GET',`/modules/${LEADS}/records/${ids[k]}`);out.get[k]=r.s+' expect '+exp[k];}
const l=await api('GET',`/modules/${LEADS}/records?pageSize=50&q=QA%20SS%202417`);const items=arr(l.j&&l.j.data);
out.listS=l.s;out.list=items.map(x=>{const d=x.data||[];const f=Array.isArray(d)?(d.find(y=>y.field==='first_name')||{}).value:null;return f?f.value:x.id.slice(0,8)});
// item 15: submit as Samy
if(!ids.AP1){const r=await api('POST',`/modules/${LEADS}/records`,{data:[{field:'first_name',value:S('QA SS 2417 AP1')},{field:'single_line_3_9',value:S('QA')}]});const id=r.j&&r.j.data&&r.j.data.id;out.AP1=r.s+' '+(id||r.t.slice(0,200));if(id){ids.AP1=id;save();log(`CREATED (as Mahmoud Samy) lead "QA SS 2417 AP1" ${id} — triggers approval process (submitter manager chain Samy→QA SS C→QA SS B)`);}}
await sleep(4000);const a=await api('GET',`/workflow/approvals/records/${LEADS}/${ids.AP1}`);out.ap1=a.s+' '+a.t.slice(0,900);
return out;
