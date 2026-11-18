// TK lane API helpers (prepended to apiw.js scripts). Prefix QA RT21 TK.
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest';
const TK='88e8ea44-1658-4df3-9930-d0902b91073d', O='97be04b6-0a08-4883-aa51-e1650b11cab7', CON='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const CFGF=RUN+'/scripts/tk/cfg.json'; const C=(()=>{try{return JSON.parse(fs.readFileSync(CFGF,'utf8'))}catch(e){return {}}})(); const saveC=()=>fs.writeFileSync(CFGF,JSON.stringify(C,null,1));
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z TK lane: '+m+'\n');
const E=r=>r.s+(r.s>=300?' '+(r.j?.error?.code||'')+' '+String(r.j?.error?.message||r.t).slice(0,200)+(r.j?.error?.details?' '+JSON.stringify(r.j.error.details).slice(0,300):''):'');
const sv=v=>v===null?{kind:'null'}:typeof v==='number'?{kind:'number',value:v}:typeof v==='boolean'?{kind:'boolean',value:v}:Array.isArray(v)?{kind:'array',items:v.map(sv)}:{kind:'string',value:String(v)};
const fields=o=>Object.entries(o).map(([k,v])=>({field:k,value:sv(v)}));
const mkT=async(subj,extra={},dept=C.D)=>{const r=await api('POST','/modules/'+TK+'/records',{data:fields({subject:'QA RT21 TK '+subj,description:'QA RT21 TK retest',status:'Open',department:dept,...extra})});const id=r.j?.data?.id;return id?{id}:{err:E(r)};};
const rec=async id=>{const g=await api('GET','/modules/'+TK+'/records/'+id);const o={_s:g.s};for(const x of g.j?.data?.data||[]){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value;}return o;};
