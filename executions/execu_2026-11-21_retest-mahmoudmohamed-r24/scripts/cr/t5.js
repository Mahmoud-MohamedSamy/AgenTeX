eval(fs.readFileSync('cr/lib.js','utf8'));const o={};
const L=arr((await api('GET','/modules/'+T+'/records?take=20&search='+encodeURIComponent('QA RT20 CR child'))).j?.data);
o.child=L.map(c=>{const x={};for(const f of c.data||[])x[f.field]=val(f.value);return {id:c.id,num:c.recordNumber||c.number,subject:x.subject,status:x.status,department:x.department,layout:c.layoutId||x.layout_id};});
const E=arr((await api('GET','/modules/6fb19115-9356-40f0-b064-840d8f1fad93/records?take=20&search='+encodeURIComponent('Create Event'))).j?.data);o.events=E.map(c=>{const x={};for(const f of c.data||[])x[f.field]=val(f.value);return {id:c.id,title:x.title,created:c.createdAt||c.created_at||x.created_time};});
const r=await api('POST',`/modules/${T}/records`,{data:[{field:'subject',value:enc('QA RT20 CR 3052 nostatus api control')},{field:'department',value:enc(D)}]});o.apiNoStatus=r.s+' '+(r.s>=300?r.t.slice(0,300):'');if(r.j?.data?.id){led(`ticket "QA RT20 CR 3052 nostatus api control" ${r.j.data.id}`);const t=await getTicket(r.j.data.id);o.apiNoStatusStatus=t.status;}
const tk=JSON.parse(fs.readFileSync(OUTD+'t3-tickets.json','utf8'));o.nums={};for(const [k,t] of Object.entries(tk.t)){const g=(await api('GET',`/modules/${T}/records/${t.id}`)).j?.data;o.nums[k]=g?.recordNumber??g?.number??g?.ticketNumber??Object.keys(g||{}).join(',');}
return o;
