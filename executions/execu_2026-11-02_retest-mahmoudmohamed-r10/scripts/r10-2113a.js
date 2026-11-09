const out={};
const fl=arr((await api('o','GET',`/modules/${T.LEADS}/fields`)).j?.data); const ls=fl.find(f=>f.apiName==='lead_status'); out.field={id:ls.id,opts:ls.datatypeOptions,rv:ls.rowVersion};
const v=await api('o','POST',`/modules/${T.LEADS}/views`,{name:'QA RT r10 2113 kanban',kind:'kanban',visibility:'private',layout_id:T.LEADS_STD,settings:{categorize_field:'lead_status',aggregate_field:null,header_style:'default',card_fields:['first_name']}});
out.view=v.s+' '+(v.j?.data?.id||v.t.slice(0,300)); if(v.j?.data?.id) ledger(`view ${v.j.data.id} "QA RT r10 2113 kanban" (Leads kanban)`);
const A=await X.lead('o','QA RT r10 2113 A unaccounted',{}); const B=await X.lead('o','QA RT r10 2113 B interested',{lead_status:'Interested'});
out.A=A.j?.data?.id; out.B=B.j?.data?.id;
return out;
