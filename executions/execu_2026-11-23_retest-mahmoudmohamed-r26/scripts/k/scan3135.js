const r=await api('GET','/modules/'+TK+'/records?limit=200&sort=-updated_at');const it=arr(r.j);const o={list:r.s,n:it.length,drift:[],checked:0};
const val=(x,f)=>{const v=(x.data||[]).find(d=>d.field===f)?.value;return v?.value;};
for(const x of it){let rv=val(x,'status');if(rv===undefined)rv=(await rec(x.id)).status;const d=(await api('GET','/desk/tickets/'+x.id)).j?.data;if(!d)continue;o.checked++;
 if(rv!==d.status)o.drift.push({n:d.ticket_number,rec:rv,desk:d.status,upd:(d.updated_at||'').slice(0,19)});}
return o;
