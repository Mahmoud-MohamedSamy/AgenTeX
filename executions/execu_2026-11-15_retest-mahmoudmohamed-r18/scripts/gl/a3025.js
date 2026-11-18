const CM='43004ce2-577f-4eda-b00a-0750fe40c3d4', TM='88e8ea44-1658-4df3-9930-d0902b91073d', MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const sv=v=>({kind:'string',value:v}); const o={};
const c=await api('POST','/modules/'+CM+'/records',{data:[{field:'last_name',value:sv('QA RT18 GL Contact')},{field:'email',value:sv('qa-rt18-gl@example.com')}]});
o.contact=c.s+' '+(c.j&&c.j.data&&c.j.data.id||c.t.slice(0,300)); const CON=c.j&&c.j.data&&c.j.data.id; if(!CON) return o;
for (const [n,p] of [['T1','High'],['T2','Low']]) { const r=await api('POST','/modules/'+TM+'/records',{data:[{field:'subject',value:sv('QA RT18 3025 '+n)},{field:'department',value:sv(MK)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-gl@example.com')},{field:'status',value:sv('Open')},{field:'priority',value:sv(p)}]}); o[n]=r.s+' '+(r.j&&r.j.data&&r.j.data.id||r.t.slice(0,300)); }
return o;
