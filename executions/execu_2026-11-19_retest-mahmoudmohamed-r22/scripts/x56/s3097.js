const LA=['51666421-12cb-426e-b91e-3003a2a1f923','45ffbc5b-7859-4c21-be9e-7b5f30747ca2'];const o={};
const q=await api('POST','/desk/agents/departments/query',{agent_user_ids:LA});o.depts=JSON.stringify(q.j?.data).slice(0,400);
const dl=(q.j?.data?.items||q.j?.data||[]);const first=Array.isArray(dl)?dl.find(x=>(x.departments||x.department_ids||[]).length):null;
const pick=first?{u:first.agent_user_id||first.user_id,d:(first.departments||[])[0]?.id||(first.department_ids||[])[0]}:null;o.pick=pick;
if(pick&&pick.d){const r=await api('POST','/desk/teams',{name:'QA RT22 3097 light team',description:'QA RT22 retest, delete after',department_id:pick.d,sources:[{kind:'agent',ref_id:pick.u}],color:'blue',icon:'star'});o.createWithLight=E(r)+' '+(r.j?.data?.id||'');if(r.j?.data?.id){made.other.push('team '+r.j.data.id);keep();LED('3097: team (UNEXPECTED) '+r.j.data.id);}
 const ok=await api('POST','/desk/teams',{name:'QA RT22 3097 full team',description:'QA RT22 retest, delete after',department_id:CS,sources:[{kind:'agent',ref_id:AG_A}],color:'blue',icon:'star'});o.createFull=E(ok);const tid=ok.j?.data?.id;if(tid){made.other.push('team '+tid);keep();LED('3097: team QA RT22 3097 full team '+tid);
  if(pick.d===CS){o.patchAddLight=E(await api('PATCH','/desk/teams/'+tid,{sources:[{kind:'agent',ref_id:AG_A},{kind:'agent',ref_id:pick.u}]}));}
  fs.writeFileSync(RUN+'/out/3097.json',JSON.stringify({tid,pick}));}}
return o;
