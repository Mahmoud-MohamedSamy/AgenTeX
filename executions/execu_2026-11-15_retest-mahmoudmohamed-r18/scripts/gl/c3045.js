const TM='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const me=await api('GET','/iam/me'); o.me=me.s+' '+((me.j&&me.j.data&&(me.j.data.displayName||me.j.data.display_name))||'');
for (const [k,id] of [['B1 #4067','ca675941-80ec-4595-a9f1-b095c31dbc3b'],['B2 #4068','8da30ddb-a776-44e7-876f-da067db076f1'],['ctrl MK owner','eeade064-440e-4cee-b77b-fb10e453cd29'],['CS #4061','637e248a-a282-4d6e-a443-d0ae78ac737e']]) {
  const r=await api('GET','/modules/'+TM+'/records/'+id); const d=await api('GET','/desk/tickets/'+id); const c=await api('GET','/desk/tickets/'+id+'/replies');
  o[k]={record:r.s+(r.s>=400?' '+((r.j&&r.j.error&&r.j.error.code)||''):''), desk:d.s, replies:c.s};
}
const s=await api('GET','/modules/'+TM+'/records?limit=20&q='+encodeURIComponent('QA RT18 3045')); o.search=s.s+' '+JSON.stringify(arr(s.j&&s.j.data).map(x=>((x.data||[]).find(f=>f.field==='subject')||{}).value&&((x.data||[]).find(f=>f.field==='subject')).value.value));
const s2=await api('GET','/modules/'+TM+'/records?limit=20&q='+encodeURIComponent('QA RT18 3022 dept')); o.searchCS=s2.s+' '+arr(s2.j&&s2.j.data).length;
return o;
