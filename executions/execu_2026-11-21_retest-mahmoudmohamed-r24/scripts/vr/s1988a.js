const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const P='QA RT20 VR';
// HC form field shape (read only)
const wf=await api('GET','/web-forms/921e0f8e'+''); o.wfShort=wf.s;
const wl=arr((await api('GET','/web-forms')).j.data); const q=wl.find(x=>x.name==='QA RT18 form'); if(q){ const d=(await api('GET','/web-forms/'+q.id)).j.data; o.wfFieldKeys=[...new Set((d.fields||[]).flatMap(f=>Object.keys(f)))]; o.wfField0=JSON.stringify((d.fields||[])[0]); o.wfTop=Object.keys(d); }
// fields
const pl=(n,vals)=>({fieldName:'qa_rt20vr_'+n,datatypeKey:'pick_list',labels:{en:P+' '+n},datatypeOptions:{allowed_values:vals},config:{allowed_values:vals},required:false,unique:false,uniquePeerModuleIds:[]});
const defs=[pl('type',['Refund','Question']),{fieldName:'qa_rt20vr_order',datatypeKey:'single_line',labels:{en:P+' order'},datatypeOptions:{},required:false,unique:false,uniquePeerModuleIds:[]}];
for(let i=1;i<=7;i++) defs.push(pl('l'+i,['A'+i,'B'+i,'C'+i]));
let F=arr((await api('GET','/modules/'+T+'/fields')).j.data); const have=new Set(F.map(f=>f.fieldName)); const nw=defs.filter(d=>!have.has(d.fieldName));
if(nw.length){ const r=await api('POST','/modules/'+T+'/fields',{fields:nw}); o.fields=r.s+' '+(r.s>=300?r.t.slice(0,400):''); if(r.s<300) LED('Desk Tickets fields '+nw.map(d=>d.fieldName).join(','));}
F=arr((await api('GET','/modules/'+T+'/fields')).j.data); const mine=F.filter(f=>f.fieldName.startsWith('qa_rt20vr_')); I.fields=Object.fromEntries(mine.map(f=>[f.fieldName,f.id])); SAVE();
o.fieldsOnLayouts=mine.map(f=>f.fieldName+':'+JSON.stringify(f.layouts).slice(0,60));
// layout
const L=arr((await api('GET','/modules/'+T+'/layouts')).j.data); let lay=L.find(x=>x.name===P+' 1988 Layout');
if(!lay){ const full=(await api('GET','/modules/'+T+'/layouts/'+STD)).j.data; o.stdDepts=[(full.departmentIds||[]).length,(full.defaultDepartmentIds||[]).length,full.displayInHelpCenter];
 const views={}; for(const [vk,v] of Object.entries(full.views||{})){ const lo=JSON.parse(JSON.stringify(v.layout)); lo.sections.push({id:'sec-qa-rt20vr',label:{default:P+' Main',en:P+' Main'},tab_order:'left_to_right',columns:[{id:'col-sec-qa-rt20vr',column_order:1,visibility:{mode:'ALWAYS',field:null,op:null,value:null,visible:true,conditions:[]},span:2,fields:mine.map(f=>JSON.parse(JSON.stringify(f)))}]});
  lo.sections.push({id:'sec-qa-rt20vr-b',label:{default:P+' Refund section',en:P+' Refund section'},tab_order:'left_to_right',columns:[{id:'col-sec-qa-rt20vr-b',column_order:1,visibility:{mode:'ALWAYS',field:null,op:null,value:null,visible:true,conditions:[]},span:2,fields:[]}]}); views[vk]={layout:lo}; }
 const body={name:P+' 1988 Layout',description:'QA RT20 lane VR NDC-1988',views,status:full.status,accessMode:full.accessMode,assignedProfiles:full.assignedProfiles,departmentIds:[DA],defaultDepartmentIds:[],ticketStatuses:full.ticketStatuses,displayInHelpCenter:false};
 const r=await api('POST','/modules/'+T+'/layouts',body); o.layCreate=r.s+' '+(r.s>=300?r.t.slice(0,500):''); if(r.s>=300) return o; lay=r.j.data; LED('Desk layout "'+P+' 1988 Layout" '+lay.id+' (departments [QA AO Dept A], not default, HC off)'); }
I.layout=lay.id; SAVE(); const g=(await api('GET','/modules/'+T+'/layouts/'+lay.id)).j.data; o.layout={id:lay.id,deps:g.departmentIds,def:g.defaultDepartmentIds,sections:g.views.CREATE.layout.sections.map(s=>s.id).slice(-3)};
return o;
